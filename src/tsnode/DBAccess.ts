/// <reference path="../../levelup.d.ts" />

import levelup = require("levelup");
import {BusDevice} from "./Bus";
import {ValueAnswerMessage, Value, ReplayRequestMessage, ReplayValueMessage, DBRequestMessage, Message, ValueMessage,
    Topic, DashboardMessage, DashboardRspMessage} from "./messages";
import {ReplayInfoMessage} from "./messages";

// The entry types that are to be written to the database:

/**
 * Class containing a sensor value. Instances of this class are serialized via JSON-stringify
 * and written to the database.
 * Values are saved with their respective topic strings
 */
class SensorValueEntry {
    topic: string;
    value: any;

    /**
     * Initializes the entry with its topic and value
     * @param topic: The topic of the value's type
     * @param value: The value to be written to the database
     */
    constructor(topic: string, value:any) {
        this.topic = topic;
        this.value = value;
    }
}

/**
 * Class containing driver-specific information. Instances of this class are serialized via JSON-stringify
 * and written to the database.
 */
class UserInfoEntry {
    public dashboardConfig : string;

    /**
     * Initializes the entry with a given configuration for the dashboard.
     * @param dbc: Configuration for the dashboard, usually serialized via JSON-stringify
     */
    constructor (dbc: string) {
        this.dashboardConfig = dbc;
    }
}

/**
 * Class containing information about the database itself. Instances of this class are serialized via JSON-stringify
 * and written to the database.
 */
class DBInfoEntry {
    size: number;
    currentDrive: number;
    maxCapacity: number;

    /**
     * Initializes the entry with a given maximum capacity and drive#.
     * The size parameter is set during the start of the database.
     * @param maxCapacity: Specified maximum capacity of the database
     * @param currentDrive: # of the current system run
     */
    constructor(maxCapacity: number, currentDrive: number) {
        this.maxCapacity = maxCapacity;
        this.size = 0;
        this.currentDrive = currentDrive;
    }
}

/**
 * Class representing the database keys for sensor values, consisting of a timestamp (in ms) and the drive#.
 * Instances of this class are serialized via JSON-stringify and written to the database.
 */
class ValueEntryKey {
    time: number;
    driveNr: number;

    /**
     * Initializes the entry key with a given drive# and Date object, which is then converted to ms.
     * In the context of the database, the Date is to be interpreted as ms since drive begin.
     * @param dnr: # of the drive the corresponding value came up in
     * @param t: The timestamp relative to drive begin, when the corresponding value came up
     */
    constructor(dnr:number, t:Date) {
        this.time = t.getTime();
        this.driveNr = dnr;
    }
}

/**
 * Class containing information of all available replays. The indices of finishTime represent the drive#s, the values
 * in the array are the time of that drive in ms
 */
class ReplayInfo {
    finishTime: number[];

    /**
     * Initializes an empty array that is to be filled for each drive individually
     */
    constructor() {
        this.finishTime = [];
    }
}

/**
 * The Class granting access to an instance of LevelUP backed by LevelDOWN. The class holds information of the database
 * in a DBInfoEntry, the information of the current driver, information of passed drives in a ReplayInfo
 * and the global time at the begin of the current drive.
 */
class LevelDBAccess {
    private DBInfo: DBInfoEntry;
    private currentDriver: string;
    private db;
    replayInfo: ReplayInfo;
    private driveBegin: number;

    /**
     * Initializes the LevelDBAccess.
     */
    constructor() {
        // sets the begin of the current drive to the current Date in ms
        this.driveBegin = new Date().getDate();

        // initializes or opens the LevelUP-instance on a specified path
        this.db = levelup('./testDB', function(err, db){
        if(err) console.log("Error in opening the Database: " + err);
        this.db = db;
    });

        /*
        * initializes the DBInfoEntry: The DBInfoEntry is fetched from the database. If there is no DBInfoEntry in the
        * database, a new one is created with default values.
        */
        this.DBInfo = new DBInfoEntry(10000, 0);
        this.db.get("INFO", function (err, value) {
            if(err) {
                if(err.notFound) {
                    this.db.put("INFO", JSON.stringify(new DBInfoEntry(10000, 0)), function(err) {
                        if(err) console.log("Error in putting Entry: " + err);
                    });
                } else {
                    console.log("Error: Something went wrong fetching an Entry: " + err);
                }
            } else {
                this.DBInfo = new DBInfoEntry(JSON.parse(value).maxCapacity, JSON.parse(value).currentDrive + 1);
            }
        }.bind(this));

        /*
        * scans the db for replay information and writes it to the replay information object. Also, the size variable
        * in the DBInfoEntry is set here.
        */
        this.replayInfo = new ReplayInfo();
        this.db.createReadStream().on('data', function(data) {
            var key = <string> data.key;
            this.DBInfo.size++;
            if(key[0] == '{' && key[1] == '"') { //check if the string could be a JSON-String
                var parsed = JSON.parse(data.key);
                if (parsed.hasOwnProperty('time') && parsed.hasOwnProperty('driveNr')) {
                    if (typeof this.replayInfo.finishTime[parsed.driveNr] == 'undefined' ||
                            this.replayInfo.finishTime[parsed.driveNr] < parsed.time) {
                        this.replayInfo.finishTime[parsed.driveNr] = parsed.time;
                    }
                }
            }
        }.bind(this));
        this.currentDriver = null;
    }

    /**
     * Writes a value with its corresponding topic to the database, using the current date and drive# as the key.
     * @param topicID: The topic corresponding to the given value
     * @param value: The value that is to be written to the db
     */
    putSensorValue(topicID: string, value: any) {
        //initializes the key
        var key: ValueEntryKey = new ValueEntryKey(this.DBInfo.currentDrive,
            new Date(new Date().getDate() - this.driveBegin));

        //puts the value to the db with its key
        this.db.put(JSON.stringify(key), JSON.stringify(new SensorValueEntry(topicID, value)), function(err) {
            if (err) console.log("Error in putting Entry:" + err);
        });

        //increments the size variable and, if necessary, deletes entries from the db
        this.incrementSize();
        this.deleteOnMaxCapacity();
    }

    /**
     * Writes the information of a new user to the database.
     * @param user: The generated ID of the user
     * @param config: The user's dashboard configuration
     */
    putUserInfo(user: string, config: string) {
        this.db.put(user, JSON.stringify(new UserInfoEntry(config)), function(err) {
            if(err) console.log(err);
        });
    }

    /**
     * Deletes value entries from the database if there are more entries than the specified maximum database capacity
     */
    private deleteOnMaxCapacity() {
        if(this.DBInfo.size > this.DBInfo.maxCapacity) {
            var listOfKeys: any[] = [];

            //function on every item of the stream; adds all value keys to an array
            this.db.createKeyStream().on('data', function(data){
                if(JSON.parse(data).hasOwnProperty('time')) {
                    listOfKeys.push(data);
                }
            }.bind(this)).on('end', function() { //function on the end of the stream, does the actual reducing
                var newSize: number = this.DBInfo.maxCapacity * 0.9;
                var i: number = 0;
                while(this.DBInfo.size > newSize){
                    //if a key is among the oldest keys, it is deleted:
                    this.deleteFromKey(listOfKeys[i]);
                    this.decrementSize();
                    i++;
                }
            }.bind(this));
        }
    }

    /**
     * Assisting method; deletes an entry from the db
      * @param k: The key of the entry to be deleted.
     */
    protected deleteFromKey(k: any) {
        this.db.get(k, function(value, err) {
            if(err && !err.notFound) {
                console.log(err);
            } else {
                this.db.del(k);
            }
        });
    }

    /**
     * Increments the size variables of the database, both in the local DBAccess object and the database.
      */
    private incrementSize() {
        this.DBInfo.size++;
        this.deleteFromKey("INFO");
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){
            if(err){
                console.log("Error in putting updated size to the Database: " + err)
            }
        });
    }

    /**
     * Decrements the size variables of the database, both in the local DBAccess object and the database.
     */
    private decrementSize() {
        this.DBInfo.size--;
        this.deleteFromKey("INFO");
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){
            if(err){
                console.log("Error in putting updated size to the Database: " + err)
            }
        });
    }

    /**
     * Returns value entries from the database to a callback function. The callback function should take 2 parameters,
     * an array of SensorValueEntries and an array of key objects.
     * @param topicID: The topic of the values that is to be returned. value.* for all values is possible.
     * @param drivenr: The drive#, for which the values are to be returned.
     * @param beginDate: The date (in ms) within the drive, from which on the values are to be returned
     * @param endDate: The date (in ms) within the drive, up to which the values are to be returned
     * @param callback: The callback function, to which an array of SensorValueEntries and ValueEntryKeys are returned
     */
    public getEntries(topicID: string, drivenr: number, beginDate: number, endDate: number, callback) {
        var listOfKeys: ValueEntryKey[] = [];
        var listOfEntries: SensorValueEntry[] = [];
        if(drivenr >= 0) {
            var lte = JSON.stringify(new ValueEntryKey(drivenr, new Date(endDate)));
            var gte = JSON.stringify(new ValueEntryKey(drivenr, new Date(beginDate)));
        } else if(drivenr == -1) {
            var lte = JSON.stringify(new ValueEntryKey(this.DBInfo.currentDrive, new Date(endDate)));
            var gte = JSON.stringify(new ValueEntryKey(this.DBInfo.currentDrive, new Date(beginDate)));
        }
        this.db.createReadStream({gte: gte, lte: lte}).on('data', function (data) {
            var parsed = JSON.parse(data.key);
            if (parsed.hasOwnProperty('time') && parsed.hasOwnProperty('driveNr')) {
                var sve = new SensorValueEntry(JSON.parse(data.value).topic, JSON.parse(data.value).value);
                if (sve.topic == topicID || topicID == "value.*") {
                    listOfKeys[listOfKeys.length] = new ValueEntryKey(parsed.driveNr, parsed.time);
                    listOfEntries[listOfEntries.length] = sve;
                }
            }
        }).on('end', function () {
                callback(listOfEntries, listOfKeys);
            });
    }

    /**
     * Returns the UserInfoEntry for a given user ID to a callback function. If there is no such entry in the database,
     * a standard entry is created, put to the database and returned to the callback function.
     * @param userID: The user's generated ID.
     * @param callback: The callback function, to which the UserInfoEntry is returned.
     */
    public getDriverEntry(userID: string, callback) {
        this.db.get(userID, function(value, err) {
            if(err) {
                if(err.notFound) {
                    var standardConfig: string = '[{"row":1,"col":1,"size_x":4,"size_y":4,"name":' +
                        '"SpeedGauge","id":140},{"row":1,"col":5,"size_x":3,"size_y":3,' +
                        '"name":"PercentGauge","id":150},{"row":1,"col":8,"size_x":4,"size_y":4,' +
                        '"name":"PercentGauge","id":350}]';
                    this.dbAccess.putUserInfo(userID, standardConfig, function(err) {
                        console.log(err);
                    });
                    callback(new UserInfoEntry(standardConfig));
                } else {
                    console.log(err);
                }
            } else {
                var dr = new UserInfoEntry(JSON.parse(value).dashboardConfig);
                callback(dr);
            }
        })
    }
}

/**
 * The BusDevice enabling the database to communicate with the message bus on the server.
 */
class DBBusDevice extends BusDevice {

    private dbAccess: LevelDBAccess;

    /**
     * Initializes the DBBusDevice with a new instance of the LevelDBAccess and subscribes to all relevant topics on the
     * bus.
     */
    constructor() {
        super();
        this.dbAccess = new LevelDBAccess();
        this.subscribe(Topic.SETTINGS_MSG);
        this.subscribe(Topic.DBREQ_MSG);
        this.subscribeAll(Topic.VALUES);
        this.subscribe(Topic.DASHBOARD_MSG);
        this.subscribe(Topic.REPLAY_REQ);
    }

    /**
     * Sends a message containing an array of SensorValueEntries and an array of corresponding timestamps (in ms since
     * drive begin) to the Bus.
     * @param content: The array of SensorValueEntries to be sent
     * @param times: The array of corresponding timestamps to be sent
     * @param topic: The Topic of the contained values
     */
    private sendValueMessage(topic: Topic, content: SensorValueEntry[], times: number[]) {
        this.broker.handleMessage(new ValueAnswerMessage(topic, times, content));
    }

    /**
     * Sends a message containing a JSON-stringified dashboard configuration and an userID to the Bus
     * @param user: The generated ID of a user
     * @param content: The JSON-stringified dasboard configuration
     */
    private sendDashboardRspMessage(user: string, content: string){
        this.broker.handleMessage(new DashboardRspMessage(user, content));
    }

    /**
     * Handles a message from the Bus. Depending on the type and content of the message, different functions are called.
     * @param m: The message received from the Bus.
     */
    public handleMessage(m: Message): void {

        //If the given message is a DBRequestMessage, the Request is handled and a response message is sent.
        if(m.topic.name == Topic.DBREQ_MSG.name) {
            //handling of a Value Request: Values are fetched from the DB and a value response is sent
            var dbValueReq = <DBRequestMessage> m;
            this.dbAccess.getEntries(dbValueReq.reqTopic.getName(), dbValueReq.driveNr, dbValueReq.beginDate.getDate(), dbValueReq.endDate.getDate(), function(res, tim){
                this.sendValueMessage(dbValueReq.reqTopic, res, tim);
            }.bind(this));
        }

        //If the given message is a regular value message, it is written to the db
        else if (DBBusDevice.startsWith(m.topic.name, "value.")) {
            var valuemes = <ValueMessage> m;
            this.dbAccess.putSensorValue(valuemes.value.getIdentifier(), valuemes.value.numericalValue);
        }
        //If the given message is a DashboardMessage, it is either written to the db or fetched from the db
        else if(m.topic.name == Topic.DASHBOARD_MSG.name) {
            var dbm = <DashboardMessage> m;
            if(dbm.request) {
                this.dbAccess.getDriverEntry(dbm.user, function(value) {
                    this.sendDashboardRspMessage(dbm.user, value.dashboardConfig);
                }.bind(this));
                this.broker.handleMessage(new ReplayInfoMessage(this.dbAccess.replayInfo.finishTime));
            } else {
                this.dbAccess.getDriverEntry(dbm.user, function() {
                    this.dbAccess.deleteFromKey(dbm.user);
                    this.dbAccess.putUserInfo(dbm.user, dbm.config);
                }.bind(this));
            }
        }
        //if the given Message is a replay request, a new Replay is started
        else if(m.topic.name == Topic.REPLAY_REQ.name) {
            var rreq = <ReplayRequestMessage> m;
            if(rreq.startStop) {
                this.dbAccess.getEntries("value.*", rreq.driveNr, 0,
                    this.dbAccess.replayInfo.finishTime[rreq.driveNr], function (res, tim) {
                        new Replay(this.dbAccess.replayInfo, rreq.callerID).replay(res, tim);
                    }.bind(this));
            }
        }
        //  } else if (m instanceof SettingsMessage) {
        // TODO: understand the organisation David's Settings Message and put them to the db accordingly
        // }
    }

    /**
     * Assisting method. Checks if a given string starts with another given string.
     * @param s: The string that is to be checked for start string
     * @param t: The string for which the other string is to be checked
     * @returns {boolean}: True, if string s starts with string t
     */
    private static startsWith(s: string, t: string): boolean {
        var i = 0;
        while(i < s.length && i < t.length) {
            if(s[i] == t[i]) {
                i++;
            } else {
                return false;
            }
        }
        return true;
    }
}

/**
 * Class implementing the active replay of a certain drive.
 */
class Replay extends BusDevice {

    private replayInfo: ReplayInfo;
    private cnt: number;
    private slp: number;
    private vals: SensorValueEntry[];
    private times: number[];
    private continueLoop: boolean;
    private callerID: string;

    /**
     * Initializes the Replay with a given ReplayInformation-object and the user ID of the user calling for that
     * specific replay. Also subscribes on REPLAY_REQ- messages to stop the replay if necessary.
     * @param ri: The ReplayInformation object of the database
     * @param callerID: The user ID of the calling user
     */
    constructor (ri: ReplayInfo, callerID: string) {
        super();
        this.replayInfo = ri;
        this.cnt = 0;
        this.continueLoop = true;
        this.callerID = callerID;
        this.subscribe(Topic.REPLAY_REQ);
    }

    /**
     * The handleMessage-method. If a REPLAY_REQ message with a set STOP flag is received from the user
     * whose ID is held, the replay is stopped.
     * @param m
     */
    public handleMessage(m: Message) {
        if(m.topic.name == Topic.REPLAY_REQ.name) {
            var rreq = <ReplayRequestMessage> m;
            if (!rreq.startStop && rreq.callerID == this.callerID) {
                this.continueLoop = false;
            }
        }
    }

    /**
     * Does the actual replay. Takes SensorValueEntries and timestamps (in ms) as parameters and simulates a drive with
     * those values.
     * @param vals: An array of SensorValueEntries; the values that will be put on the bus.
     * @param times: An array of timestamps (in ms) corresponding to the SensorValueEntriesl.
     */
    public replay(vals: SensorValueEntry[], times: number[]) {
        this.vals = vals;
        this.times = times;
        while(this.continueLoop) {
            setInterval(this.send.bind(this), this.slp);
        }
    }

    /**
     * Assisting method, sends a new SensorValueMessage to the Bus containing the next value. It is called in intervals
     * according to the temporal difference between the timestamps of two sensor values.
     */
    private send() {
        this.cnt++;
        this.broker.handleMessage(new ReplayValueMessage(new Value(this.vals[this.cnt].value, this.vals[this.cnt].topic)));
        if(this.cnt + 1 == this.times.length) {
            this.continueLoop = false;
        } else {
            this.slp = this.times[this.cnt + 1] - this.times[this.cnt];
        }
    }
}

export {DBBusDevice};

/// <reference path="../../typings/levelup/levelup.d.ts" />
/// <reference path ="C:\Program Files (x86)\JetBrains\WebStorm 11.0.3\plugins\JavaScriptLanguage\typescriptCompiler\external\lib.es6.d.ts"/>

import levelup = require("levelup");
import {BusDevice} from "./Bus";
import {ValueAnswerMessage, Value, ReplayRequestMessage, ReplayValueMessage, DBRequestMessage, Message, ValueMessage,
    Topic, DashboardMessage, DashboardRspMessage} from "./messages";
import {ReplayInfoMessage} from "./messages";
import leveldown = require("leveldown");

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
    constructor(dnr:number, t: number) {
        this.time = t;
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
        this.db.get("INFO", function (err, value) {
            if(err) {
                if(err.notFound) {
                    this.DBInfo = new DBInfoEntry(10000, 0);
                    this.db.put("INFO", JSON.stringify(this.DBInfo), function(err) {
                        if(err) console.log("Error in putting Entry: " + err);
                    });
                } else {
                    console.log("Error: Something went wrong fetching an Entry: " + err);
                }
            } else {
                this.DBInfo = new DBInfoEntry(JSON.parse(value).maxCapacity, JSON.parse(value).currentDrive + 1);
                this.db.put("INFO", JSON.stringify(this.DBInfo), function(err) {
                    if(err) console.log("Error in putting Entry: " + err);
                });
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
            new Date().getDate() - this.driveBegin);

        //puts the value to the db with its key
        this.db.put(JSON.stringify(key), JSON.stringify(new SensorValueEntry(topicID, value)), {sync: true},
            function(err) {
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
        this.deleteFromKey(user);
        this.db.put(user, JSON.stringify(new UserInfoEntry(config)), {sync: true}, function(err) {
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
                var key = data;
                if(key[0] == '{' && key[1] == '"') { //check if the string could be a JSON-String
                    if(JSON.parse(data).hasOwnProperty('time')) {
                        listOfKeys.push(data);
                    }
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
    deleteFromKey(k: any) {
        try {
            this.db.del(k, function(err) {
                if(err && !err.notFound) {
                    console.log(err);
                }
            }.bind(this));
        } catch(e) {
            console.log(e);
        }
    }

    /**
     * Increments the size variables of the database, both in the local DBAccess object and the database.
     */
    private incrementSize() {
        this.DBInfo.size++;
        this.deleteFromKey("INFO");
        this.db.put("INFO", JSON.stringify(this.DBInfo), {sync: true}, function(err){
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
        this.db.put("INFO", JSON.stringify(this.DBInfo), {sync: true}, function(err){
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
            var lte = JSON.stringify(new ValueEntryKey(drivenr, endDate));
            var gte = JSON.stringify(new ValueEntryKey(drivenr, beginDate));
        } else if(drivenr == -1) {
            var lte = JSON.stringify(new ValueEntryKey(this.DBInfo.currentDrive, endDate));
            var gte = JSON.stringify(new ValueEntryKey(this.DBInfo.currentDrive, beginDate));
        }
        this.db.createReadStream({gte: gte, lte: lte}).on('data', function (data) {
            var key = data.key;
            if(key[0] == '{' && key[1] == '"') { //check if the string could be a JSON-String
                var parsed = JSON.parse(data.key);
                if (parsed.hasOwnProperty('time') && parsed.hasOwnProperty('driveNr')) {
                    var sve = new SensorValueEntry(JSON.parse(data.value).topic, JSON.parse(data.value).value);
                    if (sve.topic == topicID || topicID == "value.*") {
                        listOfKeys[listOfKeys.length] = new ValueEntryKey(parsed.driveNr, parsed.time);
                        listOfEntries[listOfEntries.length] = sve;
                    }
                }
            }

        }.bind(this)).on('end', function () {
            callback(listOfEntries, listOfKeys);
        }.bind(this));
    }

    /**
     * Returns the UserInfoEntry for a given user ID to a callback function. If there is no such entry in the database,
     * a standard entry is created, put to the database and returned to the callback function.
     * @param userID: The user's generated ID.
     * @param callback: The callback function, to which the UserInfoEntry is returned.
     */
    public getDriverEntry(userID: string, callback) {
        this.db.get(userID, function(err, value) {
            var callbackParam;
            if(err) {
                if(err.notFound) {
                    var standardConfig: string = '[{\"row\":1,\"col\":11,\"size_x\":7,\"size_y\":7,\"name\":' +
                        '\"SpeedGauge\",\"valueID\":\"value.speed\"},{\"row\":1,\"col\":1,\"size_x\":8,\"size_y\":' +
                        '7,\"name\":\"SpeedGauge\",\"valueID\":\"value.RPM\"},{\"row\":8,\"col\":2,\"size_x\":6,' +
                        '\"size_y\":5,\"name\":\"TextWidget\",\"valueID\":\"value.engine runtime\"},{\"row\":8,' +
                        '\"col\":8,\"size_x\":5,\"size_y\":5,\"name\":\"PercentGauge\",\"valueID\":\"value.fuel\"},' +
                        '{\"row\":8,\"col\":14,\"size_x\":4,\"size_y\":2,\"name\":\"TextWidget\",\"valueID\":' +
                        '\"value.aggregated.fuel consumption\"},{\"row\":10,\"col\":14,\"size_x\":5,\"size_y\":2,' +
                        '\"name\":\"TextWidget\",\"valueID\":\"value.temperature outside\"}]';
                    this.putUserInfo(userID, standardConfig);
                    callbackParam = new UserInfoEntry(standardConfig);
                } else {
                    console.log(err);
                }
            } else {
                callbackParam = new UserInfoEntry(JSON.parse(value).dashboardConfig);
            }
            callback(callbackParam);
        }.bind(this));
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
        else if (m.topic.name.startsWith("value.") || m instanceof ValueMessage) {
            var valuemes = <ValueMessage> m;
            this.dbAccess.putSensorValue(valuemes.topic.name, valuemes.value.numericalValue);
        }
        //If the given message is a DashboardMessage, it is either written to the db or fetched from the db
        else if(m.topic.name == Topic.DASHBOARD_MSG.name) {
            var dbm = <DashboardMessage> m;
            if(dbm.request) {
                this.dbAccess.getDriverEntry(dbm.user, function(value) {
                    this.broker.handleMessage(new DashboardRspMessage(dbm.user, value.dashboardConfig));
                }.bind(this));
                this.broker.handleMessage(new ReplayInfoMessage(this.dbAccess.replayInfo.finishTime));
            } else {
                    this.dbAccess.putUserInfo(dbm.user, dbm.config);
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
        else if(m.topic.name == Topic.SETTINGS_MSG.name) {
       //     var smsg = <SettingsMessage> m;
        }
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

export {DBBusDevice, LevelDBAccess};

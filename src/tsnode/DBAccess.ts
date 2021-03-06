/// <reference path="../../typings/levelup/levelup.d.ts" />
/// <reference path="../../typings/json-stable-stringify/json-stable-stringify.d.ts" />
/// <reference path="messages.ts" />
import {Topic} from "./messages";


import levelup = require("levelup");
import {BusDevice} from "./Bus";
import {Utils} from "./Utils";
import leveldown = require("leveldown");
import stringify = require("json-stable-stringify");
import {ValueAnswerMessage} from "./messages";
import {Message} from "./messages";
import {DBRequestMessage} from "./messages";
import {ValueMessage} from "./messages";
import {DashboardMessage} from "./messages";
import {DashboardRspMessage} from "./messages";
import {ReplayInfoMessage} from "./messages";
import {ReplayRequestMessage} from "./messages";
import {SettingsRequestMessage} from "./messages";
import {SettingsResponseMessage} from "./messages";
import {ReplayValueMessage} from "./messages";
import {Value} from "./messages";

// The entry types that are to be written to the database:

/**
 * Class containing a sensor value. Instances of this class are serialized via JSON-stringify
 * and written to the database.
 * Values are saved with their respective topic strings
 */
class SensorValueEntry {
    topic: string;
    value: any;
    unit: string;

    /**
     * Initializes the entry with its topic and value
     * @param topic: The topic of the value's type
     * @param value: The value to be written to the database
     * @param unit: The Value Identifier
     */
    constructor(topic: string, value:any, unit: string) {
        this.topic = topic;
        this.value = value;
        this.unit = unit;
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
    driveNr: string;
    time: number;

    /**
     * Initializes the entry key with a given drive# and Date object, which is then converted to ms.
     * In the context of the database, the Date is to be interpreted as ms since drive begin.
     * @param dnr: # of the drive the corresponding value came up in
     * @param t: The timestamp relative to drive begin, when the corresponding value came up
     */
    constructor(dnr:number, t: number) {
        this.time = t;
        this.driveNr = this.stringpad(dnr);
    }

    private stringpad(n: number): string {
        var s: string = "" + n;
        var lzs = 10 - s.length;
        while(lzs != 0) {
            s = "0" + s;
            lzs--;
        }
        return s;
    }
}

/**
 * Class containing information of all available replays. The indices of finishTime represent the drive#s, the values
 * in the array are the time of that drive in ms
 */
class ReplayInfo {
    finishTime: number[];
    driveNr: number[];
    /**
     * Initializes an empty array that is to be filled for each drive individually
     */
    constructor() {
        this.finishTime = [];
        this.driveNr = [];
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
    private deleteInProcess: boolean;

    /**
     * Initializes the LevelDBAccess.
     */
    constructor() {
        // sets the begin of the current drive to the current Date in ms
        this.driveBegin = new Date().getTime();

        this.deleteInProcess = false;
        // initializes or opens the LevelUP-instance on a specified path
        this.db = levelup('../VINJAB-DB', function(err, db){
            if(err) console.log("Error in opening the Database: " + err);
            this.db = db;
        }.bind(this));

        /*
         * initializes the DBInfoEntry: The DBInfoEntry is fetched from the database. If there is no DBInfoEntry in the
         * database, a new one is created with default values.
         */
        this.db.get("INFO", function (err, value) {
            if(err) {
                if(err.notFound) {
                    this.DBInfo = new DBInfoEntry(10000000, 0);
                    this.db.put("INFO", stringify(this.DBInfo), function(err) {
                        if(err) console.log("Error in putting Entry: " + err);
                    });
                } else {
                    console.log("Error: Something went wrong fetching an Entry: " + err);
                }
            } else {
                this.DBInfo = new DBInfoEntry(JSON.parse(value).maxCapacity, JSON.parse(value).currentDrive + 1);
                this.db.put("INFO", stringify(this.DBInfo), function(err) {
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
                var parsed = JSON.parse(key);
                if (parsed.hasOwnProperty('time') && parsed.hasOwnProperty('driveNr')) {
                    if(typeof this.replayInfo.finishTime[parseInt(parsed.driveNr)] == "undefined" ||
                        this.replayInfo.finishTime[parseInt(parsed.driveNr)] < parsed.time){
                        this.replayInfo.finishTime[parseInt(parsed.driveNr)] = parsed.time;
                        this.replayInfo.driveNr[parseInt(parsed.driveNr)] = parseInt(parsed.driveNr);
                    }
                }
            }
        }.bind(this)).on('end', function () {
            /*while(this.replayInfo.finishTime[0] == null && this.replayInfo.finishTime.length != 0){
                this.replayInfo.finishTime.shift();
                this.replayInfo.driveNr.shift();
            }*/
        }.bind(this));
        this.currentDriver = null;
    }

    /**
     * Writes a value with its corresponding topic to the database, using the current date and drive# as the key.
     * @param topicID: The topic corresponding to the given value
     * @param value: The value that is to be written to the db
     * @param unit: The unit corresponding to the given value
     */
    putSensorValue(topicID: string, value: any, unit: string) {
        //initializes the key
        var key: ValueEntryKey = new ValueEntryKey(this.DBInfo.currentDrive,
            new Date().getTime() - this.driveBegin);
        //puts the value to the db with its key
        this.db.put(stringify(key), stringify(new SensorValueEntry(topicID, value, unit)), {sync: true},
            function(err) {
                if (err) console.log("Error in putting Entry:" + err);
            });
        //increments the size variable and, if necessary, deletes entries from the db
        this.incrementSize();
        if(!this.deleteInProcess) {
            this.deleteInProcess = true;
            this.deleteOnMaxCapacity();
        }
    }

    /**
     * Writes the information of a new user to the database.
     * @param user: The generated ID of the user
     * @param config: The user's dashboard configuration
     */
    putUserInfo(user: string, config: string) {
        this.deleteFromKey(user);
        this.db.put(user, stringify(new UserInfoEntry(config)), {sync: true}, function(err) {
            if(err) console.log(err);
        });
    }

    /**
     * Deletes value entries from the database if there are more entries than the specified maximum database capacity
     */
    private deleteOnMaxCapacity() {
        if(this.DBInfo.size > this.DBInfo.maxCapacity) {
            var listOfKeys: any[] = [];
            var lte = new ValueEntryKey(this.replayInfo.driveNr[0], this.replayInfo.finishTime[0]);

            //function on every item of the stream; adds all value keys to an array
            this.db.createKeyStream({lte: lte}).on('data', function(data){
                var key = data;
                if(key[0] == '{' && key[1] == '"') { //check if the string could be a JSON-String
                    if(JSON.parse(data).hasOwnProperty('time') && JSON.parse(data).hasOwnProperty('driveNr')) {
                        listOfKeys.push(data);
                    }
                }
            }.bind(this)).on('end', function() { //function on the end of the stream, does the actual reducing
                var newSize: number = this.DBInfo.maxCapacity * 0.9;
                var maxToDelete: number = this.DBInfo.size - newSize;
                var i: number = 0;
                while(i < maxToDelete){
                    //if a key is among the oldest keys, it is deleted:
                    this.deleteFromKey(listOfKeys[i]);
                    this.decrementSize();
                    i++;
                }
                this.deleteInProcess = false;
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
        this.db.put("INFO", stringify(this.DBInfo), {sync: true}, function(err){
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
        this.db.put("INFO", stringify(this.DBInfo), {sync: true}, function(err){
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
            var lte = stringify(new ValueEntryKey(drivenr, endDate));
            var gte = stringify(new ValueEntryKey(drivenr, beginDate));
        } else if(drivenr == -1) {
            var lte = stringify(new ValueEntryKey(this.DBInfo.currentDrive, endDate));
            var gte = stringify(new ValueEntryKey(this.DBInfo.currentDrive, beginDate));
        }
        this.db.createReadStream({gte: gte, lte: lte}).on('data', function (data) {
            var key = data.key;
            if(key[0] == '{' && key[1] == '"') { //check if the string could be a JSON-String
                var parsed = JSON.parse(data.key);
                if (parsed.hasOwnProperty('time') && parsed.hasOwnProperty('driveNr')) {
                    var sve = new SensorValueEntry(JSON.parse(data.value).topic, JSON.parse(data.value).value,
                                JSON.parse(data.value).unit);
                    if (sve.topic == topicID || topicID == "value.*") {
                        listOfKeys[listOfKeys.length] = new ValueEntryKey(parseInt(parsed.driveNr), parsed.time);
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
                    var standardConfig: string = '[{\"row\":1,\"col\":9,\"size_x\":9,\"size_y\":7,\"name\":' +
                        '\"SpeedGauge\",\"valueID\":\"value.speed\"},{\"row\":1,\"col\":1,\"size_x\":8,\"size_y\":7,' +
                        '\"name\":\"SpeedGauge\",\"valueID\":\"value.RPM\"},{\"row\":8,\"col\":1,\"size_x\":6,' +
                        '\"size_y\":5,\"name\":\"TextWidget\",\"valueID\":\"value.engine runtime\"},{\"row\":8,\"col\":' +
                        '7,\"size_x\":5,\"size_y\":5,\"name\":\"PercentGauge\",\"valueID\":\"value.fuel\"},{\"row\":8,' +
                        '\"col\":12,\"size_x\":6,\"size_y\":2,\"name\":\"TextWidget\",\"valueID\":' +
                        '\"value.aggregated.fuel consumption\"},{\"row\":10,\"col\":12,\"size_x\":6,\"size_y\":2,' +
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

    /**
     * puts a settings object to the db
     * @param s the settings object
     */
    public putSettings(s: string) {
        this.deleteFromKey("SETTINGS");
        this.db.put("SETTINGS", s, function(err){
            if(err) console.log(err);
        });
    }

    /**
     * gets a settings object from the db
     * @param callback function recieving the settings object
     */
    public getSettings(callback) {
        this.db.get("SETTINGS", function(err, value) {
            if(err){
                if(err.notFound) {
                    this.db.put("SETTINGS", "", function(err) {
                        if(err) console.log(err);
                    }.bind(this));
                    callback("");
                } else {
                    console.log(err);
                }
            } else {
                callback(value)
            }
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
        this.subscribe(Topic.SETTINGS_REQ_MSG);
        this.subscribe(Topic.DBREQ_MSG);
        this.subscribe(Topic.DASHBOARD_MSG);
        this.subscribe(Topic.REPLAY_REQ);
        this.subscribeAll(Topic.VALUES);
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
            this.dbAccess.getEntries(dbValueReq.reqTopic.getName(), dbValueReq.driveNr, dbValueReq.beginDate.getTime(), dbValueReq.endDate.getTime(), function(res, tim){
                this.sendValueMessage(dbValueReq.reqTopic, res, tim);
            }.bind(this));
        }
        //If the given message is a regular value message, it is written to the db
        else if (Utils.startsWith(m.topic.name, "value.") || m instanceof ValueMessage) {
            var valuemes = <ValueMessage> m;
            this.dbAccess.putSensorValue(valuemes.topic.name, valuemes.value.value, valuemes.value.identifier);
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
        else if(m.topic.name == Topic.SETTINGS_REQ_MSG.name) {
            var srm = <SettingsRequestMessage> m;
            if(srm.readFromDB){
                this.dbAccess.getSettings(function(settings){
                    this.broker.handleMessage(new SettingsResponseMessage(settings));
                }.bind(this));
            } else {
                this.dbAccess.putSettings(srm.settings);
            }
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
    private times: ValueEntryKey[];
    private callerID: string;
    private stop: boolean;

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
        this.callerID = callerID;
        this.subscribe(Topic.REPLAY_REQ);
        this.stop = false;
    }

    /**
     * The handleMessage-method. If a REPLAY_REQ message with a set STOP flag is received from the user
     * whose ID is held, the replay is stopped.
     * @param m the Message received
     */
    public handleMessage(m: Message) {
        if(m.topic.name == Topic.REPLAY_REQ.name) {
            var rreq = <ReplayRequestMessage> m;
            if (!rreq.startStop && rreq.callerID == this.callerID) {
                this.stop = true;
            }
        }
    }

    /**
     * Does the actual replay. Takes SensorValueEntries and timestamps (in ms) as parameters and simulates a drive with
     * those values.
     * @param vals: An array of SensorValueEntries; the values that will be put on the bus.
     * @param times: An array of timestamps (in ms) corresponding to the SensorValueEntriesl.
     */
    public replay(vals: SensorValueEntry[], times: ValueEntryKey[]) {
        this.vals = vals;
        this.times = times;
        setTimeout(this.send.bind(this), this.slp);
    }

    /**
     * Sends a new SensorValueMessage to the Bus containing the next value. It calls itself in intervals
     * according to the temporal difference between the timestamps of two sensor values.
     */
    private send() {
        this.cnt++;
        this.broker.handleMessage(new ReplayValueMessage(new ValueMessage(new Topic(this.vals[this.cnt].topic),
            new Value(this.vals[this.cnt].value, this.vals[this.cnt].unit)), this.callerID));
        if(this.cnt + 1 == this.times.length || this.stop) {
            return
        } else {
            this.slp = this.times[this.cnt + 1].time - this.times[this.cnt].time;
            setTimeout(this.send.bind(this), this.slp);
        }
    }
}

export {DBBusDevice, LevelDBAccess};

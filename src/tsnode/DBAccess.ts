/// <reference path="../../levelup.d.ts" />

import levelup = require("levelup");
import {BusDevice} from "./Bus";
import {ValueAnswerMessage, Value, ReplayRequestMessage, ReplayValueMessage, DBRequestMessage, Message, ValueMessage,
    Topic, DashboardMessage, DashboardRspMessage} from "./messages";
import {ReplayInfoMessage} from "./messages";

// The entry types that are to be written to the database:

// Entry class for Sensor values
class SensorValueEntry {
    topic: string;
    value: any;

    //initialises the SensorValueEntry with its value
    constructor(topic: string, value:any) {
        this.topic = topic;
        this.value = value;
    }
}

// Entry class for driver-specific info (dashboard-config, preferred fuel, whatever else we want to know)
class DriverInfoEntry {
    public dashboardConfig : string;

    //initialises a new DriverInfoEntry with a standard dashboardconfig and no preferred fuel
    constructor (dbc: string) {
        this.dashboardConfig = dbc;
    }
}

// class for a database entry containing necessary information for the boot of the database module
class DBInfoEntry {
    size: number;
    currentDrive: number;
    maxCapacity: number;
    constructor(maxCapacity: number, currentDrive: number) {
        this.maxCapacity = maxCapacity;
        this.size = 0;
        this.currentDrive = currentDrive;
    }
}

class ValueEntryKey {
    time: number;
    driveNr: number;

    constructor(dnr:number, t:Date) {
        this.time = t.getTime();
        this.driveNr = dnr;
    }
}

class ReplayInfo {
    finishTime: number[];

    constructor() {
        this.finishTime = [];
    }
}

//The access class for the levelup instance
class LevelDBAccess {
    private DBInfo: DBInfoEntry;
    private currentDriver: string;
    private db;
    private busDevice: DBBusDevice;
    replayInfo: ReplayInfo;
    private driveBegin: number;

    //constructor, initialises the LevelDBAccess with a given DBBusDevice;
    constructor(busDevice : DBBusDevice) {
        this.driveBegin = new Date().getDate();
        this.db = levelup('./testDB', function(err, db){
        if(err) console.log("Error in opening the Database: " + err);
        this.db = db;
    });
        this.busDevice = busDevice;
        this.DBInfo = new DBInfoEntry(10000, 0);
        this.db.get("INFO", function (err, value) { //If there is no DBInfoEntry, it will be created.
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
        });
        // scans the db for replay information and writes it to the replay information object:
        this.replayInfo = new ReplayInfo();
        this.db.createReadStream().on('data', function(data) {
            if((<string> data.key).startsWith('{"')) {
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

    //puts a new sensor value to the database
    putSensorValue(topicID: string, value: any) {
        var key: ValueEntryKey = new ValueEntryKey(this.DBInfo.currentDrive,
            new Date(new Date().getDate() - this.driveBegin));
        this.db.put(JSON.stringify(key), JSON.stringify(new SensorValueEntry(topicID, value)), function(err) {
            if (err) console.log("Error in putting Entry:" + err);
        });
        this.incrementSize();
        this.deleteOnMaxCapacity();
    }

    //puts a new driver's information to the database
    putDriverInfo(driver: string, config: string) {
        this.db.put(driver, JSON.stringify(new DriverInfoEntry(config)));
    }

    /*
    if the current amount of entries in the db is greater than the set maximum size of the db, this function
    deletes the oldest data entries until the current size is 10% smaller than the set maximum size.
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

    //deletes an entry for a key from the db
    protected deleteFromKey(k: any) {
        this.db.get(k, function(value, err) {
            if(err && !err.notFound) {
                console.log(err);
            } else {
                this.db.del(k);
            }
        });
    }

    //increments the variables for the size of the database both locally and in the db entry
    private incrementSize() {
        this.DBInfo.size++;
        this.deleteFromKey("INFO");
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){
            if(err){
                console.log("Error in putting updated size to the Database: " + err)
            }
        });
    }

    //decrements the variables for the size of the database both locally and in the db entry
    private decrementSize() {
        this.DBInfo.size--;
        this.deleteFromKey("INFO");
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){
            if(err){
                console.log("Error in putting updated size to the Database: " + err)
            }
        });
    }

    //gives all entries of a specific topic-id as SensorValueEntries to a callback function
    public getEntries(topicID: string, drivenr: number, beginDate: number, endDate: number, callback) {
        var listOfKeys: number[] = [];
        var listOfEntries: SensorValueEntry[] = [];
        if(drivenr >= 0) { //TODO: test for string comparison in utf8
            var lte = JSON.stringify(new ValueEntryKey(drivenr, new Date(endDate)));
            var gte = JSON.stringify(new ValueEntryKey(drivenr, new Date(beginDate)));
        } else {
            var lte = JSON.stringify(new ValueEntryKey(this.DBInfo.currentDrive, new Date(endDate)));
            var gte = JSON.stringify(new ValueEntryKey(-1, new Date(beginDate)));
        }
        this.db.createReadStream({gte: gte, lte: lte}).on('data', function (data) {
            var parsed = JSON.parse(data.key);
            if (parsed.hasOwnProperty('time') && parsed.hasOwnProperty('driveNr')) {
                var sve = new SensorValueEntry(JSON.parse(data.value).topic, JSON.parse(data.value).value);
                if (sve.topic == topicID || topicID == "value.*") {
                    listOfKeys[listOfKeys.length] = data.key;
                    listOfEntries[listOfEntries.length] = sve;
                }
            }
        }).on('end', function () {
                callback(listOfEntries, listOfKeys);
            });
    }

    //calls levelup to find the config entry for a certain driver and gives it to a callback function
    public getDriverEntry(driver: string, callback) {
        this.db.get(driver, function(value, err) {
            if(err.notFound) {
                console.log(err + "The Driver was not yet put into the Database");
            } else if(err) {
                console.log("Error:" + err);
            } else {
                var dr = new DriverInfoEntry(JSON.parse(value).dashboardConfig);
                callback(dr);
            }
        })
    }
}

// the BusDevice for the Database. makes the db accessible and decodes messages to db requests
class DBBusDevice extends BusDevice {

    private dbAccess: LevelDBAccess;

    //initialises the BusDevice with a new instance of the LevelDBAccess and subscribes to all relevant topics.
    constructor() {
        super();
        this.dbAccess = new LevelDBAccess(this);
        this.subscribe(Topic.SETTINGS_MSG);
        this.subscribe(Topic.DBREQ_MSG);
        this.subscribeAll(Topic.VALUES);
        this.subscribe(Topic.DASHBOARD_MSG);
        this.subscribe(Topic.REPLAY_REQ);
    }

    public sendValueMessage(content: SensorValueEntry[], times: number[]) {
        this.broker.handleMessage(new ValueAnswerMessage(times, content));
    }

    public sendDashboardRspMessage(user: string, content: string){
        this.broker.handleMessage(new DashboardRspMessage(user, content));
    }

    //the overriden handleMessage-function. depending on the type of the message, a different action is performed.
    public handleMessage(m: Message): void {
        //If the given message is a DBRequestMessage, the Request is handled and a response message is sent.
        if(m.topic.name == Topic.DBREQ_MSG.name) {
            //handling of a Value Request: Values are fetched from the DB and a value response is sent
            var dbValueReq = <DBRequestMessage> m;
            this.dbAccess.getEntries(dbValueReq.reqTopic.getName(), dbValueReq.driveNr, dbValueReq.beginDate.getDate(), dbValueReq.endDate.getDate(), function(res, tim){
                this.sendValueMessage(res, tim);
            }.bind(this));
        }
        //If the given message is a regular value message, it is written to the db
        else if (m.topic.name.startsWith("value.")) {
            var valuemes = <ValueMessage> m;
            this.dbAccess.putSensorValue(valuemes.value.getIdentifier(), valuemes.value.numericalValue);
        }
        //If the given message is a DashboardMessage, it is either written to the db or fetched from the db
        else if(m.topic.name == Topic.DASHBOARD_MSG.name) {
            var dbm = <DashboardMessage> m;
            if(dbm.request) {
                this.dbAccess.getDriverEntry(dbm.user, function(value, err) {
                    if(err.notFound) {
                        var standardConfig: string = '[{"row":1,"col":1,"size_x":4,"size_y":4,"name":' +
                            '"SpeedGauge","id":140},{"row":1,"col":5,"size_x":3,"size_y":3,' +
                            '"name":"PercentGauge","id":150},{"row":1,"col":8,"size_x":4,"size_y":4,' +
                            '"name":"PercentGauge","id":350}]';
                        this.dbAccess.putDriverInfo(dbm.user, standardConfig, function(err) {
                            console.log(err);
                        });
                    } else if (err) {
                        console.log(err);
                    } else {
                        this.sendDashboardRspMessage(value.dashboardConfig);
                    }
                }.bind(this));
                this.broker.handleMessage(new ReplayInfoMessage(this.dbAccess.replayInfo.finishTime));
            } else {
                this.dbAccess.getDriverEntry(dbm.user, function(value, err) {
                    if(err.notFound) {
                        var standardConfig: string = '[{"row":1,"col":1,"size_x":4,"size_y":4,"name":' +
                            '"SpeedGauge","id":140},{"row":1,"col":5,"size_x":3,"size_y":3,' +
                            '"name":"PercentGauge","id":150},{"row":1,"col":8,"size_x":4,"size_y":4,' +
                            '"name":"PercentGauge","id":350}]';
                        this.dbAccess.putDriverInfo(dbm.user, standardConfig, function(err) {
                            console.log(err);
                        });
                    } else if (err) {
                        console.log(err);
                    } else {
                        this.dbAccess.deleteFromKey(dbm.user);
                        this.dbAccess.putDriverInfo(dbm.user, dbm.config);
                    }
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
}

class Replay extends BusDevice {

    private replayInfo: ReplayInfo;
    private cnt: number;
    private slp: number;
    private vals: SensorValueEntry[];
    private times: number[];
    private continueLoop: Boolean;
    private callerID: string;

    constructor (ri: ReplayInfo, callerID: string) {
        super();
        this.replayInfo = ri;
        this.cnt = 0;
        this.continueLoop = true;
        this.callerID = callerID;
        this.subscribe(Topic.REPLAY_REQ);
    }

    public handleMessage(m: Message) {
        if(m.topic.name == Topic.REPLAY_REQ.name) {
            var rreq = <ReplayRequestMessage> m;
            if (!rreq.startStop && rreq.callerID == this.callerID) {
                this.continueLoop = false;
            }
        }
    }

    public replay(vals: SensorValueEntry[], times: number[]) {
        this.vals = vals;
        this.times = times;
        while(this.continueLoop) {
            setInterval(this.send.bind(this), this.slp);
        }
    }

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
//          this.broker.handleMessage(new ReplayInfoMessage(this.replayInfo.beginnings, this.replayInfo.endings));
//          later, used for sending the replay info to a new Terminal

/// <reference path="../../levelup.d.ts" />

import levelup = require("levelup");
import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequest, DBRequestMessage, Message, ValueMessage, Topic, DashboardMessage, DashboardRspMessage} from "./messages";

// The entry types that are to be written to the database:

// Abstract class for all Entry types
abstract class DBEntry {

}

// Entry class for Sensor values
class SensorValueEntry extends DBEntry {
    driveNumber: number;
    topic: String;
    value: any;

    //initialises the SensorValueEntry with its value
    constructor(topic: String, value:any, drivenr: number) {
        super();
        this.topic = topic;
        this.value = value;
        this.driveNumber = drivenr;
    }
}

// Entry class for driver-specific info (dashboard-config, preferred fuel, whatever else we want to know)
class DriverInfoEntry extends DBEntry {
    public dashboardConfig : String;

    //initialises a new DriverInfoEntry with a standard dashboardconfig and no preferred fuel
    constructor (dbc: String) {
        super();
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

//The access class for the levelup instance
class LevelDBAccess {
    private DBInfo: DBInfoEntry;
    private currentDriver: String;
    private db;
    private busDevice: DBBusDevice;

    //constructor, initialises the LevelDBAccess with a given busdevice;
    constructor(busDevice : DBBusDevice) {
        this.currentDriver = null;
        this.db = levelup('./vinjabDB', function(err, db){
        if(err) console.log("Error in opening the Database:" + err);
        this.db = db;
    });
        this.busDevice = busDevice;
        this.DBInfo = new DBInfoEntry(2000, 0);
        this.db.get("INFO", function (err, value) { //If there is no DBInfoEntry, it will be created.
            if(err) {
                if(err.notFound) {
                    this.db.put("INFO", JSON.stringify(new DBInfoEntry(2000, 0)), function(err) {
                        if(err) console.log("Error in putting Entry:" + err);
                    });
                } else {
                    console.log("Error: Something went wrong fetching an Entry: " + err);
                }
            } else {
                this.DBInfo = new DBInfoEntry(JSON.parse(value).maxCapacity, JSON.parse(value).currentDrive + 1);
            }
        });
    }

    //puts a new sensor value to the database
    putSensorValue(topicID: String, value: any) {
        this.db.put(LevelDBAccess.dateToKey(new Date()), JSON.stringify(new SensorValueEntry(topicID, value, this.DBInfo.currentDrive)), function(err) {
            if (err) console.log("Error in putting Entry:" + err);
        });
        this.incrementSize();
        this.deleteOnMaxCapacity();
    }

    //assisting method converting the current date to a number, to serve as a key for the database
    public static dateToKey(date: Date): number {
        return date.getTime();
    }

    //puts a new driver's information to the database
    putDriverInfo(driver: String, config: String) {
        this.db.put(driver, JSON.stringify(new DriverInfoEntry(config)));
    }

    /*
    if the current amount of entries in the db is greater than the set maximum size of the db, this function
    deletes the oldest data entries until the current size is 10% smaller than the set maximum size.
     */
    private deleteOnMaxCapacity() {
        if(this.DBInfo.size > this.DBInfo.maxCapacity) {
            var listOfKeys: any[] = [];
            this.db.createKeyStream().on('data', function(data){ //function on every item of the stream; adds all keys to an array
                listOfKeys.push(data);
            }).on('end', function() { //function on the end of the stream, does the actual reducing
                listOfKeys.sort();
                var newSize: number = this.DBInfo.maxCapacity * 0.9;
                var i: number = 0;
                while(this.DBInfo.size > newSize){
                    //if a key is a number (= belongs to a value entry) and is among the oldest keys, it is deleted:
                    if(!isNaN(listOfKeys[i] + 0)) {
                        this.db.del(listOfKeys[i], function (err) {
                            if (err) console.log("Error while deleting entries: " + err);
                        });
                        this.decrementSize();
                    }
                    i++;
                }
            });
        }
    }

    //deletes an entry for a key from the db
    protected deleteFromKey(k: any) {
        this.db.get(k, function(value, err) {
            if(err && !err.notFound) {
                console.log(err);
            } else {
                this.db.delete(k);
            }
        })
    }

    //increments the variables for the size of the database both locally and in the db entry
    private incrementSize() {
        this.DBInfo.size++;
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){
            if(err){
                console.log("Error in putting updated size to the Database:" + err)
            }
        });
    }

    //decrements the variables for the size of the database both locally and in the db entry
    private decrementSize() {
        this.DBInfo.size--;
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){
            if(err){
                console.log("Error in putting updated size to the Database:" + err)
            }
        });
    }

    //gives all entries of a specific topic-id as SensorValueEntries to a callback function
    public getEntries(topicID: String, beginDate: number, endDate: number, callback) {
        var listOfKeys: number[] = [];
        var listOfEntries: SensorValueEntry[] = [];
        this.db.createReadStream().on('data', function(data){
            if(!isNaN(data.key - 0)) {
                    if(data.key > beginDate && data.key < endDate) {
                        var sve = new SensorValueEntry(JSON.parse(data.value).topic, JSON.parse(data.value).value, JSON.parse(data.value).driveNumber);
                        if(sve.topic == topicID) {
                            listOfKeys[listOfKeys.length] = data.key;
                            listOfEntries[listOfEntries.length] = sve;
                        }
                    }
            }
        }).on('end', function() {
            callback(listOfEntries, listOfKeys);
        });
    }

    //calls levelup to find the config entry for a certain driver and gives it to a callback function
    public getDriverEntry(driver: String, callback) {
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
    }

    public sendValueMessage(content: SensorValueEntry[], times: number[]) {
        this.broker.handleMessage(new ValueAnswerMessage(Topic.VALUE_ANSWER_MSG, times, content));
}

    public sendDashboardRspMessage(user: String, content: String){
        this.broker.handleMessage(new DashboardRspMessage(user, content));
    }

    //the overriden handleMessage-function. depending on the type of the message, a different action is performed.
    public handleMessage(m: Message): void {
        //If the given message is a DBRequestMessage, the Request is handled and a response message is sent.
        if(m instanceof DBRequestMessage) {
            //handling of a Value Request: Values are fetched from the DB and a value response is sent
            if(m.getRequest() instanceof  DBValueRequest) {
                var dbValueReq = <DBValueRequest> m.getRequest();
                    this.dbAccess.getEntries(dbValueReq.getTopic(), LevelDBAccess.dateToKey(dbValueReq.getBeginDate()), LevelDBAccess.dateToKey(dbValueReq.getEndDate()), function(res, tim){
                        this.sendValueMessage(res, tim);
                    });
            }
        }
        //If the given message is a regular value message, it is written to the db
        else if (m instanceof ValueMessage) {
            this.dbAccess.putSensorValue(m.value.getIdentifier(), m.value.numericalValue);
        }
        //If the given message is a DashboardMessage, it is either written to the db or fetched from the db
        else if(m instanceof DashboardMessage) {
            var dbm = <DashboardMessage> m;
            if(dbm.request) {
                this.dbAccess.getDriverEntry(dbm.user, function(value, err) {
                    if (err) console.log(err);
                    else this.sendDashboardRspMessage(value.dashboardConfig);
                })
            } else {
                this.dbAccess.getDriverEntry(dbm.user, function(value, err) {
                    if(err.notFound) {
                        this.dbAccess.putDriverInfo(dbm.user, dbm.config, function(err) {
                            console.log(err);
                        });
                    } else if (err) {
                        console.log(err);
                    } else {
                        this.dbAccess.deleteFromKey(dbm.user);
                        this.dbAccess.putDriverInfo(dbm.user, dbm.config);
                    }
                })
            }
        }
      //  } else if (m instanceof SettingsMessage) {
            //TODO: understand the organisation of settingsMessages and put them to the db accordingly
    }
}

class DBValueRequest extends DBRequest {
    private topic: String;
    private beginDate: Date;
    private endDate: Date;

    constructor (topic: String, beginDate: Date, endDate: Date) {
        super();
        this.topic = topic;
        this.beginDate = beginDate;
        this.endDate = endDate;
    }

    public getTopic(): String {
        return this.topic;
    }

    public  getBeginDate(): Date {
        return this.beginDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }
}

class DBSettingsRequest extends DBRequest {

}

export {DBRequest, DBValueRequest, DBSettingsRequest, DBBusDevice};

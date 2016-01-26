/// <reference path="../../levelup.d.ts" />

import levelup = require("levelup");
import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";

// The entry types that are to be written to the database:

// Abstract class for all Entry types
abstract class DBEntry {

}

// Entry class for Sensor values
class SensorValueEntry extends DBEntry {
    driveNumber: number;
    topic: number;
    value: any;

    //initialises the SensorValueEntry with its value
    constructor(value:any, drivenr: number) {
        super();
        this.value = value;
        this.driveNumber = drivenr;
    }
}

//enum for the fuel types
enum fuel {Diesel, Unleaded, Super_Unleaded, Super_Plus_Unleaded}

// Entry class for driver-specific info (dashboard-config, preferred fuel, whatever else we want to know)
//TODO: find better representation for a DriverInfo's key than a string
class DriverInfoEntry extends DBEntry {
    private dashboardConfig : number; // Must be adjusted to representation of dashboardconfig!
    private preferredFuel: fuel;

    //initialises a new DriverInfoEntry with a standard dashboardconfig and no preferred fuel
    constructor () {
        super();
        this.dashboardConfig = 0; // TODO: must be adjusted to standard dashboardconfig
        this.preferredFuel = null;
    }

    //getter for the dashboardconfig
    getDashboardConfig() : number {
        return this.dashboardConfig;
    }

    //setter for the dashboardconfig
    setDashboardConfig(newDashboardConfig: number) : void {
        this.dashboardConfig = newDashboardConfig;
    }

    //getter for the preferred fuel
    getPreferredFuel() : fuel {
        return this.preferredFuel;
    }

    //setter for the preferred fuel
    setPreferredFuel(newPreferedFuel : fuel) : void {
        this.preferredFuel = newPreferedFuel;
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
    putSensorValue(topicID: number, value: any) {
        this.db.put(LevelDBAccess.dateToKey(new Date()), JSON.stringify(new SensorValueEntry(value, this.DBInfo.currentDrive)), function(err) {
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
    putDriverInfo(driver: String) {
        this.db.put(driver, JSON.stringify(new DriverInfoEntry()));
    }

    //deletes the oldest data entries until the current size is 10% smaller than the maximum size
    private deleteOnMaxCapacity() {
        if(this.DBInfo.size > this.DBInfo.maxCapacity) {
            var listOfEntries: number[] = [];
            this.db.createKeyStream().on('data', function(data){
                listOfEntries.push(data);
            });
            listOfEntries.sort();
            var newSize: number = this.DBInfo.maxCapacity * 0.9;
            var i: number = 0;
            while(this.DBInfo.size > newSize){
                this.db.del(listOfEntries[i], function(err) {
                    if(err) console.log("Error while deleting entries: " + err);
                });
                this.decrementSize();
                i++;
            }
        }
    }

    //increments the variables for the size of the database both locally and in the db entry
    private incrementSize() {
        this.DBInfo.size++;
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){if(err){ console.log("Error in putting updated size to the Database:" + err)}});
    }

    //decrements the variables for the size of the database both locally and in the db entry
    private decrementSize() {
        this.DBInfo.size--;
        this.db.put("INFO", JSON.stringify(this.DBInfo), function(err){if(err){console.log("Error in putting updated size to the Database:" + err)}});
    }

    //returns all entries of a specific topic, optionally sorted by a specific timeframe
    public getEntries(topic: number, beginDate: number, endDate: number, callback) {
        var listOfKeys: number[] = [];
        var listOfEntries: any[] = [];
        this.db.createReadStream().on('data', function(data){
            if(!isNaN(data.key - 0)) {
                    if(data.key > beginDate && data.key < endDate) {
                        listOfKeys[listOfKeys.length] = data.key;
                        listOfEntries[listOfEntries.length] = JSON.parse(data.value);
                    }
            }
        }).on('end', function(end) {
            callback(listOfEntries, listOfKeys);
        });
    }

    //calls levelup to find the config entry for a certain driver
    public getDriverEntry(driver: String) {
        return this.db.get(driver, function(err, value) {
            if(err.notFound) {
                console.log(err + "The Driver was not yet put into the Database");
            } else if(err) {
                console.log("Error:" + err);
            }
            return JSON.parse(value);
        })
    }
}

//the BusDevice for the Database. makes the db accessible and decodes messages to db requests
class DBBusDevice extends BusDevice {

    private dbAccess: LevelDBAccess;

    //initialises the BusDevice with a new instance of the LevelDBAccess and subscribes to all relevant topics.
    constructor() {
        super();
        this.dbAccess = new LevelDBAccess(this);
        this.subscribe(Topic.SETTINGS_MSG);
        this.subscribe(Topic.DBREQ_MSG);
        this.subscribeAll(Topic.VALUES);
        //TODO: subscribe to all relevant Topics available
    }

    public sendValueMessage(content: SensorValueEntry[], times: number[]) {
        this.broker.handleMessage(new ValueAnswerMessage(new Topic(31, "Values from DB"), times, content));
        //TODO: Send Message with appropriate topic to Bus
}

    //the overriden handleMessage-function. depending on the type of the message, a different action is performed.
    public handleMessage(m: Message): void {
        //If the given message
        if(m instanceof DBRequestMessage) {
            if(m.getRequest() instanceof  DBValueRequest) {
                var dbValueReq = <DBValueRequest> m.getRequest();
                    this.dbAccess.getEntries(dbValueReq.getTopic().getID(), LevelDBAccess.dateToKey(dbValueReq.getBeginDate()), LevelDBAccess.dateToKey(dbValueReq.getEndDate()), function(res, tim){
                        this.sendValueMessage(res, tim);
                    });
            } else if (m.getRequest() instanceof DBDriverInfoRequest) {
                var n = <DBDriverInfoRequest>m.getRequest();
                this.dbAccess.getDriverEntry(n.getDriver());
            }
        } else if (m instanceof ValueMessage) {
            this.dbAccess.putSensorValue(m.getTopic().getID(), m.getValue);
      //  } else if (m instanceof SettingsMessage) {
            //TODO: understand the organisation of settingsMessages and put them to the db accordingly
        }
        //TODO: ELSE get sensor value from message and write to db / get config from message, ...
    }
}

class DBRequest {
}

class DBValueRequest extends DBRequest {
    private topic: Topic;
    private beginDate: Date;
    private endDate: Date;

    constructor (topic: Topic, beginDate: Date, endDate: Date) {
        super();
        this.topic = topic;
        this.beginDate = beginDate;
        this.endDate = endDate;
    }

    public getTopic(): Topic {
        return this.topic;
    }

    public  getBeginDate(): Date {
        return this.beginDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }
}

class DBDriverInfoRequest extends DBRequest {
    private driver:String;
    private dashboardConfig:boolean;
    private preferredfFuel:boolean;

    constructor(driver:String, dashboardConfig:boolean, preferredFuel:boolean) {
        super();
        this.driver = driver;
        this.dashboardConfig = dashboardConfig;
        this.preferredfFuel = preferredFuel;
    }

    public getDriver():String {
        return this.driver;
    }

    public getDashboardConfig():boolean {
        return this.dashboardConfig;
    }

    public getPreferredFuel():boolean {
        return this.preferredfFuel;
    }
}

class DBSettingsRequest extends DBRequest {

}

export {DBRequest, DBValueRequest, DBDriverInfoRequest, DBSettingsRequest, DBBusDevice};

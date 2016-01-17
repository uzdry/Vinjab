/// <reference path="../../levelup.d.ts" />

import levelup = require("levelup");
import Bus = require("./Bus.ts");
import {DBRequestMessage, Message, SettingsMessage} from "./Bus.ts";

export module DBAccess {

    // The entry types that are to be written to the database:

    // Abstract class for all Entry types
    abstract class DBEntry {
    }

    // Entry class for Sensor values
    class SensorValueEntry extends DBEntry {
        private topic: number;
        private value: any;

        //initialises the SensorValueEntry with its value
        constructor(value:any) {
            super();
            this.value = value;
        }

        //getter for the topic. there is no setter, as a topic should never be edited.
        getTopic(): number {
            return this.topic;
        }
        //getter for the value. there is no setter, as values should never be edited
        getValue():any {
            return this.value;
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
        maxCapacity: number;
        constructor(size: number) {
            this.size = size;
        }
    }

    export class LevelDBAccess {
        private currentDriver: String;
        private maxCapacity: number;
        private db;
        private busDevice: DBBusDevice;
        private currentSize: number;

        //constructor, initialises the LevelDBAccess with a given busdevice;
        constructor(busDevice : DBBusDevice) {
            this.currentDriver = null;
            this.db = levelup('./vinjabDB');
            this.busDevice = busDevice;
            var infoEntry = this.db.get("INFO", function (err, value) { //If there is no DBInfoEntry, it will be created.
                if(err) {
                    if(err.notFound) {
                        this.db.put(new DBInfoEntry(2000), "INFO");
                    } else {
                    }
                } return value;
            })
            this.maxCapacity = infoEntry.maxCapacity;
            this.currentSize = infoEntry.size;

        }

        //puts a new sensor value to the database
        putSensorValue(topic: number, value: any) {
            this.db.put(new SensorValueEntry(value), this.dateToKey());
            this.incrementSize();

        }

        //helping method converting the current date to a number, to serve as a key for the database
        private dateToKey(): number {
            return Date.now();
        }

        //puts a new driver's information to the database
        putDriverInfo(driver: String) {
            this.db.put(new DriverInfoEntry(), driver);
        }

        //deletes the oldest data entries until the current size is 10% smaller than the maximum size
        private deleteOnMaxCapacity() {
            if(this.currentSize > this.maxCapacity) {
                var listOfEntries: number[];
                this.db.createKeyStream().on('data', function(data) {
                    listOfEntries.push(data);
                });
                listOfEntries.sort();
                var newSize: number = this.maxCapacity * 0.9;
                var i: number = 0;
                while(this.currentSize > newSize){
                    this.db.del(listOfEntries[i], function(err) { //TODO: write errors to log file
                    });
                    this.decrementSize();
                    i++;
                }
            }
        }

        //increments the variables for the size of the database both locally and in the db entry
        private incrementSize() {
            this.currentSize++;
            var newEntry = this.db.get("INFO");
            newEntry.size++;
            this.db.del("INFO");
            this.db.put(newEntry, "INFO");
        }

        //decrements the variables for the size of the database both locally and in the db entry
        private decrementSize() {
            this.currentSize--;
            var newEntry = this.db.get("INFO");
            newEntry.size--;
            this.db.del("INFO");
            this.db.put(newEntry, "INFO");
        }

        //returns all entries of a specific topic, optionally sorted by a specific timeframe
        public getEntries(topic: number, beginDate: number, endDate: number): SensorValueEntry[] {
            // if there is no begin date or end date, the values are set to 0 and accordingly "now".
            if(beginDate === undefined) {
                beginDate = 0;
            }
            if(endDate === undefined) {
                endDate = Date.now();
            }
            var listOfKeys: number[];
            var listOfEntries: SensorValueEntry[];

            //all keys are extracted from the database
            this.db.createKeyStream().on('data', function(err, data) {
                if (data instanceof Number) {
                    listOfKeys.push(data);
                }
            });

            //and for each key, the entry is checked for requested data. fitting entries are pushed to the returned list
            for(var entry of listOfKeys){
                this.db.get("dbentry", function(err, dbentry) {
                    if(dbentry.getTopic() == topic && entry > beginDate && entry < endDate) {
                        listOfEntries.push(dbentry);
                    }
                });
            }
            return listOfEntries;
        }

        public getDriverEntry(driver: String) {
            return this.db.get(driver, function(err, value) {
                if(err.notFound) {
                    err.log("DBError: no such driver has been put to the database yet")
                } else if(err) {
                    err.log("DBError: something went wrong:");
                }
                return value;
            })
        }
    }

    class DBBusDevice extends Bus.BusDevice {

        private dbAccess: LevelDBAccess;

        constructor() {
            super();
            this.dbAccess = new LevelDBAccess(this);
            this.subscribe(Bus.SettingsMessage.TOPIC);
            this.subscribe(Bus.DBRequestMessage.TOPIC);
            //TODO: subscribe to all relevant Topics available
        }

        public handleMessage(m: Bus.Message): void {
            if(m instanceof DBRequestMessage) {
                if(m.getRequest() instanceof  DBValueRequest) {
                    DemoMessage.demooutput( //demo; delete the "demooutput"-part later
                        this.dbAccess.getEntries(m.getRequest().getTopic(), m.getRequest().getBeginDate(), m.getRequest().getEndDate())
                    )
                } else if (m.getRequest() instanceof DBDriverInfoRequest) {
                    this.dbAccess.getDriverEntry(m.getRequest().getDriver());
                }
                //TODO: Send Message containing the information required
            } //TODO: ELSE get sensor value from message and write to db / get config from message, ...
            //begin: demo stuff
            else if(m instanceof DemoMessage) {
                this.dbAccess.putSensorValue(9377, m.value);
            }
            //end: demo stuff
        }
    }

    class DemoMessage extends Bus.Message {
        public value: any
        public static demooutput(out: SensorValueEntry[]) {
            return out;
        }
    }


    abstract class DBRequest {

    }

    class DBValueRequest extends DBRequest {
        private topic: Bus.Topic;
        private beginDate: Date;
        private endDate: Date;

        constructor (topic: Bus.Topic, beginDate: Date, endDate: Date) {
            super()
            this.topic = topic;
            this.beginDate = beginDate;
            this.endDate = endDate;
        }

        public getTopic(): Bus.Topic {
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
}

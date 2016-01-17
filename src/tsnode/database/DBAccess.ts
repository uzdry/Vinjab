/// <reference path="../../../levelup.d.ts" />
import levelup = require("levelup");
import {BusDevice, Message, DBRequestMessage} from "../Bus"
 export module DBAccess {

     // The entry types that are to be written to the database:

     // Abstract class for all Entry types
     abstract class DBEntry {
     }

     // Entry class for Sensor values
    class SensorValueEntry extends DBEntry {
        private value:any;

        //initialises the SensorValueEntry with its value
        constructor(value:any) {
            super();
            this.value = value;
        }

        //getter for the value. there is no setter, as values should never be edited
        getValue():any {
            return this.value;
        }
    }

     // temporary key class for putting sensor values to the database
     //TODO: find better way for the keys (Date only? Strings? Numbers?
    class DBValueKey {
        private topic : number;
        private date : Date;

        //initialises the DBValueKey with a given topic and the current date
        constructor (topic: number) {
            this.topic = topic;
            this.date = new Date;
        }

        //getter for the topic
        getTopic() : number {
            return this.topic;
        }

        //getter for the date
        getDate() : Date {
            return this.date;
        }
    }

     //enum for the fuel types
    enum fuel {Diesel, Unleaded, Super_Unleaded, Super_Plus_Unleaded}

     // Entry class for driver-specific info (dashboard-config, preferred fuel, whatever else we want to know)
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

    class LevelDBAccess {
        private currentDriver: String;
        private maxCapacity: number;
        private db;
        private busDevice: DBBusDevice;
        private currentSize: number;

        //constructor, initialises the LevelDBAccess with a given busdevice;
        constructor(busDevice : DBBusDevice) {
            this.currentDriver = null;
            this.db = levelup('./vinjabdb');
            this.busDevice = busDevice;
            var infoEntry = this.db.get("INFO", function (err, value) { //If there is no DBInfoEntry, it will be created.
                if(err) {
                    if(err.notFound) {
                        this.db.put(new DBInfoEntry(2000), "INFO");
                    } else {
                    }
                } return value;
            })
            this.maxCapacity = infoEntry.maxcapacity;
            this.currentSize = infoEntry.size;

        }

        //puts a new sensor value to the database
        putSensorValue(topic: number, value: any) {
            this.db.put(new SensorValueEntry(value), new DBValueKey(topic));
            this.incrementSize();

        }

        //puts a new driver's information to the database
        putDriverInfo(driver: String) {
            this.db.put(new DriverInfoEntry(), driver);
        }

        //deletes the oldest data entries until the current size is 10% smaller than the maximum size
        private deleteOnMaxCapacity() {
            if(this.currentSize > this.maxCapacity) {
                var listOfEntries: SensorValueEntry[];
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
    }

     //TODO: extends BusDevice
    class DBBusDevice extends BusDevice {

        private dbAccess: LevelDBAccess;

        constructor() {
            super();
            this.dbAccess = new LevelDBAccess(this);

        }

        public handleMessage(m: Message): void {
            if (m.getTopic() !== DBRequestMessage.TOPIC) {
                throw new Error('No correct Message');
            }
        }

    }

}

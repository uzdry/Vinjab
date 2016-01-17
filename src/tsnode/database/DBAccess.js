var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../levelup.d.ts" />
var levelup = require("levelup");
var Bus_1 = require("../Bus");
var DBAccess;
(function (DBAccess) {
    // The entry types that are to be written to the database:
    // Abstract class for all Entry types
    var DBEntry = (function () {
        function DBEntry() {
        }
        return DBEntry;
    })();
    // Entry class for Sensor values
    var SensorValueEntry = (function (_super) {
        __extends(SensorValueEntry, _super);
        //initialises the SensorValueEntry with its value
        function SensorValueEntry(value) {
            _super.call(this);
            this.value = value;
        }
        //getter for the value. there is no setter, as values should never be edited
        SensorValueEntry.prototype.getValue = function () {
            return this.value;
        };
        return SensorValueEntry;
    })(DBEntry);
    // temporary key class for putting sensor values to the database
    //TODO: find better way for the keys (Date only? Strings? Numbers?
    var DBValueKey = (function () {
        //initialises the DBValueKey with a given topic and the current date
        function DBValueKey(topic) {
            this.topic = topic;
            this.date = new Date;
        }
        //getter for the topic
        DBValueKey.prototype.getTopic = function () {
            return this.topic;
        };
        //getter for the date
        DBValueKey.prototype.getDate = function () {
            return this.date;
        };
        return DBValueKey;
    })();
    //enum for the fuel types
    var fuel;
    (function (fuel) {
        fuel[fuel["Diesel"] = 0] = "Diesel";
        fuel[fuel["Unleaded"] = 1] = "Unleaded";
        fuel[fuel["Super_Unleaded"] = 2] = "Super_Unleaded";
        fuel[fuel["Super_Plus_Unleaded"] = 3] = "Super_Plus_Unleaded";
    })(fuel || (fuel = {}));
    // Entry class for driver-specific info (dashboard-config, preferred fuel, whatever else we want to know)
    var DriverInfoEntry = (function (_super) {
        __extends(DriverInfoEntry, _super);
        //initialises a new DriverInfoEntry with a standard dashboardconfig and no preferred fuel
        function DriverInfoEntry() {
            _super.call(this);
            this.dashboardConfig = 0; // TODO: must be adjusted to standard dashboardconfig
            this.preferredFuel = null;
        }
        //getter for the dashboardconfig
        DriverInfoEntry.prototype.getDashboardConfig = function () {
            return this.dashboardConfig;
        };
        //setter for the dashboardconfig
        DriverInfoEntry.prototype.setDashboardConfig = function (newDashboardConfig) {
            this.dashboardConfig = newDashboardConfig;
        };
        //getter for the preferred fuel
        DriverInfoEntry.prototype.getPreferredFuel = function () {
            return this.preferredFuel;
        };
        //setter for the preferred fuel
        DriverInfoEntry.prototype.setPreferredFuel = function (newPreferedFuel) {
            this.preferredFuel = newPreferedFuel;
        };
        return DriverInfoEntry;
    })(DBEntry);
    // class for a database entry containing necessary information for the boot of the database module
    var DBInfoEntry = (function () {
        function DBInfoEntry(size) {
            this.size = size;
        }
        return DBInfoEntry;
    })();
    var LevelDBAccess = (function () {
        //constructor, initialises the LevelDBAccess with a given busdevice;
        function LevelDBAccess(busDevice) {
            this.currentDriver = null;
            this.db = levelup('./vinjabdb');
            this.busDevice = busDevice;
            var infoEntry = this.db.get("INFO", function (err, value) {
                if (err) {
                    if (err.notFound) {
                        this.db.put(new DBInfoEntry(2000), "INFO");
                    }
                    else {
                    }
                }
                return value;
            });
            this.maxCapacity = infoEntry.maxcapacity;
            this.currentSize = infoEntry.size;
        }
        //puts a new sensor value to the database
        LevelDBAccess.prototype.putSensorValue = function (topic, value) {
            this.db.put(new SensorValueEntry(value), new DBValueKey(topic));
            this.incrementSize();
        };
        //puts a new driver's information to the database
        LevelDBAccess.prototype.putDriverInfo = function (driver) {
            this.db.put(new DriverInfoEntry(), driver);
        };
        //deletes the oldest data entries until the current size is 10% smaller than the maximum size
        LevelDBAccess.prototype.deleteOnMaxCapacity = function () {
            if (this.currentSize > this.maxCapacity) {
                var listOfEntries;
                this.db.createKeyStream().on('data', function (data) {
                    listOfEntries.push(data);
                });
                listOfEntries.sort();
                var newSize = this.maxCapacity * 0.9;
                var i = 0;
                while (this.currentSize > newSize) {
                    this.db.del(listOfEntries[i], function (err) {
                    });
                    this.decrementSize();
                    i++;
                }
            }
        };
        //increments the variables for the size of the database both locally and in the db entry
        LevelDBAccess.prototype.incrementSize = function () {
            this.currentSize++;
            var newEntry = this.db.get("INFO");
            newEntry.size++;
            this.db.del("INFO");
            this.db.put(newEntry, "INFO");
        };
        //decrements the variables for the size of the database both locally and in the db entry
        LevelDBAccess.prototype.decrementSize = function () {
            this.currentSize--;
            var newEntry = this.db.get("INFO");
            newEntry.size--;
            this.db.del("INFO");
            this.db.put(newEntry, "INFO");
        };
        return LevelDBAccess;
    })();
    //TODO: extends BusDevice
    var DBBusDevice = (function (_super) {
        __extends(DBBusDevice, _super);
        function DBBusDevice() {
            _super.call(this);
            this.dbAccess = new LevelDBAccess(this);
        }
        DBBusDevice.prototype.handleMessage = function (m) {
            if (m.getTopic() !== Bus_1.DBRequestMessage.TOPIC) {
                throw new Error('No correct Message');
            }
        };
        return DBBusDevice;
    })(Bus_1.BusDevice);
})(DBAccess = exports.DBAccess || (exports.DBAccess = {}));

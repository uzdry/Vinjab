/// <reference path="../../levelup.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var levelup = require("levelup");
var Bus_1 = require("./Bus");
var messages_1 = require("./messages");
exports.DBRequest = messages_1.DBRequest;
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
    function SensorValueEntry(value, drivenr) {
        _super.call(this);
        this.value = value;
        this.driveNumber = drivenr;
    }
    return SensorValueEntry;
})(DBEntry);
//enum for the fuel types
var fuel;
(function (fuel) {
    fuel[fuel["Diesel"] = 0] = "Diesel";
    fuel[fuel["Unleaded"] = 1] = "Unleaded";
    fuel[fuel["Super_Unleaded"] = 2] = "Super_Unleaded";
    fuel[fuel["Super_Plus_Unleaded"] = 3] = "Super_Plus_Unleaded";
})(fuel || (fuel = {}));
// Entry class for driver-specific info (dashboard-config, preferred fuel, whatever else we want to know)
//TODO: find better representation for a DriverInfo's key than a string
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
    function DBInfoEntry(maxCapacity, currentDrive) {
        this.maxCapacity = maxCapacity;
        this.size = 0;
        this.currentDrive = currentDrive;
    }
    return DBInfoEntry;
})();
//The access class for the levelup instance
var LevelDBAccess = (function () {
    //constructor, initialises the LevelDBAccess with a given busdevice;
    function LevelDBAccess(busDevice) {
        this.currentDriver = null;
        this.db = levelup('./vinjabDB', function (err, db) {
            if (err)
                console.log("Error in opening the Database:" + err);
            this.db = db;
        });
        this.busDevice = busDevice;
        this.DBInfo = new DBInfoEntry(2000, 0);
        this.db.get("INFO", function (err, value) {
            if (err) {
                if (err.notFound) {
                    this.db.put("INFO", JSON.stringify(new DBInfoEntry(2000, 0)), function (err) {
                        if (err)
                            console.log("Error in putting Entry:" + err);
                    });
                }
                else {
                    console.log("Error: Something went wrong fetching an Entry: " + err);
                }
            }
            else {
                this.DBInfo = new DBInfoEntry(JSON.parse(value).maxCapacity, JSON.parse(value).currentDrive + 1);
            }
        });
    }
    //puts a new sensor value to the database
    LevelDBAccess.prototype.putSensorValue = function (topicID, value) {
        this.db.put(LevelDBAccess.dateToKey(new Date()), JSON.stringify(new SensorValueEntry(value, this.DBInfo.currentDrive)), function (err) {
            if (err)
                console.log("Error in putting Entry:" + err);
        });
        this.incrementSize();
        this.deleteOnMaxCapacity();
    };
    //assisting method converting the current date to a number, to serve as a key for the database
    LevelDBAccess.dateToKey = function (date) {
        return date.getTime();
    };
    //puts a new driver's information to the database
    LevelDBAccess.prototype.putDriverInfo = function (driver) {
        this.db.put(driver, JSON.stringify(new DriverInfoEntry()));
    };
    //deletes the oldest data entries until the current size is 10% smaller than the maximum size
    LevelDBAccess.prototype.deleteOnMaxCapacity = function () {
        if (this.DBInfo.size > this.DBInfo.maxCapacity) {
            var listOfEntries = [];
            this.db.createKeyStream().on('data', function (data) {
                listOfEntries.push(data);
            });
            listOfEntries.sort();
            var newSize = this.DBInfo.maxCapacity * 0.9;
            var i = 0;
            while (this.DBInfo.size > newSize) {
                this.db.del(listOfEntries[i], function (err) {
                    if (err)
                        console.log("Error while deleting entries: " + err);
                });
                this.decrementSize();
                i++;
            }
        }
    };
    //increments the variables for the size of the database both locally and in the db entry
    LevelDBAccess.prototype.incrementSize = function () {
        this.DBInfo.size++;
        this.db.put("INFO", JSON.stringify(this.DBInfo), function (err) { if (err) {
            console.log("Error in putting updated size to the Database:" + err);
        } });
    };
    //decrements the variables for the size of the database both locally and in the db entry
    LevelDBAccess.prototype.decrementSize = function () {
        this.DBInfo.size--;
        this.db.put("INFO", JSON.stringify(this.DBInfo), function (err) { if (err) {
            console.log("Error in putting updated size to the Database:" + err);
        } });
    };
    //returns all entries of a specific topic, optionally sorted by a specific timeframe
    LevelDBAccess.prototype.getEntries = function (topic, beginDate, endDate, callback) {
        var listOfKeys = [];
        var listOfEntries = [];
        this.db.createReadStream().on('data', function (data) {
            if (!isNaN(data.key - 0)) {
                if (data.key > beginDate && data.key < endDate) {
                    listOfKeys[listOfKeys.length] = data.key;
                    listOfEntries[listOfEntries.length] = JSON.parse(data.value);
                }
            }
        }).on('end', function (end) {
            callback(listOfEntries, listOfKeys);
        });
    };
    //calls levelup to find the config entry for a certain driver
    LevelDBAccess.prototype.getDriverEntry = function (driver) {
        return this.db.get(driver, function (err, value) {
            if (err.notFound) {
                console.log(err + "The Driver was not yet put into the Database");
            }
            else if (err) {
                console.log("Error:" + err);
            }
            return JSON.parse(value);
        });
    };
    return LevelDBAccess;
})();
//the BusDevice for the Database. makes the db accessible and decodes messages to db requests
var DBBusDevice = (function (_super) {
    __extends(DBBusDevice, _super);
    //initialises the BusDevice with a new instance of the LevelDBAccess and subscribes to all relevant topics.
    function DBBusDevice() {
        _super.call(this);
        this.dbAccess = new LevelDBAccess(this);
        this.subscribe(messages_1.Topic.SETTINGS_MSG);
        this.subscribe(messages_1.Topic.DBREQ_MSG);
        this.subscribeAll(messages_1.Topic.VALUES);
        //TODO: subscribe to all relevant Topics available
    }
    DBBusDevice.prototype.sendValueMessage = function (content, times) {
        this.broker.handleMessage(new messages_1.ValueAnswerMessage(new messages_1.Topic(31, "Values from DB"), times, content));
        //TODO: Send Message with appropriate topic to Bus
    };
    //the overriden handleMessage-function. depending on the type of the message, a different action is performed.
    DBBusDevice.prototype.handleMessage = function (m) {
        //If the given message
        if (m instanceof messages_1.DBRequestMessage) {
            if (m.getRequest() instanceof DBValueRequest) {
                var dbValueReq = m.getRequest();
                this.dbAccess.getEntries(dbValueReq.getTopic().getID(), LevelDBAccess.dateToKey(dbValueReq.getBeginDate()), LevelDBAccess.dateToKey(dbValueReq.getEndDate()), function (res, tim) {
                    this.sendValueMessage(res, tim);
                });
            }
            else if (m.getRequest() instanceof DBDriverInfoRequest) {
                var n = m.getRequest();
                this.dbAccess.getDriverEntry(n.getDriver());
            }
        }
        else if (m instanceof messages_1.ValueMessage) {
            this.dbAccess.putSensorValue(m.getTopic().getID(), m.value);
        }
        //TODO: ELSE get sensor value from message and write to db / get config from message, ...
    };
    return DBBusDevice;
})(Bus_1.BusDevice);
exports.DBBusDevice = DBBusDevice;
var DBValueRequest = (function (_super) {
    __extends(DBValueRequest, _super);
    function DBValueRequest(topic, beginDate, endDate) {
        _super.call(this);
        this.topic = topic;
        this.beginDate = beginDate;
        this.endDate = endDate;
    }
    DBValueRequest.prototype.getTopic = function () {
        return this.topic;
    };
    DBValueRequest.prototype.getBeginDate = function () {
        return this.beginDate;
    };
    DBValueRequest.prototype.getEndDate = function () {
        return this.endDate;
    };
    return DBValueRequest;
})(messages_1.DBRequest);
exports.DBValueRequest = DBValueRequest;
var DBDriverInfoRequest = (function (_super) {
    __extends(DBDriverInfoRequest, _super);
    function DBDriverInfoRequest(driver, dashboardConfig, preferredFuel) {
        _super.call(this);
        this.driver = driver;
        this.dashboardConfig = dashboardConfig;
        this.preferredfFuel = preferredFuel;
    }
    DBDriverInfoRequest.prototype.getDriver = function () {
        return this.driver;
    };
    DBDriverInfoRequest.prototype.getDashboardConfig = function () {
        return this.dashboardConfig;
    };
    DBDriverInfoRequest.prototype.getPreferredFuel = function () {
        return this.preferredfFuel;
    };
    return DBDriverInfoRequest;
})(messages_1.DBRequest);
exports.DBDriverInfoRequest = DBDriverInfoRequest;
var DBSettingsRequest = (function (_super) {
    __extends(DBSettingsRequest, _super);
    function DBSettingsRequest() {
        _super.apply(this, arguments);
    }
    return DBSettingsRequest;
})(messages_1.DBRequest);
exports.DBSettingsRequest = DBSettingsRequest;

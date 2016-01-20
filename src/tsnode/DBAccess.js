/// <reference path="../../levelup.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var levelup = require("levelup");
var Bus = require("./Bus");
var Bus_1 = require("./Bus");
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
    //getter for the topic. there is no setter, as a topic should never be edited.
    SensorValueEntry.prototype.getTopic = function () {
        return this.topic;
    };
    //getter for the value. there is no setter, as values should never be edited
    SensorValueEntry.prototype.getValue = function () {
        return this.value;
    };
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
    function DBInfoEntry(size) {
        this.size = size;
    }
    return DBInfoEntry;
})();
var LevelDBAccess = (function () {
    //constructor, initialises the LevelDBAccess with a given busdevice;
    function LevelDBAccess(busDevice) {
        this.currentDriver = null;
        this.db = levelup('./vinjabDB');
        this.busDevice = busDevice;
        var infoEntry = this.db.get("INFO", function (err, value) {
            if (err) {
                if (err.notFound) {
                    infoEntry = new DBInfoEntry(2000);
                    this.db.put(infoEntry, "INFO", function (err) { });
                }
                else {
                }
            }
            infoEntry = value;
        });
        infoEntry = new DBInfoEntry(2000); //TODO: make it work, don't rely on this bad implementation
        this.maxCapacity = infoEntry.maxCapacity;
        this.currentSize = infoEntry.size;
    }
    //puts a new sensor value to the database
    LevelDBAccess.prototype.putSensorValue = function (topicID, value) {
        this.db.put(LevelDBAccess.dateToKey(new Date()), new SensorValueEntry(value));
        this.incrementSize();
        this.deleteOnMaxCapacity();
    };
    //helping method converting the current date to a number, to serve as a key for the database
    LevelDBAccess.dateToKey = function (date) {
        return date.getTime();
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
    //returns all entries of a specific topic, optionally sorted by a specific timeframe
    LevelDBAccess.prototype.getEntries = function (topic, beginDate, endDate) {
        // if there is no begin date or end date, the values are set to 0 and accordingly "now".
        var listOfKeys;
        var listOfEntries;
        //all keys are extracted from the database
        this.db.createKeyStream().on('data', function (err, data) {
            if (data instanceof Number) {
                listOfKeys.push(data);
            }
        });
        //and for each key, the entry is checked for requested data. fitting entries are pushed to the returned list
        for (var _i = 0; _i < listOfKeys.length; _i++) {
            var entry = listOfKeys[_i];
            this.db.get("dbentry", function (err, dbentry) {
                if (dbentry.getTopic() == topic && entry > beginDate && entry < endDate) {
                    listOfEntries.push(dbentry);
                }
            });
        }
        return listOfEntries;
    };
    //calls levelup to find the config entry for a certain driver
    LevelDBAccess.prototype.getDriverEntry = function (driver) {
        return this.db.get(driver, function (err, value) {
            if (err.notFound) {
                err.log("DBError: no such driver has been put to the database yet");
            }
            else if (err) {
                err.log("DBError: something went wrong:");
            }
            return value;
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
        this.subscribe(Bus.SettingsMessage.TOPIC);
        this.subscribe(Bus.DBRequestMessage.TOPIC);
        //TODO: subscribe to all relevant Topics available
    }
    //the overriden handleMessage-function. depending on the type of the message, a different action is performed.
    DBBusDevice.prototype.handleMessage = function (m) {
        //If the given message
        if (m instanceof Bus_1.DBRequestMessage) {
            if (m.getRequest() instanceof DBValueRequest) {
                var dbValueReq = m.getRequest();
                DemoMessage.demooutput(//demo; delete the "demooutput"-part later
                this.dbAccess.getEntries(dbValueReq.getTopic().getID(), LevelDBAccess.dateToKey(dbValueReq.getBeginDate()), LevelDBAccess.dateToKey(dbValueReq.getEndDate())));
            }
            else if (m.getRequest() instanceof DBDriverInfoRequest) {
                var n = m.getRequest();
                this.dbAccess.getDriverEntry(n.getDriver());
            }
        } //TODO: ELSE get sensor value from message and write to db / get config from message, ...
        else if (m instanceof DemoMessage) {
            this.dbAccess.putSensorValue(9377, m.value);
        }
        //end: demo stuff
    };
    return DBBusDevice;
})(Bus.BusDevice);
exports.DBBusDevice = DBBusDevice;
var DemoMessage = (function (_super) {
    __extends(DemoMessage, _super);
    function DemoMessage(value) {
        _super.call(this, new Bus.Topic(5037, "5037"));
        this.value = value;
    }
    DemoMessage.demooutput = function (out) {
        var output = "The values put to the Database in this demonstration were: ";
        for (var _i = 0; _i < out.length; _i++) {
            var entry = out[_i];
            if (entry instanceof SensorValueEntry) {
                output = output + "" + entry.getValue();
            }
        }
    };
    return DemoMessage;
})(Bus.Message);
exports.DemoMessage = DemoMessage;
var DBRequest = (function () {
    function DBRequest() {
    }
    return DBRequest;
})();
exports.DBRequest = DBRequest;
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
})(DBRequest);
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
})(DBRequest);
exports.DBDriverInfoRequest = DBDriverInfoRequest;
var DBSettingsRequest = (function (_super) {
    __extends(DBSettingsRequest, _super);
    function DBSettingsRequest() {
        _super.apply(this, arguments);
    }
    return DBSettingsRequest;
})(DBRequest);
exports.DBSettingsRequest = DBSettingsRequest;
function test() {
    var x = 0;
    var dbbd = new DBBusDevice();
    while (x < 500) {
        dbbd.handleMessage(new DemoMessage(x));
    }
    dbbd.handleMessage(new Bus_1.DBRequestMessage(new DBValueRequest(new Bus.Topic(5037, "5037"), new Date(2013, 12, 1), new Date())));
}
exports.test = test;

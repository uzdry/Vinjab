/// <reference path="../../../typings/postal/postal.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @author: David G.
 */
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Due to some import issues some classes are temporarily imported by being copied to this file.
 * Note: Some ways of import do not work in browsers although they may be fine in Node.js.
 * Until we find a uniform solution that we can apply to ALL the GUI modules, this part should stay like this.
 * These issues are known and are about to be solved.
 * Until then at least we have a working code.
 *
 * !!!!!!!! - = START OF HARD CODED IMPORT PART = - !!!!!!!!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
/**
 * 1:1 import of the class Value.
 */
var Value = (function () {
    function Value(pValue, pID) {
        this.value = pValue;
        this.identifier = pID;
    }
    Value.prototype.numericalValue = function () {
        return this.value;
    };
    Value.prototype.getIdentifier = function () {
        return this.identifier;
    };
    return Value;
})();
/**
 * Import of the class Topic.
 * Note: equals() function has been modified, '==' instead of '==='.
 */
var Topic = (function () {
    //instantiates a new Topic with ID and name
    function Topic(pID, pName) {
        if (pID < 0) {
            return null;
        }
        this.id = pID;
        this.name = pName;
    }
    Topic.prototype.getID = function () {
        return this.id;
    };
    Topic.prototype.equals = function (topic) {
        return this.getID() == topic.getID();
    };
    Topic.VALUE_MSG = new Topic(10, "value.*");
    Topic.DBREQ_MSG = new Topic(20, "database request message");
    Topic.VALUE_ANSWER_MSG = new Topic(30, "value answer message");
    Topic.SETTINGS_MSG = new Topic(40, "settings message");
    Topic.SPEED = new Topic(140, "value.speed");
    Topic.MAF = new Topic(350, "value.mass air flow");
    Topic.CO0LANT_PRESSURE = new Topic(110, "value.coolant temperature");
    Topic.FUEL_PRESSURE = new Topic(120, "value.fuel pressure");
    Topic.RPM = new Topic(130, "value.RPM");
    Topic.STEERING = new Topic(150, "value.steering");
    Topic.INTAKE_TEMP = new Topic(160, "value.intake air temperature");
    Topic.ENGINE_RUNTIME = new Topic(170, "value.engine runtime");
    Topic.FUEL = new Topic(180, "value.fuel");
    Topic.EGR_STATE = new Topic(190, "value.exhaust gas recirculation state");
    Topic.INJ_PRESSURE = new Topic(200, "value.injection pressure State");
    Topic.FPC_STATE = new Topic(210, "value.fuel pressure control state");
    Topic.GPV = new Topic(220, "value.gas pressure vaporizer");
    Topic.CAT_TEMP = new Topic(230, "value.catalyst temperature");
    Topic.THROTTLE = new Topic(240, "value.throttle");
    Topic.ACCELERATOR = new Topic(250, "value.accelerator pedal position");
    Topic.TEMP_OUT = new Topic(260, "value.temperature outside");
    Topic.TORQUE = new Topic(270, "value.engine torque");
    Topic.EGT = new Topic(280, "value.exhaust gas temperature");
    Topic.EGP = new Topic(290, "value.exhaust gas pressure");
    Topic.ULTRASONIC = new Topic(300, "value.ultrasonic sensor distance");
    Topic.AVG_FUEL = new Topic(310, "value.aggregated.average fuel consumption");
    Topic.FUEL_CONSUMPTION = new Topic(320, "value.aggregated.fuel consumption.aggregated");
    Topic.MILEAGE = new Topic(330, "value.aggregated.mileage");
    Topic.AVG_SPEED = new Topic(340, "value.aggregated.average speed");
    Topic.FUEL_CONSUMPTION_H = new Topic(360, "value.aggregated.fuel per hour");
    Topic.VALUES = [Topic.SPEED,
        Topic.MAF,
        Topic.CO0LANT_PRESSURE,
        Topic.FUEL_PRESSURE,
        Topic.RPM,
        Topic.STEERING,
        Topic.INTAKE_TEMP,
        Topic.ENGINE_RUNTIME,
        Topic.FUEL,
        Topic.EGR_STATE,
        Topic.INJ_PRESSURE,
        Topic.FPC_STATE,
        Topic.GPV,
        Topic.CAT_TEMP,
        Topic.THROTTLE,
        Topic.ACCELERATOR,
        Topic.TEMP_OUT,
        Topic.TORQUE,
        Topic.EGT,
        Topic.EGP,
        Topic.ULTRASONIC,
        Topic.AVG_FUEL,
        Topic.FUEL_CONSUMPTION,
        Topic.MILEAGE,
        Topic.AVG_SPEED,
        Topic.FUEL_CONSUMPTION_H];
    return Topic;
})();
/**
 * 1:1 import of the class Message.
 */
//super class for all Message Types
var Message = (function () {
    function Message(pTopic) {
        this.topic = pTopic;
    }
    Message.prototype.getTopic = function () {
        return this.topic;
    };
    return Message;
})();
/**
 * 1:1 import of the class SettingsMessage.
 */
/*
class SettingsMessage extends Message {
    private configs: Map<Topic, Value>;

    constructor(configs : Map<Topic, Value>) {
        super(Topic.SETTINGS_MSG);
        this.configs = configs;
    }

    public getConfigs(): Map<Topic,Value> {
        return this.configs;
    }
}*/
/**
 * 1:1 import of the class BusDevice.
 */
//A BusDevice has acces to the Bus
var BusDevice = (function () {
    function BusDevice() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }
    BusDevice.prototype.abstractHandle = function () {
        throw new Error('This method is abstract and must be overridden');
    };
    BusDevice.prototype.subscribe = function (t) {
        this.broker.subscribe(t, this);
    };
    BusDevice.prototype.subscribeAll = function (topics) {
        for (var x in topics) {
            this.broker.subscribe(x, this);
        }
    };
    BusDevice.prototype.unsubscribe = function (t) {
        this.broker.unsubscribe(t, this);
    };
    BusDevice.prototype.getID = function () {
        return this.id;
    };
    BusDevice.cnt = 0;
    return BusDevice;
})();
/**
 * A class that is used instead of Set because of import problems (does not work in the browser).
 */
var AuxiliaryMapBroker = (function () {
    function AuxiliaryMapBroker() {
        this.topics = [];
        this.busdevices = [];
    }
    AuxiliaryMapBroker.prototype.get = function (topic) {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.busdevices[index];
        }
        return null;
    };
    AuxiliaryMapBroker.prototype.set = function (topic, auxiliaryBusDeviceArray) {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.busdevices[index] = auxiliaryBusDeviceArray;
        }
        else {
            this.topics.push(topic);
            this.busdevices.push(auxiliaryBusDeviceArray);
        }
    };
    AuxiliaryMapBroker.prototype.getIndexOf = function (topic) {
        for (var i = 0; i < this.topics.length; i++) {
            if (this.topics[i].equals(topic)) {
                return i;
            }
        }
        return -1;
    };
    return AuxiliaryMapBroker;
})();
/**
 * A class that is used instead of Map in Map< Topic, Set<> > because of import problems (does not work in the browser).
 */
var AuxiliaryBusDeviceArray = (function () {
    function AuxiliaryBusDeviceArray() {
        this.busDevices = [];
    }
    AuxiliaryBusDeviceArray.prototype.push = function (busdevice) {
        this.busDevices.push(busdevice);
    };
    AuxiliaryBusDeviceArray.prototype.remove = function (sub) {
        var index = -1;
        for (var i = 0; i < this.busDevices.length; i++) {
            if (this.busDevices[i].getID() == sub.getID()) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            this.busDevices.splice(index, 1);
        }
    };
    AuxiliaryBusDeviceArray.prototype.getArray = function () {
        return this.busDevices;
    };
    return AuxiliaryBusDeviceArray;
})();
/**
 * A slightly modified version of the class Broker, it uses the class AuxiliaryMapBroker instead of Map< Topic, Set<> >
 */
var Broker = (function () {
    function Broker() {
        this.subscribers = new AuxiliaryMapBroker();
    }
    Broker.get = function () {
        if (Broker.instance == null || typeof Broker.instance == undefined) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    };
    Broker.prototype.handleMessage = function (m) {
        this.distribute(m);
    };
    Broker.prototype.subscribe = function (topic, sub) {
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new AuxiliaryBusDeviceArray());
        }
        //console.log(sub);
        this.subscribers.get(topic).push(sub);
    };
    Broker.prototype.unsubscribe = function (topic, sub) {
        // delete sub
        this.subscribers.get(topic).remove(sub);
    };
    Broker.prototype.distribute = function (m) {
        if (this.subscribers.get(m.getTopic()) == null) {
            //console.log("serious");
            return;
        }
        var arr = this.subscribers.get(m.getTopic()).getArray();
        if (arr != null) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].handleMessage(m);
            }
        }
    };
    return Broker;
})();
/**
 * The 1:1 import of DBRequestMessage.
 */
var DBRequestMessage = (function (_super) {
    __extends(DBRequestMessage, _super);
    function DBRequestMessage(pReq) {
        _super.call(this, Topic.DBREQ_MSG);
        this.req = pReq;
    }
    DBRequestMessage.prototype.getRequest = function () {
        return this.req;
    };
    return DBRequestMessage;
})(Message);
/**
 * The 1:1 import of DBRequest.
 */
var DBRequest = (function () {
    function DBRequest() {
    }
    return DBRequest;
})();
/**
 * The 1:1 import of DBSettingsRequest.
 */
var DBSettingsRequest = (function (_super) {
    __extends(DBSettingsRequest, _super);
    function DBSettingsRequest() {
        _super.apply(this, arguments);
    }
    return DBSettingsRequest;
})(DBRequest);
/**
 * Emulates the Map used on the server side.
 */
var AuxiliaryMap = (function () {
    function AuxiliaryMap() {
        this.topics = [];
        this.values = [];
    }
    AuxiliaryMap.prototype.set = function (topic, value) {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.values[index] = value;
        }
        else {
            this.topics.push(topic);
            this.values.push(value);
        }
    };
    AuxiliaryMap.prototype.get = function (topic) {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.values[index];
        }
        return null;
    };
    AuxiliaryMap.prototype.getIndexOf = function (topic) {
        for (var i = 0; i < this.topics.length; i++) {
            if (topic.equals(this.topics[i])) {
                return i;
            }
        }
        return -1;
    };
    return AuxiliaryMap;
})();
/**
 * The settings message that uses the emulated Map instead of the original one.
 */
var AuxiliarySettingsMessage = (function (_super) {
    __extends(AuxiliarySettingsMessage, _super);
    function AuxiliarySettingsMessage(configs) {
        _super.call(this, Topic.SETTINGS_MSG);
        this.configs = configs; //new Map<Topic, Value>();
    }
    AuxiliarySettingsMessage.prototype.getConfigs = function () {
        return this.configs;
    };
    return AuxiliarySettingsMessage;
})(Message);
/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * !!!!!!!! - = END OF HARD CODED IMPORT PART = - !!!!!!!!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
/**
 * Creates the main HTML table for the settings GUI.
 */
var TableFactory = (function () {
    /**
     * Creates a new TableFactory.
     * @param container The HTML DOM object that should contain the table (not yet implemented).
     * @param valueChangeListener The object that logs the changes to be written back to the database (to be removed soon...).
     */
    function TableFactory(container, valueChangeListener) {
        this.container = container;
        this.valueChangeListener = valueChangeListener;
    }
    /**
     * Adds a new row to the table that contains a folder or a parameter.
     * The information source is the actualSettingsNode and the amount of the rows already present.
     * Therefore there are no parameters needed.
     */
    TableFactory.prototype.appendRow = function () {
        var rowId = this.tableBody.children.length;
        var actualRowNode = this.actualSettingsNode.getElements()[rowId];
        var name = actualRowNode.getName();
        var description = actualRowNode.getDescription();
        var actualDir = this.actualSettingsNode;
        var tr = document.createElement('tr');
        tr.style.height = "100px";
        var valueChangeListener = this.valueChangeListener;
        if (rowId == 0) {
            this.backButton = document.createElement('td');
            this.backButton.style.width = "50px";
            if (actualDir.getParent() != actualDir) {
                this.backButton.style.backgroundColor = "GreenYellow";
                var container = this.container;
                this.backButton.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualDir.getParent());
                };
            }
            else {
                this.backButton.style.backgroundColor = "Gray";
            }
            var img = document.createElement('img');
            img.src = "../../img/settings/leftarrow.png";
            img.style.width = "50px";
            img.style.height = "50px";
            this.backButton.appendChild(img);
            tr.appendChild(this.backButton);
        }
        else {
            this.backButton.rowSpan = this.backButton.rowSpan + 1;
        }
        var td = document.createElement('td');
        td.style.width = "100px";
        var img = document.createElement('img');
        img.src = actualRowNode.getImageURL();
        img.style.width = "100%";
        img.style.height = "100%";
        td.appendChild(img);
        tr.appendChild(td);
        td = document.createElement('td');
        // Create new table
        var innerTable = document.createElement('table');
        var innerTBody = document.createElement('tbody');
        var innerTR = document.createElement('tr');
        var innerTD = document.createElement('td');
        innerTD.innerHTML = name;
        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);
        innerTR = document.createElement('tr');
        innerTD = document.createElement('td');
        innerTD.innerHTML = description;
        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);
        innerTR = document.createElement('tr');
        innerTD = document.createElement('td');
        innerTD.innerHTML = actualRowNode.getFullUid() + '   ← [Debug Only] Resource unique identifier string';
        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);
        innerTable.appendChild(innerTBody);
        td.appendChild(innerTable);
        if (actualRowNode.isDirectory()) {
            if (actualRowNode.getElements().length > 0) {
                td.style.backgroundColor = "LightSkyBlue";
                var container = this.container;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualRowNode);
                };
            }
            else {
                td.style.backgroundColor = "PaleVioletRed";
            }
        }
        else {
            td.style.backgroundColor = "LightGray";
        }
        tr.appendChild(td);
        td = document.createElement('td');
        var fullUid = actualRowNode.getFullUid();
        if (actualRowNode.isDirectory()) {
            if (actualRowNode.getElements().length > 0) {
                td.style.backgroundColor = "DeepSkyBlue";
                var container = this.container;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualRowNode);
                };
            }
            else {
                td.style.backgroundColor = "MediumVioletRed";
            }
        }
        else {
            td.style.backgroundColor = "Gray";
            var form = document.createElement('form');
            var input = document.createElement('input');
            input.type = 'number';
            input.style.height = "80px";
            input.style.fontSize = "50px";
            input.style.width = "300px";
            input.value = '' + actualRowNode.getActualValue();
            input.onchange = function () {
                actualRowNode.setActualValue(this.value);
                //changeListener.valueChanged(fullUid, this.value, actualRowNode.getValue());
            };
            form.appendChild(input);
            td.appendChild(form);
        }
        td.style.width = "320px";
        tr.appendChild(td);
        this.tableBody.appendChild(tr);
    };
    /**
     * Creates a whole HTML table with the specified node as the parent (all the children will be displayed).
     * @param actualSettingsNode The parent node, all of its children should be displayed in the table.
     */
    TableFactory.prototype.createTable = function (actualSettingsNode) {
        this.table = document.createElement('table');
        this.table.id = 'settings_table';
        this.table.style.width = '100%';
        this.table.style.height = '100%';
        this.table.setAttribute('border', '1');
        this.tableBody = document.createElement('tbody');
        this.actualSettingsNode = actualSettingsNode;
        var elementList = this.actualSettingsNode.getElements();
        var listLength = elementList.length;
        for (var i = 0; i < listLength; i++) {
            this.appendRow();
        }
        // Add ok button //
        var okbutton;
        okbutton = document.createElement('button');
        okbutton.style.position = 'relative';
        okbutton.style.width = '60%';
        okbutton.style.marginLeft = '20%';
        okbutton.style.height = '60%';
        okbutton.style.fontSize = '18px';
        okbutton.appendChild(document.createTextNode('Save configuration!'));
        var root = actualSettingsNode;
        while (true) {
            if (root == root.getParent()) {
                break;
            }
            root = root.getParent();
        }
        var valueChangeListener = this.valueChangeListener;
        var container = this.container;
        okbutton.onclick = function () {
            var message = valueChangeListener.getSettingsWriteMessage();
            root.actualValueStored();
            Broker.get().handleMessage(message);
            TextDebugger.refreshData(null, container);
        };
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 4;
        td.height = '60px';
        td.appendChild(okbutton);
        tr.appendChild(td);
        td.style.alignItems = 'center';
        td.style.backgroundColor = 'Orange';
        this.tableBody.appendChild(tr);
        this.table.appendChild(this.tableBody);
        this.table.style.height = "auto";
        this.table.style.paddingBottom = "0px";
        this.container.appendChild(this.table);
    };
    /**
     * Deletes the whole table from the GUI.
     */
    TableFactory.prototype.removeTable = function () {
        this.container.removeChild(this.table);
    };
    return TableFactory;
})();
/**
 * A settings directory that can contain parameters or other directories.
 */
var SettingsDirectory = (function () {
    /**
     * Creates a settings directory.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param elements The children of this directory.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     */
    function SettingsDirectory(ruid, name, description, elements, imageURL) {
        this.ruid = ruid;
        this.name = name;
        this.description = description;
        this.elements = elements;
        this.parent = this;
        for (var i = 0; i < elements.length; i++) {
            elements[i].setParent(this);
        }
        this.imageURL = imageURL;
    }
    /**
     * Sets the value of the directory. To be ignored.
     * @param value The new value of the directory.
     */
    SettingsDirectory.prototype.setActualValue = function (value) {
    };
    /**
     * Notifies this object that its value has been saved in the database.
     */
    SettingsDirectory.prototype.actualValueStored = function () {
        if (this.elements != null) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].actualValueStored();
            }
        }
    };
    /**
     * Gets the topic of this directory. Directories do not have a topic, so null is returned.
     * @returns {null} Null, directories do not have a topic.
     */
    SettingsDirectory.prototype.getTopic = function () {
        return null;
    };
    /**
     * Gets the actual value of the directory. To be ignored.
     * @returns {number} The actual value of the directory.
     */
    SettingsDirectory.prototype.getActualValue = function () {
        return 0;
    };
    /**
     * Appends a new child element to this directory.
     * @param element The child node to be appended to this directory.
     */
    SettingsDirectory.prototype.appendChild = function (element) {
        if (this.getElementByRuid(element.getRuid()) == null) {
            this.elements.push(element);
            element.setParent(this);
        }
    };
    /**
     * Gets a child of this directory based on its ruid. No grandchildren will be checked.
     * @param ruid The ruid of the child of this directory you are looking for.
     * @returns {any} The child of this directory with the specified ruid, null if not found.
     */
    SettingsDirectory.prototype.getElementByRuid = function (ruid) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].getRuid() == ruid) {
                return this.elements[i];
            }
        }
        return null;
    };
    /**
     * Gets the original value of this directory. To be ignored.
     * @returns {number} The original value of this directory.
     */
    SettingsDirectory.prototype.getValue = function () {
        return 0;
    };
    /**
     * Gets the URL of the image that is to be displayed as this directory in the GUI.
     * @returns {string} The URL of the image of this directory.
     */
    SettingsDirectory.prototype.getImageURL = function () {
        return this.imageURL;
    };
    /**
     * Gets the full unique ID of this directory.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this directory.
     */
    SettingsDirectory.prototype.getFullUid = function () {
        if (this.parent == this) {
            return this.ruid;
        }
        return this.parent.getFullUid() + '/' + this.ruid;
    };
    /**
     * Gets the relatively unique ID of this directory.
     * @returns {string} The ruid of this directory.
     */
    SettingsDirectory.prototype.getRuid = function () {
        return this.ruid;
    };
    /**
     * Gets all the children of this directory.
     * @returns {SettingsNode[]} The children of this directory.
     */
    SettingsDirectory.prototype.getElements = function () {
        return this.elements;
    };
    /**
     * Gets the name of this directory that is to be displayed in the GUI.
     * @returns {string} The name of this directory.
     */
    SettingsDirectory.prototype.getName = function () {
        return this.name;
    };
    /**
     * Gets the description of this directory that is to be displayed in the GUI.
     * @returns {string} The description of this directory.
     */
    SettingsDirectory.prototype.getDescription = function () {
        return this.description;
    };
    /**
     * Checks whether this node is a directory.
     * @returns {boolean} True.
     */
    SettingsDirectory.prototype.isDirectory = function () {
        return true;
    };
    /**
     * Sets the parent directory of this directory.
     * @param parent The new parent directory of this.
     */
    SettingsDirectory.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    SettingsDirectory.prototype.getParent = function () {
        return this.parent;
    };
    return SettingsDirectory;
})();
/**
 * A settings parameter that can have multiple numeric values.
 */
var SettingsParameter = (function () {
    /**
     * Creates a settings parameter.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     * @param value The original value of this settings parameter.
     */
    function SettingsParameter(ruid, name, description, imageURL, topic, valueChangeListener, value, container) {
        this.name = name;
        this.description = description;
        this.ruid = ruid;
        this.imageURL = imageURL;
        this.value = value;
        this.actualValue = value;
        this.topic = topic;
        this.valueChangeListener = valueChangeListener;
        this.container = container;
    }
    /**
     * Notifies this object that its value has been saved in the database.
     */
    SettingsParameter.prototype.actualValueStored = function () {
        this.value = this.actualValue;
    };
    /**
     * Settings the actual value of this parameter (that is set in the GUI).
     * Does not change the original value of this parameter that is in the DB.
     * @param value The new actual value of this parameter.
     */
    SettingsParameter.prototype.setActualValue = function (value) {
        this.actualValue = value;
        if (this.actualValue != this.value) {
            this.valueChangeListener.append(this, this.container);
        }
        else {
            this.valueChangeListener.remove(this, this.container);
        }
    };
    /**
     * Gets the actual value of this parameter.
     * @returns {number} The actual value of this parameter.
     */
    SettingsParameter.prototype.getActualValue = function () {
        return this.actualValue;
    };
    /**
     * Gets the value of this parameter that is currently stored in the DB.
     * @returns {number} The value of this parameter that is currently stored in the DB.
     */
    SettingsParameter.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Gets the URL of the image of this parameter that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this parameter.
     */
    SettingsParameter.prototype.getImageURL = function () {
        return this.imageURL;
    };
    SettingsParameter.prototype.getTopic = function () {
        return this.topic;
    };
    /**
     * Gets the full unique ID of this parameter.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this parameter.
     */
    SettingsParameter.prototype.getFullUid = function () {
        return this.parent.getFullUid() + '/' + this.ruid;
    };
    /**
     * Gets the relatively unique ID of this parameter.
     * @returns {string} The ruid of this parameter.
     */
    SettingsParameter.prototype.getRuid = function () {
        return this.ruid;
    };
    /**
     * Gets the elements of this node. Paramaters do not contain elements, so it returns null.
     * @returns {null} Null.
     */
    SettingsParameter.prototype.getElements = function () {
        return null;
    };
    /**
     * Gets the name of this parameter that is to be displayed in the GUI.
     * @returns {string} The name of this parameter.
     */
    SettingsParameter.prototype.getName = function () {
        return this.name;
    };
    /**
     * Gets the description of this parameter that is to be displayed in the GUI.
     * @returns {string} The description of this parameter.
     */
    SettingsParameter.prototype.getDescription = function () {
        return this.description;
    };
    /**
     * Checks whether this node is a directory.
     * @returns {boolean} False.
     */
    SettingsParameter.prototype.isDirectory = function () {
        return false;
    };
    /**
     * Sets the parent directory of this parameter.
     * @param parent The new parent directory of this.
     */
    SettingsParameter.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    SettingsParameter.prototype.getParent = function () {
        return this.parent;
    };
    return SettingsParameter;
})();
/**
 * The class that provides a debugging console output in the browser.
 */
var TextDebugger = (function () {
    function TextDebugger() {
    }
    /**
     * Refreshes the whole output array consisting of two columns.
     * @param fullUids The list of the Uids of the parameters.
     * @param values The actual values of the parameters.
     */
    TextDebugger.refreshData = function (settingsNodes, container) {
        var tableDebug = document.getElementById("table_debug");
        if (tableDebug == null) {
            tableDebug = document.createElement('table');
            tableDebug.style.position = 'absolute';
            tableDebug.style.height = 'auto';
            tableDebug.style.width = '450px';
            tableDebug.style.marginLeft = '100px';
            tableDebug.style.marginTop = '450px';
            tableDebug.id = 'table_debug';
            tableDebug.style.border = '1px solid black';
            tableDebug.style.borderCollapse = 'collapse';
            container.appendChild(tableDebug);
        }
        var tdBody = document.createElement("tbody");
        while (tableDebug.children.length > 0) {
            tableDebug.removeChild(tableDebug.children[0]);
        }
        var tr;
        var td;
        tr = document.createElement('tr');
        tr.height = "75px";
        td = document.createElement('td');
        td.colSpan = 3;
        td.innerHTML = "Values to be written to the database:";
        td.bgColor = 'Red';
        tr.appendChild(td);
        tr.style.border = '1px solid black';
        tdBody.appendChild(tr);
        tr = document.createElement('tr');
        tr.height = "75px";
        td = document.createElement('td');
        td.innerHTML = "Full UUID";
        td.width = "150px";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = "Topic ID";
        td.width = "150px";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = "Value to be stored";
        td.width = "150px";
        tr.appendChild(td);
        tr.style.border = '1px solid black';
        tdBody.appendChild(tr);
        if (settingsNodes == null || settingsNodes.length == 0) {
            tr = document.createElement('tr');
            tr.height = "75px";
            td = document.createElement('td');
            td.innerHTML = "empty";
            td.width = "150px";
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = "empty";
            td.width = "150px";
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = "empty";
            td.width = "150px";
            tr.appendChild(td);
            tr.style.border = '1px solid black';
            tdBody.appendChild(tr);
        }
        else {
            for (var i = 0; i < settingsNodes.length; i++) {
                tr = document.createElement('tr');
                tr.height = "75px";
                td = document.createElement('td');
                td.innerHTML = settingsNodes[i].getFullUid();
                td.width = "150px";
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerHTML = '' + settingsNodes[i].getTopic().getID();
                td.width = "150px";
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerHTML = '' + settingsNodes[i].getActualValue();
                td.width = "150px";
                tr.appendChild(td);
                tr.style.border = '1px solid black';
                tdBody.appendChild(tr);
            }
        }
        tableDebug.appendChild(tdBody);
    };
    return TextDebugger;
})();
/**
 * The class that logs all the changes to all the values that can be written back to the database.
 * May become deprecated soon.
 */
var ValueChangeListener = (function () {
    /**
     * Creates the listener.
     * @param textDebugger The debugger of the GUI that provides display function for this class.
     */
    function ValueChangeListener(textDebugger) {
        this.textDebugger = textDebugger;
        this.settingsNodes = [];
    }
    /**
     * Gets the index of the settings node in the array.
     * @param settingsNode The settings node we are looking for.
     * @returns {number} The index of the settings node.
     */
    ValueChangeListener.prototype.getIndexOf = function (settingsNode) {
        for (var i = 0; i < this.settingsNodes.length; i++) {
            if (this.settingsNodes[i].getFullUid() == settingsNode.getFullUid()) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Appends a new settings node to the to-be-written-to-the-database list.
     * @param settingsNode The new settings node that should be written to the database.
     */
    ValueChangeListener.prototype.append = function (settingsNode, container) {
        if (this.getIndexOf(settingsNode) == -1) {
            this.settingsNodes.push(settingsNode);
        }
        TextDebugger.refreshData(this.settingsNodes, container);
    };
    /**
     * Removes a node from the to-be-written-to-the-database list.
     * @param settingsNode The node that should be removed from the list.
     */
    ValueChangeListener.prototype.remove = function (settingsNode, container) {
        var index = this.getIndexOf(settingsNode);
        if (index != -1) {
            this.settingsNodes.splice(index, 1);
        }
        TextDebugger.refreshData(this.settingsNodes, container);
    };
    /**
     * Converts the internal to-be-written-to-the-database list of nodes to a settings message.
     * @returns {AuxiliarySettingsMessage} The settings message that can be sent directly to the database.
     */
    ValueChangeListener.prototype.getSettingsWriteMessage = function () {
        var auxiliaryMap = new AuxiliaryMap();
        for (var i = 0; i < this.settingsNodes.length; i++) {
            auxiliaryMap.set(this.settingsNodes[i].getTopic(), new Value(this.settingsNodes[i].getActualValue(), "ignoreME"));
        }
        var auxiliarySettingsMessage = new AuxiliarySettingsMessage(auxiliaryMap);
        return auxiliarySettingsMessage;
    };
    return ValueChangeListener;
})();
/**
 * A class that is designed to support the conversion of the directory structure from XML to OO.
 */
var SCommunicator = (function () {
    function SCommunicator() {
    }
    /**
     * Searches for an element in the buffer with a specified ruid.
     * @param directoryBuffer The buffer that contains all the elements in which you are looking for a specified one.
     * @param ruid The ruid of the specific element you are looking for.
     * @returns {number} The index of the element in the array. -1 if not found.
     */
    SCommunicator.getElementIndexByRuid = function (directoryBuffer, ruid) {
        for (var i = 0; i < directoryBuffer.length; i++) {
            if (directoryBuffer[i].getRuid() == ruid) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Starts the conversion of an xml file to an OO directory/parameter model.
     * @param xmlURL The URL of the XML file.
     * @param messageBuffer The message buffer to be used to communicate with the database if the data is about to be saved.
     * @param valueChangeListener The valueChangeListener that should be used by the OO parameter objects and notified on value change.
     */
    SCommunicator.startXMLconversion = function (xmlURL, messageBuffer, valueChangeListener, container) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                xhttpIsReady(xhttp, messageBuffer, valueChangeListener, container);
            }
        };
        xhttp.open("GET", xmlURL, true);
        xhttp.send();
        function xhttpIsReady(xml, messageBuffer, valueChangeListener, container) {
            var xmlDoc = xml.responseXML;
            var root = SCommunicator.getRootDirectory(xmlDoc, messageBuffer, valueChangeListener, container);
            SCommunicator.startTableCreation(root, container);
        }
    };
    /**
     *
     * Gets the whole directory structure including all directories and parameters.
     * @param xml The xml file that has already been imported.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified if the value of any parameters change.
     * @returns {SettingsDirectory|null} The root directory of the structure, null if the XML file is invalid.
     */
    SCommunicator.getRootDirectory = function (xml, messageBuffer, valueChangeListener, container) {
        var root2 = xml.children;
        if (root2.length != 1) {
            // Error
            return null;
        }
        return SCommunicator.createRecursively(root2[0], messageBuffer, valueChangeListener, container);
    };
    /**
     * Creates the directory structure recursively.
     * @param directory Directory which should be parsed. It is empty now, but will be containing all of its elements on return.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified when the value of any parameter changes.
     * @returns {SettingsDirectory|any} The input directory that is now containing all of its children.
     */
    SCommunicator.createRecursively = function (directory, messageBuffer, valueChangeListener, container) {
        var childNodes = directory.childNodes;
        var settingsDir;
        settingsDir = new SettingsDirectory(SCommunicator.getValue("ruid", directory), SCommunicator.getValue("name", directory), SCommunicator.getValue("description", directory), [], SCommunicator.getValue("imageURL", directory));
        for (var i = 0; i < childNodes.length; i++) {
            var child;
            if (childNodes[i].tagName == "dir") {
                child = SCommunicator.createRecursively(childNodes[i], messageBuffer, valueChangeListener, container);
                settingsDir.appendChild(child);
            }
            else if (childNodes[i].tagName == "npar") {
                child = SCommunicator.parseNumericParameter(childNodes[i], messageBuffer, valueChangeListener, container);
                settingsDir.appendChild(child);
            }
        }
        return settingsDir;
    };
    /**
     * Function to parse a numeric parameter. It will initialize the topic, the image url and all the other properties a numeric parameter can have.
     * @param parameter The numeric parameter to be parsed.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified when the value of any parameter changes.
     * @returns {SettingsParameter} The input parameter that is now fully parsed and all the properties are valid based on the XML file.
     */
    SCommunicator.parseNumericParameter = function (parameter, messageBuffer, valueChangeListener, container) {
        var topicID = SCommunicator.getValue('topicID', parameter);
        var topicName = SCommunicator.getValue('topicName', parameter);
        var topic = new Topic(topicID, topicName);
        var childPar = new SettingsParameter(SCommunicator.getValue("ruid", parameter), SCommunicator.getValue("name", parameter), SCommunicator.getValue("description", parameter), SCommunicator.getValue("imageURL", parameter), topic, valueChangeListener, messageBuffer.getValueOf(topic), container);
        return childPar;
    };
    /**
     * Gets the value of a tag of an XML node.
     * @param tag The tag we are looking for.
     * @param directory The XML directory/node we are searching in.
     * @returns {any} The value of the tag of the XML node.
     */
    SCommunicator.getValue = function (tag, directory) {
        for (var i = 0; i < directory.childNodes.length; i++) {
            if (directory.childNodes[i].tagName == tag) {
                return directory.childNodes[i].innerHTML;
            }
        }
        return "XML error. Tag \"" + tag + "\" is missing.";
    };
    /**
     * Opens an XML file from an URL.
     * @param xmlURL The URL of the XML file to be opened.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified if the value of any parameters change.
     */
    SCommunicator.openXMLfromURL = function (xmlURL, messageBuffer, valueChangeListener, container) {
        SCommunicator.startXMLconversion(xmlURL, messageBuffer, valueChangeListener, container);
    };
    /**
     * Starts the creation of the GUI table from the OO root directory.
     * @param root The OO model of the root directory (already containing all the subfolders).
     */
    SCommunicator.startTableCreation = function (root, container) {
        var textDebugger = new TextDebugger();
        var valueChangeListener = new ValueChangeListener(textDebugger);
        var table = new TableFactory(container, valueChangeListener);
        table.createTable(root);
    };
    return SCommunicator;
})();
/**
 * A message buffer used to communicate with the server.
 */
var MessageBuffer = (function (_super) {
    __extends(MessageBuffer, _super);
    /**
     * Creates a new message buffer.
     * @param valueChangeListener The value change listener to be notified if the value of any parameter changes.
     */
    function MessageBuffer(valueChangeListener, container) {
        _super.call(this);
        this.answersToReceive = 0;
        this.valueChangeListener = valueChangeListener;
        this.container = container;
    }
    /**
     * Initializes the module, sends a request to the database to send all the settings values.
     */
    MessageBuffer.prototype.initialize = function () {
        this.sendDBRequest();
    };
    /**
     * Specifies if this message buffer is already initialized or not.
     * @returns {boolean} True if this message buffer is initialized, false else.
     */
    MessageBuffer.prototype.isInitialized = function () {
        if (this.configs == null) {
            return false;
        }
        return true;
    };
    /**
     * Sends a database settings request message to the database. No parameters needed, only one possible database settings request message exists.
     */
    MessageBuffer.prototype.sendDBRequest = function () {
        this.answersToReceive++;
        Broker.get().subscribe(Topic.SETTINGS_MSG, this);
        Broker.get().handleMessage(new DBRequestMessage(new DBSettingsRequest()));
    };
    /**
     * Handles an incoming message from the server.
     * @param m The message that has been send by the server to this settings module.
     */
    MessageBuffer.prototype.handleMessage = function (m) {
        if (m.getTopic().equals(Topic.SETTINGS_MSG)) {
            if (this.answersToReceive > 0) {
                this.answersToReceive--;
                this.configs = m.getConfigs();
                this.onReceiveData();
            }
        }
    };
    /**
     * Gets the buffered value of the specified parameter.
     * @param topic The topic of the specified parameter.
     * @returns {number} The numerical value of the specified parameter.
     */
    MessageBuffer.prototype.getValueOf = function (topic) {
        var val1 = this.configs.get(topic);
        return this.configs.get(topic).numericalValue();
        //return this.configs.get(topic).numericalValue();
    };
    /**
     * Redraws the whole GUI if the settings were updated.
     * May be fine tuned later to allow the change of single parameters.
     */
    MessageBuffer.prototype.onReceiveData = function () {
        SCommunicator.openXMLfromURL("/src/tsnode/settings/settingsDS.xml", this, this.valueChangeListener, this.container);
    };
    return MessageBuffer;
})(BusDevice);
/**
 * A dummy database used only for test purposes to emulate the real database locally.
 */
var DummyDatabase = (function (_super) {
    __extends(DummyDatabase, _super);
    /**
     * Creates a dummy database.
     */
    function DummyDatabase() {
        _super.call(this);
        this.subscribe(Topic.DBREQ_MSG);
    }
    /**
     * Handles a message that has been sent to the database (this). Only Database request messages are supported.
     * @param m The message that has been sent to the database.
     */
    DummyDatabase.prototype.handleMessage = function (m) {
        var auxmap = new AuxiliaryMap();
        var topic1 = new Topic(101, 'topicName_par1');
        auxmap.set(topic1, new Value(111, 'valueName'));
        var topic2 = new Topic(201, 'topicName_par2');
        auxmap.set(topic2, new Value(222, 'valueName'));
        Broker.get().handleMessage(new AuxiliarySettingsMessage(auxmap));
    };
    return DummyDatabase;
})(BusDevice);
/**
 * The static class that can be used to initialize this module.
 */
var Startup = (function () {
    function Startup() {
    }
    /**
     * Initializes the settings module.
     */
    Startup.initialize = function (container) {
        var textDebugger = new TextDebugger();
        TextDebugger.refreshData(null, container);
        var valueChangeListener = new ValueChangeListener(textDebugger);
        var messageBuffer = new MessageBuffer(valueChangeListener, container);
        var database = new DummyDatabase();
        messageBuffer.initialize();
        var div = document.createElement("msgDIV");
        div.id = "msgDIV";
        div.innerHTML = "No messages received yet.";
        container.appendChild(div);
    };
    return Startup;
})();
var Communicator = (function () {
    function Communicator() {
    }
    Communicator.prototype.subscribe = function () {
        this.mychannel = postal.channel("values");
        this.mychannel.subscribe("value.steering", this.onMessageReceived);
    };
    Communicator.prototype.onMessageReceived = function (data) {
        var msgdiv = document.getElementById("msgDIV");
        msgdiv.innerHTML = "Message received: " + data.value.value;
        // var swRotation = document.getElementById("swRotation");
        // swRotation.value = data.value.value;
        //  Event: swRotation value changed!
    };
    return Communicator;
})();
/**
 * Starts the initialization process...
 */
var div1 = document.getElementById("div1");
var div2 = document.createElement("div");
div2.style.height = "300px";
div1.appendChild(div2);
Startup.initialize(div2);
var com = new Communicator();
com.subscribe();

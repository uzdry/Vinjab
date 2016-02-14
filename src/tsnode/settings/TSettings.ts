///<reference path="S:\Program Files (x86)\JetBrains\WebStorm 11.0.3\plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>

/// <reference path="../../../typings/postal/postal.d.ts"/>

/**
 * @author: David G.
 */

/**
 * START OF DATABASE COMMUNICATION PART.
 */
class ExampleDatabase {
    public onSettingsMessageReceived(message : SettingsMessage) {
        if (message.hasBeenHandledByDB() == true) {
            // Ignore echo.
            return;
        }

        var containers = message.getContainers();

        if (containers == null) {
            // No topics (keys) specified.

            //  Can be used to clean up inconsistent database / XML structure, return every settings entry stored in the DB.
            var msg = new SettingsMessage(this.getAllSettingsContainersFromDB(), true);
            this.publishSettingsMessage(msg);
        }

        // else: a list of topics specified.
        for (var i = 0; i < containers.length; i++) {
            var valueInDB = this.readEntry(containers[i].getTopic());

            if (valueInDB != null) {
                // Value for this key exists in the DB.

                if (containers[i].getDirection() == SettingsIODirection.read) {
                    // Read operation.
                    containers[i].setValue(valueInDB);
                } else {
                    // Write operation.
                    //  IMPORTANT : containers[i].getValue() may be NULL.
                    if (containers[i].getValue() != null) {
                        // Overwrite an existing value with a new value.
                        this.writeEntry(containers[i].getTopic(), containers[i].getValue());
                    } else {
                        // Overwrite an existing value with null: delete.
                        this.deleteEntry(containers[i].getTopic());
                    }
                }
            }  else {
                // Value has not been found for this key in the DB.

                if (containers[i].getDirection() == SettingsIODirection.read) {
                    // Cannot read from database, entry does not exist.
                    containers[i].setValue(null);
                    // Note: you can replace NULL with valueInDB, the latter is also NULL.
                } else {
                    // This is a write operation.
                    //  IMPORTANT : containers[i].getValue() may be NULL.
                    if (containers[i].getValue() != null) {
                        // Update database, add new settings entry.
                        this.createNewEntry(containers[i].getTopic(), containers[i].getValue());
                    } else {
                        // Do nothing. Entry does not exist, therefore there is no need to delete it.
                    }
                }
            }
        }
        message.setHandledByDBFlag();
        this.publishSettingsMessage(message);
    }

    private publishSettingsMessage(message : SettingsMessage) {

    }

    private deleteEntry(key : string) {
        return;
    }

    /**
     * Writes to a database entry (Key/Value store).
     */
    private writeEntry(key : string, value : string) {
        return;
    }

    /**
     * Creates a new database entry (Key/Value store).
     */
    private createNewEntry(key : string, value : string) {
        return;
    }

    /**
     * Gets all the settings values from the database.
     * Example: returns all values with the following keys: "settings.*"
     */
    private getAllSettingsContainersFromDB() : SettingsContainer[] {
        var allSettingsContainersStoredInDB : SettingsContainer[] = [];
        return allSettingsContainersStoredInDB;
    }

    /*
     * Key/Value get interface.
     */
    private readEntry(key : string) : string {
        // Instead of returning a new value, return the one from the database.
        if (true) {
            // Key exists in DB and the entry stored under key is a Value object.
            return "0|Name";
        } else {
            return null;
        }
    }
}

class SettingsMessage {
    private handledByDB : boolean;
    private containers : SettingsContainer[];

    constructor(containers : SettingsContainer[], hasBeenHandledByDB : boolean) {
        this.containers = containers;
        this.handledByDB = false;
    }

    public toString() : string {
        var buf : string = "SettingsMessage[|";
        if (this.handledByDB == true) {
            buf += "true|";
        } else {
            buf += "false|";
        }
        for (var i = 0; i < this.containers.length; i++) {
            buf += this.containers[i].toString();
        }
        buf += "|]";
        return buf;
    }

    public static fromString(stringToParse : string) : SettingsMessage {
        var splitted = stringToParse.split("|");
        var containers : SettingsContainer[] = [];
        if (splitted[0] == "SettingsMessage[") {
            for (var i = 2; i < splitted.length; i += 5) {
                var strconc = "";
                for (var j = 0; j < 5; j++) {
                    strconc += splitted[i + j];
                }
                var sc = SettingsContainer.fromString(strconc);
                if (sc == null) {
                    // Error.
                    return null;
                }
                containers.push(sc);
            }
        }
        var alreadyHandled : boolean;
        if (splitted[1] == "true") {
            alreadyHandled = true;
        } else if (splitted[1] == "false") {
            alreadyHandled = false;
        } else {
            return null;
        }
        return new SettingsMessage(containers, alreadyHandled);
    }

    public getContainers() : SettingsContainer[] {
        return this.containers;
    }

    public hasBeenHandledByDB() : boolean {
        return this.handledByDB;
    }

    public setHandledByDBFlag() {
        this.handledByDB = true;
    }
}

class SettingsContainer {
    private topic : string;
    private value : string;
    private direction : SettingsIODirection;

    constructor(topic : string, value : string, direction : SettingsIODirection) {
        this.topic = topic;
        this.value = value;
        this.direction = direction;
    }

    public toString() : string {
        var dir : string = "write";
        if (this.direction == SettingsIODirection.read) {
            dir = "read";
        }
        return "SettingsContainer[|" + this.topic + "|" + this.value + "|" + dir + "|]";
    }

    public static fromString(stringToParse : string) : SettingsContainer {
        if (stringToParse == null) {
            return null;
        }
        var splitted = stringToParse.split("|");
        if (splitted[0] != "SettingsContainer[") {
            return null;
        } else if (splitted.length != 5) {
            return null;
        } else {
            var direction;
            if (splitted[3] == "read") {
                direction = SettingsIODirection.read;
            } else if (splitted[3] == "write") {
                direction = SettingsIODirection.write;
            } else {
                return null;
            }
            return new SettingsContainer(splitted[1], splitted[2], direction);
        }
    }

    public getTopic() : string {
        return this.topic;
    }

    public getValue() : string {
        return this.value;
    }

    public setValue(value : string) {
        this.value = value;
    }

    public getDirection() : SettingsIODirection {
        return this.direction;
    }
}

enum SettingsIODirection {
    read, write
}

/**
 * END OF DATABASE COMMUNICATION PART.
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
class Value {
    private value:number;
    private identifier:string;

    constructor(pValue:number, pID:string) {
        this.value = pValue;
        this.identifier = pID;
    }

    public numericalValue():number {
        return this.value;
    }

    public getIdentifier():string {
        return this.identifier;
    }
}

//Topic defines the Topic of a message. BusDevices subscribe to Topics
class Topic {

    static VALUE_MSG =          new Topic("value.*");
    static DBREQ_MSG =          new Topic("database request message");
    static VALUE_ANSWER_MSG =   new Topic("value answer message");
    static SETTINGS_MSG =       new Topic("settings message");

    static SPEED =              new Topic("value.speed");
    static MAF =                new Topic("value.mass air flow");
    static COOLANT_PRESSURE =   new Topic("value.coolant temperature");
    static FUEL_PRESSURE =      new Topic("value.fuel pressure");
    static RPM =                new Topic("value.RPM");
    static STEERING =           new Topic("value.steering");
    static INTAKE_TEMP =        new Topic("value.intake air temperature");
    static ENGINE_RUNTIME =     new Topic("value.engine runtime");
    static FUEL =               new Topic("value.fuel");
    static EGR_STATE =          new Topic("value.exhaust gas recirculation state");
    static INJ_PRESSURE =       new Topic("value.injection pressure State");
    static FPC_STATE =          new Topic("value.fuel pressure control state");
    static GPV =                new Topic("value.gas pressure vaporizer");
    static CAT_TEMP =           new Topic("value.catalyst temperature");
    static THROTTLE =           new Topic("value.throttle");
    static ACCELERATOR =        new Topic("value.accelerator pedal position");
    static TEMP_OUT =           new Topic("value.temperature outside");
    static TORQUE =             new Topic("value.engine torque");
    static EGT =                new Topic("value.exhaust gas temperature");
    static EGP =                new Topic("value.exhaust gas pressure");
    static ULTRASONIC =         new Topic("value.ultrasonic sensor distance");


    static FUEL_CONSUMPTION =   new Topic("value.aggregated.fuel consumption");
    static MILEAGE =            new Topic("value.aggregated.mileage");
    static FUEL_CONSUMPTION_H = new Topic("value.aggregated.fuel per hour");

    static AVG_FUEL =           new Topic("value.avg.aggregated.fuel consumption");
    static AVG_SPEED =          new Topic("value.avg.speed");

    static DASHBOARD_MSG =      new Topic("dashboard settings");
    static DASHBOARD_ANS_MSG =  new Topic("dashboard settings from database");
    static REPLAY_REQ =         new Topic("replay request");
    static REPLAY_ANS =         new Topic("replay answer");
    static REPLAY_INFO =        new Topic("replay information");

    static VALUES: Topic[] = [     Topic.SPEED,
        Topic.MAF,
        Topic.COOLANT_PRESSURE,
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

    name:string;

    //instantiates a new Topic with ID and name
    constructor(pName:string) {
        this.name = pName;
    }

    public getName(): string {
        return this.name
    }

    public equals(topic: Topic): boolean {
        return this.name === topic.name;
    }
}

/**
 * 1:1 import of the class Message.
 */
//super class for all Message Types
class Message {
    private topic:Topic;

    constructor(pTopic:Topic) {
        this.topic = pTopic;
    }

    public getTopic():Topic {
        return this.topic;
    }
}

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
abstract class BusDevice {
    broker:Broker;
    private id:number;
    static cnt:number = 0;

    constructor() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }

    public abstract handleMessage(m:Message):void;

    private abstractHandle():void {
        throw new Error('This method is abstract and must be overridden');
    }

    public subscribe(t:Topic) {
        this.broker.subscribe(t, this);
    }

    public subscribeAll(topics: Topic[]): void {
        for (var x in topics) {
            this.broker.subscribe(x, this);
        }
    }

    public unsubscribe(t:Topic) {
        this.broker.unsubscribe(t, this);
    }

    public getID():number {
        return this.id;
    }
}


/**
 * A class that is used instead of Set because of import problems (does not work in the browser).
 */
class AuxiliaryMapBroker {
    topics : Topic[];
    busdevices : AuxiliaryBusDeviceArray[];

    public constructor() {
        this.topics = [];
        this.busdevices = [];
    }

    public get(topic : Topic) : AuxiliaryBusDeviceArray {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.busdevices[index];
        }
        return null;
    }

    public set(topic : Topic, auxiliaryBusDeviceArray : AuxiliaryBusDeviceArray) {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.busdevices[index] = auxiliaryBusDeviceArray;
        } else {
            this.topics.push(topic);
            this.busdevices.push(auxiliaryBusDeviceArray);
        }
    }
    private getIndexOf(topic : Topic) : number {
        for (var i = 0; i < this.topics.length; i++) {
            if (this.topics[i].equals(topic)) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * A class that is used instead of Map in Map< Topic, Set<> > because of import problems (does not work in the browser).
 */
class AuxiliaryBusDeviceArray {
    private busDevices : BusDevice[];
    public constructor() {
        this.busDevices = [];
    }

    public push(busdevice : BusDevice) {
        this.busDevices.push(busdevice);
    }

    public remove(sub : BusDevice) {

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
    }

    public getArray() : BusDevice[] {
        return this.busDevices;
    }
}

/**
 * A slightly modified version of the class Broker, it uses the class AuxiliaryMapBroker instead of Map< Topic, Set<> >
 */
class Broker {
    private static instance:Broker;
    private subscribers: AuxiliaryMapBroker;

    constructor() {
        this.subscribers = new AuxiliaryMapBroker();
    }

    public static get():Broker {
        if (Broker.instance == null || typeof Broker.instance == undefined) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    }

    public handleMessage(m: Message) {
        this.distribute(m);
    }


    public subscribe(topic:Topic, sub:BusDevice):void {
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new AuxiliaryBusDeviceArray());
            //console.log('Set created');
        }
        //console.log(sub);
        this.subscribers.get(topic).push(sub);
    }

    public unsubscribe(topic:Topic, sub:BusDevice):void {
        // delete sub
        this.subscribers.get(topic).remove(sub);
    }

    private distribute(m:Message) {
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
    }
}

/**
 * The 1:1 import of DBRequestMessage.
 */
class DBRequestMessage extends Message {
    private req: DBRequest;

    constructor(pReq: DBRequest) {
        super(Topic.DBREQ_MSG);
        this.req = pReq;
    }

    public getRequest():DBRequest {
        return this.req
    }
}

/**
 * The 1:1 import of DBRequest.
 */
class DBRequest {
}

/**
 * The 1:1 import of DBSettingsRequest.
 */
class DBSettingsRequest extends DBRequest {

}

/**
 * Emulates the Map used on the server side.
 */
class AuxiliaryMap {
    topics : Topic[];
    values : Value[];

    public constructor() {
        this.topics = [];
        this.values = [];
    }

    public set(topic : Topic, value : Value) : void {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.values[index] = value;
        } else {
            this.topics.push(topic);
            this.values.push(value);
        }
    }

    public get(topic : Topic) : Value {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.values[index];
        }
        return null;
    }

    private getIndexOf(topic : Topic) {
        for (var i = 0; i < this.topics.length; i++) {
            if (topic.equals(this.topics[i])) {
                return i;
            }
        }
        return -1;
    }
}


/**
 * The settings message that uses the emulated Map instead of the original one.
 */
class AuxiliarySettingsMessage extends Message {
    private configs: AuxiliaryMap;

    constructor(configs : AuxiliaryMap) {
        super(Topic.SETTINGS_MSG);
        this.configs = configs; //new Map<Topic, Value>();
    }

    public getConfigs(): AuxiliaryMap {
        return this.configs;
    }
}




/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * !!!!!!!! - = END OF HARD CODED IMPORT PART = - !!!!!!!!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */



/**
 * Creates the main HTML table for the settings GUI.
 */
class TableFactory {

    private valueChangeListener : ValueChangeListener;
    private table : HTMLTableElement;
    private tableBody : HTMLElement;

    private container : Node;
    private actualSettingsNode : SettingsNode;

    private backButton : HTMLTableCellElement;

    /**
     * Creates a new TableFactory.
     * @param container The HTML DOM object that should contain the table (not yet implemented).
     * @param valueChangeListener The object that logs the changes to be written back to the database (to be removed soon...).
     */
    constructor (container : Node, valueChangeListener : ValueChangeListener) {
        this.container = container;
        this.valueChangeListener = valueChangeListener;
    }

    /**
     * Adds a new row to the table that contains a folder or a parameter.
     * The information source is the actualSettingsNode and the amount of the rows already present.
     * Therefore there are no parameters needed.
     */
    appendRow() {
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
            } else {
                this.backButton.style.backgroundColor = "Gray";
            }
            var img = document.createElement('img');
            img.src = "../../img/settings/leftarrow.png";
            img.style.width = "50px";
            img.style.height = "50px";
            this.backButton.appendChild(img);
            tr.appendChild(this.backButton);
        } else {
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

            } else {
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
            } else {
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
            input.onchange = function() {
                actualRowNode.setActualValue(this.value);
                //changeListener.valueChanged(fullUid, this.value, actualRowNode.getValue());
            };
            form.appendChild(input);
            td.appendChild(form);
        }
        td.style.width = "320px";
        tr.appendChild(td);

        this.tableBody.appendChild(tr);
    }

    /**
     * Creates a whole HTML table with the specified node as the parent (all the children will be displayed).
     * @param actualSettingsNode The parent node, all of its children should be displayed in the table.
     */
    createTable(actualSettingsNode : SettingsNode) {
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
        var okbutton : HTMLButtonElement;
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
    }

    /**
     * Deletes the whole table from the GUI.
     */
    removeTable() {
        this.container.removeChild(this.table);
    }
}

/**
 * A settings directory that can contain parameters or other directories.
 */
class SettingsDirectory implements SettingsNode{
    private elements : SettingsNode[];
    private name : string;
    private description : string;
    private parent : SettingsNode;
    private ruid : string;
    private imageURL : string;

    /**
     * Creates a settings directory.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param elements The children of this directory.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     */
    public constructor(ruid : string, name : string, description : string, elements : SettingsNode[], imageURL : string) {
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
    setActualValue(value : number) : void {
    }

    /**
     * Notifies this object that its value has been saved in the database.
     */
    actualValueStored() : void {
        if (this.elements != null) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].actualValueStored();
            }
        }
    }

    /**
     * Gets the topic of this directory. Directories do not have a topic, so null is returned.
     * @returns {null} Null, directories do not have a topic.
     */
    getTopic() : Topic {
        return null;
    }

    /**
     * Gets the actual value of the directory. To be ignored.
     * @returns {number} The actual value of the directory.
     */
    getActualValue() {
        return 0;
    }

    /**
     * Appends a new child element to this directory.
     * @param element The child node to be appended to this directory.
     */
    appendChild(element : SettingsNode) {
        if (this.getElementByRuid(element.getRuid()) == null) {
            this.elements.push(element);
            element.setParent(this);
        }
    }

    /**
     * Gets a child of this directory based on its ruid. No grandchildren will be checked.
     * @param ruid The ruid of the child of this directory you are looking for.
     * @returns {any} The child of this directory with the specified ruid, null if not found.
     */
    getElementByRuid(ruid : string) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].getRuid() == ruid) {
                return this.elements[i];
            }
        }
        return null;
    }

    /**
     * Gets the original value of this directory. To be ignored.
     * @returns {number} The original value of this directory.
     */
    getValue() {
        return 0;
    }

    /**
     * Gets the URL of the image that is to be displayed as this directory in the GUI.
     * @returns {string} The URL of the image of this directory.
     */
    getImageURL() {
        return this.imageURL;
    }

    /**
     * Gets the full unique ID of this directory.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this directory.
     */
    getFullUid() {
        if (this.parent == this) {
            return this.ruid;
        }
        return this.parent.getFullUid() + '/' + this.ruid;
    }

    /**
     * Gets the relatively unique ID of this directory.
     * @returns {string} The ruid of this directory.
     */
    getRuid() {
        return this.ruid;
    }

    /**
     * Gets all the children of this directory.
     * @returns {SettingsNode[]} The children of this directory.
     */
    getElements() {
        return this.elements;
    }

    /**
     * Gets the name of this directory that is to be displayed in the GUI.
     * @returns {string} The name of this directory.
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the description of this directory that is to be displayed in the GUI.
     * @returns {string} The description of this directory.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Checks whether this node is a directory.
     * @returns {boolean} True.
     */
    isDirectory() {
        return true;
    }

    /**
     * Sets the parent directory of this directory.
     * @param parent The new parent directory of this.
     */
    setParent(parent : SettingsDirectory) {
        this.parent = parent;
    }

    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    getParent() {
        return this.parent;
    }
}

/**
 * A settings parameter that can have multiple numeric values.
 */
class SettingsParameter implements SettingsNode {
    private name : string;
    private description : string;
    private parent : SettingsDirectory;
    private ruid : string;
    private imageURL : string;
    private value : number;
    private actualValue : number;
    private topic : Topic;
    private valueChangeListener : ValueChangeListener;
    private container : Node;

    /**
     * Creates a settings parameter.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     * @param value The original value of this settings parameter.
     */
    public constructor(ruid : string, name : string, description : string, imageURL : string, topic : Topic, valueChangeListener : ValueChangeListener, value : number,
        container : Node) {
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
    actualValueStored() {
        this.value = this.actualValue;
    }

    /**
     * Settings the actual value of this parameter (that is set in the GUI).
     * Does not change the original value of this parameter that is in the DB.
     * @param value The new actual value of this parameter.
     */
    setActualValue(value : number) {
        this.actualValue = value;
        if (this.actualValue != this.value) {
            this.valueChangeListener.append(this, this.container);
        } else {
            this.valueChangeListener.remove(this, this.container);
        }
    }

    /**
     * Gets the actual value of this parameter.
     * @returns {number} The actual value of this parameter.
     */
    getActualValue() {
        return this.actualValue;
    }

    /**
     * Gets the value of this parameter that is currently stored in the DB.
     * @returns {number} The value of this parameter that is currently stored in the DB.
     */
    getValue() {
        return this.value;
    }

    /**
     * Gets the URL of the image of this parameter that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this parameter.
     */
    getImageURL() {
        return this.imageURL;
    }

    getTopic() : Topic {
        return this.topic;
    }

    /**
     * Gets the full unique ID of this parameter.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this parameter.
     */
    getFullUid() {
        return this.parent.getFullUid() + '/' + this.ruid;
    }

    /**
     * Gets the relatively unique ID of this parameter.
     * @returns {string} The ruid of this parameter.
     */
    getRuid() {
        return this.ruid;
    }

    /**
     * Gets the elements of this node. Paramaters do not contain elements, so it returns null.
     * @returns {null} Null.
     */
    getElements() {
        return null;
    }

    /**
     * Gets the name of this parameter that is to be displayed in the GUI.
     * @returns {string} The name of this parameter.
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the description of this parameter that is to be displayed in the GUI.
     * @returns {string} The description of this parameter.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Checks whether this node is a directory.
     * @returns {boolean} False.
     */
    isDirectory() {
        return false;
    }

    /**
     * Sets the parent directory of this parameter.
     * @param parent The new parent directory of this.
     */
    setParent(parent : SettingsDirectory) {
        this.parent = parent;
    }

    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    getParent() {
        return this.parent;
    }
}

interface SettingsNode {

    actualValueStored() : void;

    /**
     * Sets the actual value of this node (that is set in the GUI).
     * Does not change the original value of this node that is in the DB.
     * @param value The new actual value of this node.
     */
    setActualValue(value : number);

    /**
     * Gets the actual value of this node.
     * @returns {number} The actual value of this node.
     */
    getActualValue() : number;

    /**
     * Gets the value of this node that is currently stored in the DB.
     * @returns {number} The value of this node that is currently stored in the DB.
     */
    getValue() : number;

    /**
     * Gets the URL of the image of this node that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this node.
     */
    getImageURL() : string;

    /**
     * Gets the name of this node that is to be displayed in the GUI.
     * @returns {string} The name of this node.
     */
    getName() : string;

    /**
     * Gets the description of this node that is to be displayed in the GUI.
     * @returns {string} The description of this node.
     */
    getDescription() : string;

    /**
     * Gets the elements of this node.
     * @returns {SettinsNode[]} The children of this node.
     */
    getElements() : SettingsNode[];

    /**
     * Checks whether this node is a directory.
     * @returns {boolean} Yes if this is a directory, false else.
     */
    isDirectory() : boolean;

    /**
     * Sets the parent directory of this node.
     * @param parent The new parent directory of this.
     */
    setParent(parent : SettingsDirectory);

    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    getParent() : SettingsNode;

    getTopic() : Topic;

    /**
     * Gets the relatively unique ID of this node.
     * @returns {string} The ruid of this node.
     */
    getRuid() : string;

    /**
     * Gets the full unique ID of this node.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this node.
     */
    getFullUid() : string;
}

/**
 * The class that provides a debugging console output in the browser.
 */
class TextDebugger {

    /**
     * Refreshes the whole output array consisting of two columns.
     * @param fullUids The list of the Uids of the parameters.
     * @param values The actual values of the parameters.
     */
    public static refreshData(settingsNodes : SettingsNode[], container : Node) {

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
        } else {
            for (var i = 0; i < settingsNodes.length; i++) {
                tr = document.createElement('tr');
                tr.height = "75px";
                td = document.createElement('td');
                td.innerHTML = settingsNodes[i].getFullUid();
                td.width = "150px";
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerHTML = '' + settingsNodes[i].getTopic().getName();
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
    }
}

/**
 * The class that logs all the changes to all the values that can be written back to the database.
 * May become deprecated soon.
 */
class ValueChangeListener {
    private settingsNodes : SettingsNode[];
    private textDebugger : TextDebugger;

    /**
     * Creates the listener.
     * @param textDebugger The debugger of the GUI that provides display function for this class.
     */
    constructor(textDebugger : TextDebugger) {
        this.textDebugger = textDebugger;
        this.settingsNodes = [];
    }

    /**
     * Gets the index of the settings node in the array.
     * @param settingsNode The settings node we are looking for.
     * @returns {number} The index of the settings node.
     */
    private getIndexOf(settingsNode : SettingsNode) : number {
        for (var i = 0; i < this.settingsNodes.length; i++) {
            if (this.settingsNodes[i].getFullUid() == settingsNode.getFullUid()) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Appends a new settings node to the to-be-written-to-the-database list.
     * @param settingsNode The new settings node that should be written to the database.
     */
    public append(settingsNode : SettingsNode, container : Node) {
        if (this.getIndexOf(settingsNode) == -1) {
            this.settingsNodes.push(settingsNode);
        }
        TextDebugger.refreshData(this.settingsNodes, container);
    }

    /**
     * Removes a node from the to-be-written-to-the-database list.
     * @param settingsNode The node that should be removed from the list.
     */
    public remove(settingsNode : SettingsNode, container : Node) {
        var index = this.getIndexOf(settingsNode);
        if (index != -1) {
            this.settingsNodes.splice(index, 1);
        }
        TextDebugger.refreshData(this.settingsNodes, container);
    }

    /**
     * Converts the internal to-be-written-to-the-database list of nodes to a settings message.
     * @returns {AuxiliarySettingsMessage} The settings message that can be sent directly to the database.
     */
    public getSettingsWriteMessage() : AuxiliarySettingsMessage {
        var auxiliaryMap = new AuxiliaryMap();
        for (var i = 0; i < this.settingsNodes.length; i++) {
            auxiliaryMap.set(this.settingsNodes[i].getTopic(), new Value(this.settingsNodes[i].getActualValue(), "ignoreME"));
        }
        var auxiliarySettingsMessage = new AuxiliarySettingsMessage(auxiliaryMap);
        return auxiliarySettingsMessage;
    }
}

/**
 * A class that is designed to support the conversion of the directory structure from XML to OO.
 */
class SCommunicator {

    /**
     * Searches for an element in the buffer with a specified ruid.
     * @param directoryBuffer The buffer that contains all the elements in which you are looking for a specified one.
     * @param ruid The ruid of the specific element you are looking for.
     * @returns {number} The index of the element in the array. -1 if not found.
     */
    private static getElementIndexByRuid(directoryBuffer : SettingsDirectory[], ruid : string) {
        for (var i = 0; i < directoryBuffer.length; i++) {
            if (directoryBuffer[i].getRuid() == ruid) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Starts the conversion of an xml file to an OO directory/parameter model.
     * @param xmlURL The URL of the XML file.
     * @param messageBuffer The message buffer to be used to communicate with the database if the data is about to be saved.
     * @param valueChangeListener The valueChangeListener that should be used by the OO parameter objects and notified on value change.
     */
    private static startXMLconversion(xmlURL : string, messageBuffer : MessageBuffer, valueChangeListener : ValueChangeListener, container : Node) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                xhttpIsReady(xhttp, messageBuffer, valueChangeListener, container);
            }
        };
        xhttp.open("GET", xmlURL, true);
        xhttp.send();

        function xhttpIsReady(xml, messageBuffer : MessageBuffer, valueChangeListener : ValueChangeListener, container : Node) {
            var xmlDoc = xml.responseXML;
            var root = SCommunicator.getRootDirectory(xmlDoc, messageBuffer, valueChangeListener, container);
            SCommunicator.startTableCreation(root, container);
        }
    }

    /**
     *
     * Gets the whole directory structure including all directories and parameters.
     * @param xml The xml file that has already been imported.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified if the value of any parameters change.
     * @returns {SettingsDirectory|null} The root directory of the structure, null if the XML file is invalid.
     */
    private static getRootDirectory(xml : any, messageBuffer : MessageBuffer, valueChangeListener : ValueChangeListener, container : Node) {
        var root2 = xml.children;
        if (root2.length != 1) {
            // Error
            return null;
        }
        return SCommunicator.createRecursively(root2[0], messageBuffer, valueChangeListener, container);
    }

    /**
     * Creates the directory structure recursively.
     * @param directory Directory which should be parsed. It is empty now, but will be containing all of its elements on return.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified when the value of any parameter changes.
     * @returns {SettingsDirectory|any} The input directory that is now containing all of its children.
     */
    private static createRecursively(directory : any, messageBuffer : MessageBuffer, valueChangeListener : ValueChangeListener, container : Node) {
        var childNodes = directory.childNodes;
        var settingsDir;
        settingsDir = new SettingsDirectory(SCommunicator.getValue("ruid", directory), SCommunicator.getValue("name", directory), SCommunicator.getValue("description", directory),
            [], SCommunicator.getValue("imageURL", directory));

        for (var i = 0; i < childNodes.length; i++) {
            var child;
            if (childNodes[i].tagName == "dir") {
                child = SCommunicator.createRecursively(childNodes[i], messageBuffer, valueChangeListener, container);
                settingsDir.appendChild(child);
            } else if (childNodes[i].tagName == "npar") {
                child = SCommunicator.parseNumericParameter(childNodes[i], messageBuffer, valueChangeListener, container);
                settingsDir.appendChild(child);
            }
        }
        return settingsDir;
    }

    /**
     * Function to parse a numeric parameter. It will initialize the topic, the image url and all the other properties a numeric parameter can have.
     * @param parameter The numeric parameter to be parsed.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified when the value of any parameter changes.
     * @returns {SettingsParameter} The input parameter that is now fully parsed and all the properties are valid based on the XML file.
     */
    private static parseNumericParameter(parameter : any, messageBuffer : MessageBuffer, valueChangeListener : ValueChangeListener, container : Node) {
        var topicName = SCommunicator.getValue('topicName', parameter);

        var topic = new Topic(topicName);

        var childPar = new SettingsParameter(SCommunicator.getValue("ruid", parameter), SCommunicator.getValue("name", parameter), SCommunicator.getValue("description", parameter),
            SCommunicator.getValue("imageURL", parameter), topic, valueChangeListener, messageBuffer.getValueOf(topic), container);
        return childPar;
    }

    /**
     * Gets the value of a tag of an XML node.
     * @param tag The tag we are looking for.
     * @param directory The XML directory/node we are searching in.
     * @returns {any} The value of the tag of the XML node.
     */
    private static getValue(tag : string, directory : any) {
        for (var i = 0; i < directory.childNodes.length; i++) {
            if (directory.childNodes[i].tagName == tag) {
                return directory.childNodes[i].innerHTML;
            }
        }
        return "XML error. Tag \"" + tag + "\" is missing.";
    }

    /**
     * Opens an XML file from an URL.
     * @param xmlURL The URL of the XML file to be opened.
     * @param messageBuffer The message buffer that is to be used to communicate with the database.
     * @param valueChangeListener The value change listener that will be notified if the value of any parameters change.
     */
    public static openXMLfromURL(xmlURL : string, messageBuffer : MessageBuffer, valueChangeListener : ValueChangeListener, container : Node) {
        SCommunicator.startXMLconversion(xmlURL, messageBuffer, valueChangeListener, container);
    }

    /**
     * Starts the creation of the GUI table from the OO root directory.
     * @param root The OO model of the root directory (already containing all the subfolders).
     */
    private static startTableCreation(root : SettingsDirectory, container : Node) {
        var textDebugger = new TextDebugger();
        var valueChangeListener = new ValueChangeListener(textDebugger);
        var table = new TableFactory(container, valueChangeListener);
        table.createTable(root);
    }
}


/**
 * A message buffer used to communicate with the server.
 */
class MessageBuffer extends BusDevice {
    private answersToReceive = 0;
    private configs : AuxiliaryMap;
    private valueChangeListener : ValueChangeListener;
    private container : Node;

    /**
     * Creates a new message buffer.
     * @param valueChangeListener The value change listener to be notified if the value of any parameter changes.
     */
    public constructor(valueChangeListener : ValueChangeListener, container : Node) {
        super();
        this.valueChangeListener = valueChangeListener;
        this.container = container;
    }

    /**
     * Initializes the module, sends a request to the database to send all the settings values.
     */
    public initialize() : void {
        this.sendDBRequest();
    }

    /**
     * Specifies if this message buffer is already initialized or not.
     * @returns {boolean} True if this message buffer is initialized, false else.
     */
    public isInitialized() : boolean {
        if (this.configs == null) {
            return false;
        }
        return true;
    }

    /**
     * Sends a database settings request message to the database. No parameters needed, only one possible database settings request message exists.
     */
    sendDBRequest() : void {
        this.answersToReceive++;
        Broker.get().subscribe(Topic.SETTINGS_MSG, this);
        Broker.get().handleMessage(new DBRequestMessage(new DBSettingsRequest()));
    }

    /**
     * Handles an incoming message from the server.
     * @param m The message that has been send by the server to this settings module.
     */
    public handleMessage(m : Message) : void {
        if (m.getTopic().equals(Topic.SETTINGS_MSG)) {
            if (this.answersToReceive > 0) {
                this.answersToReceive--;
                this.configs = (<AuxiliarySettingsMessage>m).getConfigs();
                this.onReceiveData();
            }
        }
    }

    /**
     * Gets the buffered value of the specified parameter.
     * @param topic The topic of the specified parameter.
     * @returns {number} The numerical value of the specified parameter.
     */
    getValueOf(topic : Topic) : number {

        var val1 = this.configs.get(topic);
        return this.configs.get(topic).numericalValue();

        //return this.configs.get(topic).numericalValue();
    }

    /**
     * Redraws the whole GUI if the settings were updated.
     * May be fine tuned later to allow the change of single parameters.
     */
    private onReceiveData() : void {
        SCommunicator.openXMLfromURL("/src/tsnode/settings/settingsDS.xml", this, this.valueChangeListener, this.container);
    }
}

/**
 * A dummy database used only for test purposes to emulate the real database locally.
 */
class DummyDatabase extends BusDevice {

    /**
     * Creates a dummy database.
     */
    public constructor() {
        super();
        this.subscribe(Topic.DBREQ_MSG);
    }

    /**
     * Handles a message that has been sent to the database (this). Only Database request messages are supported.
     * @param m The message that has been sent to the database.
     */
    public handleMessage(m : Message) : void {
        var auxmap = new AuxiliaryMap();
        var topic1 = new Topic('topicName_par1');
        auxmap.set(topic1, new Value(111, 'valueName'));
        var topic2 = new Topic('topicName_par2');
        auxmap.set(topic2, new Value(222, 'valueName'));
        Broker.get().handleMessage(new AuxiliarySettingsMessage(auxmap));
    }
}

/**
 * The static class that can be used to initialize this module.
 */
class Startup {
    /**
     * Initializes the settings module.
     */
    static initialize(container : Node) : void {
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
    }
}

class Communicator {
    public subscribe() : void {
        var channelsub = postal.channel("reqsubs");
        var reqsub = channelsub.publish("request." + "some", "value.steering");

      //  var mychannel = postal.channel("values");
       //mychannel.subscribe("value.steering", this.onMessageReceived);
    }

 /*   private onMessageReceived(data) : void {
        var msgdiv = document.getElementById("msgDIV");
        msgdiv.innerHTML = "Message received: " + data.value.value;
        // var swRotation = document.getElementById("swRotation");
        // swRotation.value = data.value.value;
        //  Event: swRotation value changed!
    }*/
}


/**
 * Starts the initialization process...
 */

var div1 = document.getElementById("div1");
var div2 = document.createElement("div");
div2.style.height = "300px";
div1.appendChild(div2);
Startup.initialize(div2);


var com : Communicator = new Communicator();
com.subscribe();

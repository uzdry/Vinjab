/// <reference path="../../../typings/postal/postal.d.ts"/>
/// <reference path="./TextDebugger.ts"/>
/// <reference path="./Renderer.ts"/>
/// <reference path="./SettingsDBCOM.ts"/>
/// <reference path="./../parkingsensor/Communicator.ts"/>
/// <reference path="./SettingsMessageClient.ts"/>
/// <reference path="./SettingsMessageCommon.ts"/>

/**
 * @author: David G.
 */

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



    public postal_getSettingsWriteMessages() : SettingsMessageClient.SettingsMessage[] {
        var sc : SettingsMessageCommon.SettingsContainer;
        var scArray : SettingsMessageCommon.SettingsContainer[] = [];

        for (var i = 0; i < this.settingsNodes.length; i++) {
            var sv : SettingsMessageClient.SettingsValue =
                new SettingsMessageClient.SettingsValue(this.settingsNodes[i].getActualValue(), "dontforgettochangeme");
            sc = new SettingsMessageCommon.SettingsContainer(this.settingsNodes[i].getTopic().getName(),
                sv, false);
            scArray.push(sc);
        }
        var smArray : SettingsMessageClient.SettingsMessage[] = [];
        for (var i = 0; i < scArray.length; i++) {
            smArray.push(new SettingsMessageClient.SettingsMessage(scArray[i], false));
        }
        return smArray;
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
        var topic = new SettingsMessageClient.STopic(topicName);

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

class MBMap {
    topics:SettingsMessageClient.STopic[];
    values:SettingsMessageInterface.ISettingsValue[];

    public constructor() {
        this.topics = [];
        this.values = [];
    }

    public set(topic:SettingsMessageClient.STopic, value:SettingsMessageInterface.ISettingsValue):void {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.values[index] = value;
        } else {
            this.topics.push(topic);
            this.values.push(value);
        }
    }

    public get(topic:SettingsMessageClient.STopic):SettingsMessageInterface.ISettingsValue {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.values[index];
        }
        return null;
    }

    private getIndexOf(topic:SettingsMessageClient.STopic) {
        for (var i = 0; i < this.topics.length; i++) {
            if (topic.equals(this.topics[i])) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * A message buffer used to communicate with the server.
 */
class MessageBuffer {
    private answersToReceive = 0;
    private configs : MBMap;
    private valueChangeListener : ValueChangeListener;
    private container : Node;

    /**
     * Creates a new message buffer.
     * @param valueChangeListener The value change listener to be notified if the value of any parameter changes.
     */
    public constructor(valueChangeListener : ValueChangeListener, container : Node) {
        this.valueChangeListener = valueChangeListener;
        this.container = container;
        this.configs = new MBMap();
    }

    /**
     * Initializes the module, sends a request to the database to send all the settings values.
     */
    public initialize() : void {
        this.postal_sendDBRequest();
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

    public postal_sendDBRequest() : void {
        var pch_db2st = postal.channel(TSConstants.db2stChannel);
        pch_db2st.subscribe(TSConstants.db2stTopic, this.postal_handleMessage.bind(this));
        var pch_st2db = postal.channel(TSConstants.st2dbChannel);
        pch_st2db.publish(TSConstants.st2dbTopic, new SettingsMessageClient.SettingsMessage(null, false));
    }

    public postal_handleMessage(data) {
        var message = <SettingsMessageInterface.ISettingsMessage>data;
        if (message.getTopic().equals(SettingsMessageClient.STopic.SETTINGS_MSG)) {
            if (message.getContainer() != null) {
                this.configs.set(new SettingsMessageClient.STopic(message.getContainer().getTopic()), message.getContainer().getValue());
                this.onReceiveData();
            }
        }
    }

    /**
     * Gets the buffered value of the specified parameter.
     * @param topic The topic of the specified parameter.
     * @returns {number} The numerical value of the specified parameter.
     */
    getValueOf(topic : SettingsMessageClient.STopic) : number {

        var val1 = this.configs.get(topic);
        return val1.numericalValue();

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
class DummyDatabase {

    private dbinf : SettingsDBCOM.ExampleDatabaseInterface;


    public constructor() {

        var topics : SettingsMessageClient.STopic[] = [];
        var values : SettingsMessageClient.SettingsValue[] = [];


        topics[0] = new SettingsMessageClient.STopic("settings.wheelbase");
        values[0] = new SettingsMessageClient.SettingsValue(4000, 'valueName');

        topics[1] = new SettingsMessageClient.STopic("settings.axletrack");
        values[1] = new SettingsMessageClient.SettingsValue(1300, 'valueName');

        topics[2] = new SettingsMessageClient.STopic('settings.steeringratio');
        values[2] = new SettingsMessageClient.SettingsValue(20, 'valueName');

        topics[3] = new SettingsMessageClient.STopic('settings.dbcapacity');
        values[3] = new SettingsMessageClient.SettingsValue(999, 'valueName');

        topics[4] = new SettingsMessageClient.STopic('settings.fueltankwarning');
        values[4] = new SettingsMessageClient.SettingsValue(8, 'valueName');

        topics[5] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.posx');
        values[5] = new SettingsMessageClient.SettingsValue(0, 'valueName');

        topics[6] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.posy');
        values[6] = new SettingsMessageClient.SettingsValue(800, 'valueName');

        topics[7] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.posz');
        values[7] = new SettingsMessageClient.SettingsValue(0, 'valueName');

        topics[8] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.rotx');
        values[8] = new SettingsMessageClient.SettingsValue(20, 'valueName');

        topics[9] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.roty');
        values[9] = new SettingsMessageClient.SettingsValue(0, 'valueName');

        topics[10] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.rotz');
        values[10] = new SettingsMessageClient.SettingsValue(0, 'valueName');

        topics[11] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.hres');
        values[11] = new SettingsMessageClient.SettingsValue(640, 'valueName');

        topics[12] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.vres');
        values[12] = new SettingsMessageClient.SettingsValue(480, 'valueName');

        topics[13] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.haov');
        values[13] = new SettingsMessageClient.SettingsValue(106, 'valueName');

        topics[14] = new SettingsMessageClient.STopic('settings.parkingsensor.camera.vaov');
        values[14] = new SettingsMessageClient.SettingsValue(90, 'valueName');

        this.dbinf =  new SettingsDBCOM.ExampleDatabaseInterface(new SettingsMessageClient.SpecimenFactory());

        var pch = postal.channel(TSConstants.st2dbChannel);
        pch.subscribe(TSConstants.st2dbTopic, this.postal_handleMessage.bind(this));

        for (var i = 0; i < topics.length; i++) {
            var sm = new SettingsMessageClient.SettingsMessage(
                new SettingsMessageCommon.SettingsContainer(topics[i].getName(),
                values[i], false), false);
            postal.channel(TSConstants.st2dbChannel).publish(TSConstants.st2dbTopic, sm);
        }



    }

    public postal_handleMessage(data) : void {
        var answers = this.dbinf.handleSettingsMessage(data);
        if (answers != null) {
            var pch = postal.channel(TSConstants.db2stChannel);
            for (var i = 0; i < answers.length; i++) {
                pch.publish(TSConstants.db2stTopic, answers[i]);
            }
        }
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

        var database = new DummyDatabase();

        var messageBuffer = new MessageBuffer(valueChangeListener, container);

        messageBuffer.initialize();

        var div = document.createElement("div");
        div.id = "settings_msgDIV";
        div.innerHTML = "No messages received yet.";
        container.appendChild(div);
    }

}

class TSConstants {
    public static st2dbChannel = "settingsintern_st2db";
    public static db2stChannel = "settingsintern_db2st";

    public static st2dbTopic = "settingsintern_st2db";
    public static db2stTopic = "settingsintern_db2st";

}




/**
 * Starts the initialization process...
 */
var div1 = document.getElementById("div1");
var div2 = document.createElement("div");
div2.style.height = "500px";
div2.style.padding = "20px";
div1.appendChild(div2);
Startup.initialize(div2);

var pcom : Communicator.PCommunicator = new Communicator.PCommunicator("settings_msgDIV", null);
pcom.subscribe();

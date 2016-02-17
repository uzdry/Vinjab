/// <reference path="../../../typings/postal/postal.d.ts"/>
/// <reference path="./Auxiliary.ts"/>
/// <reference path="./TextDebugger.ts"/>
/// <reference path="./Renderer.ts"/>

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

    /**
     * Converts the internal to-be-written-to-the-database list of nodes to a settings message.
     * @returns {AuxiliarySettingsMessage} The settings message that can be sent directly to the database.
     */
    public getSettingsWriteMessage() : Auxiliary.AuxiliarySettingsMessage {
        var auxiliaryMap = new Auxiliary.AuxiliaryMap();
        for (var i = 0; i < this.settingsNodes.length; i++) {
            auxiliaryMap.set(this.settingsNodes[i].getTopic(), new Auxiliary.Value(this.settingsNodes[i].getActualValue(), "ignoreME"));
        }
        var auxiliarySettingsMessage = new Auxiliary.AuxiliarySettingsMessage(auxiliaryMap);
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

        var topic = new Auxiliary.Topic(topicName);

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
class MessageBuffer extends Auxiliary.BusDevice {
    private answersToReceive = 0;
    private configs : Auxiliary.AuxiliaryMap;
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
        Auxiliary.Broker.get().subscribe(Auxiliary.Topic.SETTINGS_MSG, this);
        Auxiliary.Broker.get().handleMessage(new Auxiliary.DBRequestMessage(new Auxiliary.DBSettingsRequest()));
    }

    /**
     * Handles an incoming message from the server.
     * @param m The message that has been send by the server to this settings module.
     */
    public handleMessage(m : Auxiliary.Message) : void {
        if (m.getTopic().equals(Auxiliary.Topic.SETTINGS_MSG)) {
            if (this.answersToReceive > 0) {
                this.answersToReceive--;
                this.configs = (<Auxiliary.AuxiliarySettingsMessage>m).getConfigs();
                this.onReceiveData();
            }
        }
    }

    /**
     * Gets the buffered value of the specified parameter.
     * @param topic The topic of the specified parameter.
     * @returns {number} The numerical value of the specified parameter.
     */
    getValueOf(topic : Auxiliary.Topic) : number {

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
class DummyDatabase extends Auxiliary.BusDevice {

    /**
     * Creates a dummy database.
     */
    public constructor() {
        super();
        this.subscribe(Auxiliary.Topic.DBREQ_MSG);
    }

    /**
     * Handles a message that has been sent to the database (this). Only Database request messages are supported.
     * @param m The message that has been sent to the database.
     */
    public handleMessage(m : Auxiliary.Message) : void {
        var auxmap = new Auxiliary.AuxiliaryMap();
        var topic1 = new Auxiliary.Topic('wheelbase');
        auxmap.set(topic1, new Auxiliary.Value(4000, 'valueName'));
        var topic1 = new Auxiliary.Topic('axletrack');
        auxmap.set(topic1, new Auxiliary.Value(1300, 'valueName'));
        var topic1 = new Auxiliary.Topic('steeringratio');
        auxmap.set(topic1, new Auxiliary.Value(20, 'valueName'));
        var topic1 = new Auxiliary.Topic('dbcapacity');
        auxmap.set(topic1, new Auxiliary.Value(999, 'valueName'));
        var topic1 = new Auxiliary.Topic('fueltankwarning');
        auxmap.set(topic1, new Auxiliary.Value(8, 'valueName'));
        Auxiliary.Broker.get().handleMessage(new Auxiliary.AuxiliarySettingsMessage(auxmap));
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
    private mychannel;
    public subscribe() : void {
        var channelsub = postal.channel("reqsubs");
        var reqsub = channelsub.publish("request." + "value.steering", "value.steering");

        this.mychannel = postal.channel("values");
        this.mychannel.subscribe("value.steering", this.onMessageReceived.bind(this));
    }

    public onMessageReceived(data) : void {
        var msgdiv = document.getElementById("msgDIV");
        msgdiv.innerHTML = "Message received: " + data.value.value;
        // var swRotation = document.getElementById("swRotation");
        // swRotation.value = data.value.value;
        //  Event: swRotation value changed!
    }
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

//var com : Communicator = new Communicator();
//com.subscribe();

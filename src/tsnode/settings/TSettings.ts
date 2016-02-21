/// <reference path="../../../typings/postal/postal.d.ts"/>
/// <reference path="./Renderer.ts"/>

/// <reference path="./../parkingsensor/Communicator.ts"/>
/// <reference path="./SettingsData.ts"/>
/// <reference path="./CompositeStructure.ts"/>

import {Topic} from "../messages";
import {Message} from "../messages";
import {DashboardRspMessage} from "../messages";
import {DashboardMessage} from "../messages";
import {DBRequestMessage} from "../messages";
import {SettingsRequestMessage} from "../messages";
import {SettingsResponseMessage} from "../messages";

/**
 * @author: David G.
 */

/**
 * The class that logs all the changes to all the values that can be written back to the database.
 * May become deprecated soon.
 */

module TSettings {

    export interface IXMLParserCallBack {
        onXMLParsed(root : SettingsDirectory);
    }

    /**
     * A class that is designed to support the conversion of the directory structure from XML to OO.
     */
    export class XMLParser {
        private xmlURL : string;
        private clientSideBuffer : ClientSideBuffer;
        private container : Node;
        private callBack : IXMLParserCallBack = null;

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
        public startXMLconversion() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    xhttpIsReady(xhttp, this.clientSideBuffer, this.container);
                }
            };
            xhttp.open("GET", this.xmlURL, true);
            xhttp.send();

            var xmlp = this;
            var callBack = this.callBack;
            function xhttpIsReady(xml, clientSideBuffer : ClientSideBuffer, container : Node) {
                var xmlDoc = xml.responseXML;
                var root = xmlp.getRootDirectory(xmlDoc);
                //XMLParser.startTableCreation(root, clientSideBuffer, container);
                callBack.onXMLParsed(root);
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
        private getRootDirectory(xml : any) {
            var root2 = xml.children;
            if (root2.length != 1) {
                // Error
                return null;
            }
            return this.createRecursively(root2[0]);
        }

        /**
         * Creates the directory structure recursively.
         * @param directory Directory which should be parsed. It is empty now, but will be containing all of its elements on return.
         * @param messageBuffer The message buffer that is to be used to communicate with the database.
         * @param valueChangeListener The value change listener that will be notified when the value of any parameter changes.
         * @returns {SettingsDirectory|any} The input directory that is now containing all of its children.
         */
        private createRecursively(directory : any) {
            var childNodes = directory.childNodes;
            var settingsDir;
            settingsDir = new SettingsDirectory(XMLParser.getValue("ruid", directory), XMLParser.getValue("name", directory), XMLParser.getValue("description", directory),
                [], XMLParser.getValue("imageURL", directory));

            for (var i = 0; i < childNodes.length; i++) {
                var child;
                if (childNodes[i].tagName == "dir") {
                    child = this.createRecursively(childNodes[i]);
                    settingsDir.appendChild(child);
                } else if (childNodes[i].tagName == "npar") {
                    child = this.parseNumericParameter(childNodes[i]);
                    settingsDir.appendChild(child);
                } else if (childNodes[i].tagName == "lpar") {
                    child = this.parseListParameter(childNodes[i]);
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
         * @returns {SettingsNParameter} The input parameter that is now fully parsed and all the properties are valid based on the XML file.
         */
        private parseNumericParameter(parameter : any) : SettingsNParameter {
            var topic = XMLParser.getValue('topicName', parameter);

            var defaultValue = new SettingsData.SettingsContainer(XMLParser.getValue("topicName", parameter), XMLParser.getValue("defaultValue", parameter),
                XMLParser.getValue("unit", parameter));
            var childPar = new SettingsNParameter(XMLParser.getValue("ruid", parameter), XMLParser.getValue("name", parameter), XMLParser.getValue("description", parameter),
                XMLParser.getValue("imageURL", parameter), XMLParser.getValue("unit", parameter), defaultValue,
                XMLParser.getValue("minValue", parameter), XMLParser.getValue("maxValue", parameter), this.clientSideBuffer, this.container);
            return childPar;
        }

        private parseListParameter(parameter : any) : SettingsLParameter {
            var topic = XMLParser.getValue('topicName', parameter);

            var defaultValue = new SettingsData.SettingsContainer(XMLParser.getValue("topicName", parameter), XMLParser.getValue("defaultValue", parameter),
                XMLParser.getValue("unit", parameter));

            var options : SettingsLParameterOption[] = [];
            for (var i = 0; i < parameter.childNodes.length; i++) {
                if (parameter.childNodes[i].tagName == "option") {
                    var id = XMLParser.getValue("id", parameter.childNodes[i]);
                    var name = XMLParser.getValue("name", parameter.childNodes[i]);
                    options.push(new SettingsLParameterOption(id, name));
                }
            }

            var childPar = new SettingsLParameter(XMLParser.getValue("ruid", parameter), XMLParser.getValue("name", parameter), XMLParser.getValue("description", parameter),
                XMLParser.getValue("imageURL", parameter), XMLParser.getValue("unit", parameter), defaultValue, options,
                this.clientSideBuffer, this.container);
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

        private static getValues(tag : string, directory : any) : string[] {
            var buf : string[] = [];
            for (var i = 0; i < directory.childNodes.length; i++) {
                if (directory.childNodes[i].tagName == tag) {
                    buf.push(directory.childNodes[i].innerHTML);
                }
            }
            if (buf.length != 0) {
                return buf;
            }
            return ["XML error. Tag \"" + tag + "\" is missing."];
        }


        constructor(xmlURL : string, clientSideBuffer : ClientSideBuffer, container : Node, callBack : IXMLParserCallBack) {
            this.xmlURL = xmlURL;
            this.clientSideBuffer = clientSideBuffer;
            this.container = container;
            this.callBack = callBack;

        }
    }





    export class ClientSideBuffer implements IXMLParserCallBack {
        private database : SettingsData.SettingsData = null;
        private container : Node;
        private requestSent : boolean = false;
        private receiveCount : boolean = false;
        private root : SettingsDirectory = null;

        constructor(container : Node) {
            this.container = container;
        }

        getBuffer() : SettingsData.SettingsData {
            return this.database;
        }

        init() {
            postal.channel(TSConstants.db2stChannel).subscribe(TSConstants.db2stTopic, this.onReceive.bind(this));
            this.requestSent = true;
            this.forcePoll();
        }

        forcePoll() {
            postal.channel(TSConstants.st2dbChannel).publish(TSConstants.st2dbReadTopic,
                new SettingsRequestMessage((new SettingsData.SettingsData(null, true, false)).stringifyMe(), true));
        }

        onReceive(data) {
            var msg = SettingsData.SettingsData.parseMe(data.settings);
            this.database = msg;
            if (true) {
                this.receiveCount = true;
                var xmlp = new XMLParser("/src/tsnode/settings/settingsDS.xml", this, this.container, this);
                xmlp.startXMLconversion();
            }
        }

        onXMLParsed(root : SettingsDirectory) {
            this.root = root;
            root.pollFromDBRecursively();
            var table = new TableFactory(this.container, this);
            table.createTable(root);
        }

        onSend() {
            postal.channel(TSConstants.st2dbChannel).publish(TSConstants.st2dbWriteTopic,
                new SettingsRequestMessage(new SettingsData.SettingsData(this.database.getContainers(), false, false).stringifyMe(), false));
        }

        getValueOf(topic : string) : SettingsData.SettingsContainer {
            return this.database.getValueOf(topic);
        }

        setValueOf(container : SettingsData.SettingsContainer) {
            this.database.setValueOf(container);
        }
    }

    /**
     * A dummy database used only for test purposes to emulate the real database locally.
     */
    export class DummyDatabase {
        private database : SettingsData.SettingsData = new SettingsData.SettingsData([], true, true);

        public constructor() {

            var pch = postal.channel(TSConstants.st2dbChannel);
            pch.subscribe(TSConstants.st2dbReadTopic, this.postal_handleMessage.bind(this));
            pch.subscribe(TSConstants.st2dbWriteTopic, this.postal_handleMessage.bind(this));
        }

        public postal_handleMessage(data) : void {
            var msg = SettingsData.SettingsData.parseMe(data.settings);
            if (msg.isDirectionFromDB() == false) {
                if (msg.isIORead()) {

                    var clones = [];
                    for (var i = 0; i < this.database.getContainers().length; i++) {
                        clones.push(this.database.getContainers()[i].cloneMe());
                    }
                    var newDatabase = new SettingsData.SettingsData(clones, true, true);

                    postal.channel(TSConstants.db2stChannel).publish(TSConstants.db2stTopic,
                        new SettingsResponseMessage(newDatabase.stringifyMe()));
                } else {
                    var clones = [];
                    for (var i = 0; i < msg.getContainers().length; i++) {
                        clones.push(msg.getContainers()[i].cloneMe());
                    }
                    this.database = new SettingsData.SettingsData(clones, true, true);
                }
            }
        }
    }

    /**
     * The static class that can be used to initialize this module.
     */
    export class Startup {
        /**
         * Initializes the settings module.
         */
        static initialize(container : Node, clientSideBuffer : ClientSideBuffer) : void {
            clientSideBuffer.init();
        }

    }



    export class RemoteDatabaseInitializer implements IXMLParserCallBack {
        private mysub = null;
        private container : Node = null;
        private messageBuffer : TSettings.ClientSideBuffer = null;
        private realDBState : SettingsData.SettingsData = null;

        constructor(container : Node) {
            this.container = container;
        }

        public initialize() {
            var sm = new SettingsData.SettingsData(null, true, false);
            this.mysub = postal.channel(TSConstants.db2stChannel).subscribe(TSConstants.db2stTopic, this.dbCallBack.bind(this));
            postal.channel(TSConstants.st2dbChannel).publish(TSConstants.st2dbReadTopic,
                new SettingsRequestMessage(sm.stringifyMe(), true));
        }

        public dbCallBack(data) {
            postal.unsubscribe(this.mysub);
            var msg = SettingsData.SettingsData.parseMe(data.settings);
            this.realDBState = msg;
            this.messageBuffer = new TSettings.ClientSideBuffer(this.container);
            if (msg.getContainers() == null || msg.getContainers().length != 15) {
                this.onDBInvalid();
            } else {
                TSettings.Startup.initialize(div2, this.messageBuffer);
            }

        }

        public onDBInvalid() {
            var xmlp = new XMLParser("/src/tsnode/settings/settingsDS.xml", this.messageBuffer, this.container, this);
            xmlp.startXMLconversion();
        }

        public onXMLParsed(root : SettingsDirectory) {
            //var scs : SettingsData.SettingsContainer[] = this.messageBuffer.getBuffer().getContainers();

            var allNodes : SettingsNode[] = [];
            root.getElementsRecursively(allNodes);

            var valueNodes : SettingsNParameter[] = [];

            for (var i = 0; i < allNodes.length; i++) {
                if (allNodes[i].getType() != SettingsType.directory) {
                    valueNodes.push(<SettingsNParameter>allNodes[i]);
                }
            }

            var scs : SettingsData.SettingsContainer[] = [];
            for (var j = 0; j < valueNodes.length; j++) {
                scs.push(new SettingsData.SettingsContainer(valueNodes[j].getTopic(),
                    valueNodes[j].getValue(), valueNodes[j].getUnit()));
            }

            // Load value from XML only, if it is not already present in the database.
            // Delete all values from the database, that are not present in the XML.
            if (this.realDBState != null && this.realDBState.getContainers() != null) {
                for (var j = 0; j < scs.length; j++) {
                    for (var i = 0; i < this.realDBState.getContainers().length; i++) {
                        if (this.realDBState.getContainers()[i].getTopic() == scs[j].getTopic()) {
                            scs[j] = this.realDBState.getContainers()[i];
                        }
                    }
                }
            }

            var sm = new SettingsData.SettingsData(scs, false, false);

            postal.channel(TSConstants.st2dbChannel).publish(TSConstants.st2dbWriteTopic,
                new SettingsRequestMessage(sm.stringifyMe(), false));
            TSettings.Startup.initialize(div2, this.messageBuffer);
        }
    }

    export class TSConstants {
        public static st2dbChannel = "settingsintern_st2db";
        public static db2stChannel = "settingsintern_db2st";

        public static st2dbReadTopic= "settings.intern_st2dbRead";
        public static st2dbWriteTopic = "settings.intern_st2dbWrite";
        public static db2stTopic = "settings.intern_db2st";

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


var database = new TSettings.DummyDatabase();

var rdbi = new TSettings.RemoteDatabaseInitializer(div2);
rdbi.initialize();

var pcom : Communicator.PCommunicator = new Communicator.PCommunicator(null);
pcom.subscribe();

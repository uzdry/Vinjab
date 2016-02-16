/**
 * @author David G.
 */

///<reference path="./../messages.ts" />

module SettingsDBCOM {

    /**
     * Temporary. The highest-level-interface of this structure.
     * Structure:
     * Bus <-> DatabaseCommunicator <-> ExampleDatabaseInterface <-> LowLevelDatabaseEmulator
     */
    export class DatabaseCommunicator { // extends BusDevice
        // Yeah, I know, it could have been static...
        private dbInterface : ExampleDatabaseInterface = new ExampleDatabaseInterface();

        constructor() {
            // subscribe to Settings message Topic
        }

        public handleMessage(message : SettingsMessage) {
            var buf : SettingsMessage;
            switch (message.getTopic()) {

                case Topic.SETTINGS_MSG:
                    buf = this.dbInterface.handleSettingsMessage(message);

                    // There is no broker in this test, but you should publish the answer if it is not null...
                    //  Remember: null means: no valid answer because invalid message or simply nothing to say (e.g.: echo)...
                    /*if (buf != null) {
                     Broker.get().handle(buf);
                     }*/
                    break;

                default:
                    // ... handle any other message type and then put the results to the bus...
                    return;
            }

        }
    }

    /**
     * Temporary.
     * Emulates the LevelUP's or any other database's get/put interface.
     */
    export class LowLevelDatabaseEmulator {
        private static keys : string[] = [];
        private static values : string[] = [];

        public static clearDB() {
            this.keys = [];
            this.values = [];
        }

        public static readFullKeysOfMultipleEntries(key : string) : string[] {
            if(key[key.length - 1] != '*') {
                return null;
            }
            var answer : string[] = [];
            var trimmedKey = key.substring(0, key.length - 1);


            for (var i = 0; i < LowLevelDatabaseEmulator.keys.length; i++) {
                var res : boolean = false;
                if (LowLevelDatabaseEmulator.keys[i].length >= trimmedKey.length) {
                    res = true;
                    for (var j = 0; j < trimmedKey.length; j++) {
                        if (trimmedKey[j] != (LowLevelDatabaseEmulator.keys[i])[j]) {
                            res = false;
                            break;
                        }
                    }
                }
                if (res == true) {
                    answer.push(LowLevelDatabaseEmulator.keys[i]);
                }
            }
            if (answer.length == 0) {
                return null;
            }
            return answer;
        }
        public static readEntry(key : string) : string {
            var index : number = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index == -1) {
                return null;
            }
            return LowLevelDatabaseEmulator.values[index];
        }

        public static writeEntry(key : string, value : string) : boolean {
            var index : number = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index == -1) {
                // Does not exist, therefore can not be written.
                return false;
            }
            LowLevelDatabaseEmulator.values[index] = value;
            return true;
        }

        public static createNewEntry(key : string, value : string) : boolean {
            var index : number = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index != -1) {
                // Already in database, create operation was not successful.
                return false;
            }
            LowLevelDatabaseEmulator.keys.push(key);
            LowLevelDatabaseEmulator.values.push(value);
            return true;
        }

        public static deleteEntry(key : string) : void {
            // No need for return value, doesn't matter if not found and [does not exist] or found, deleted and [does not exist].
            var index = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index == -1) {
                return;
            }

            LowLevelDatabaseEmulator.keys.splice(index, 1);
            LowLevelDatabaseEmulator.values.splice(index, 1);
        }

        private static getIndexOfKey(key : string) : number {
            for (var i = 0; i < this.keys.length ; i++) {
                if (LowLevelDatabaseEmulator.keys[i] == key) {
                    return i;
                }
            }
            return -1;
        }
    }

    /**
     * Temporary.
     * Emulates our (Jonas's) implementation of the interface that we are using to communicate with LevelUp.
     */
    export class ExampleDatabaseInterface {
        /**
         * Handles the settings message.
         * @param message Any settings message.
         * @returns {any} Null if there is nothing to be put on the bus afterwards, a valid SettingsMessage if something should
         *  be sent back.
         */
        public handleSettingsMessage(message : SettingsMessage) : SettingsMessage {
            if (message.hasBeenHandledByDB() == true) {
                // Ignore echo.
                return null;
            }

            var containers = message.getContainers();

            if (containers == null) {
                // No topics (keys) specified.

                //  Can be used to clean up inconsistent database / XML structure, return every settings entry stored in the DB.
                return new SettingsMessage(this.getAllSettingsContainersFromDB(), true);
            }

            // else: a list of topics specified.
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].getDirection() == SettingsIODirection.read) {
                    // Read operation.
                    containers[i].setValue(this.readEntry(containers[i].getTopic()));
                } else {
                    // Write operation.
                    //  IMPORTANT : containers[i].getValue() may be NULL.
                    if (containers[i].getValue() != null) {
                        // Overwrite an existing value with a new value or create a new one.
                        this.writeOrCreateEntry(containers[i].getTopic(), containers[i].getValue());
                    } else {
                        // Overwrite an existing value with null: delete.
                        this.deleteEntry(containers[i].getTopic());
                    }
                }
            }
            message.setHandledByDBFlag();
            return message;
        }

        private deleteEntry(key : string) {
            LowLevelDatabaseEmulator.deleteEntry(key);
        }

        private writeOrCreateEntry(key : string, value : SettingsValue) : void {
            if (this.writeEntry(key, value) != true) {
                this.createNewEntry(key, value);
            }
        }

        /**
         * Writes to a database entry (Key/Value store).
         */
        private writeEntry(key : string, value : SettingsValue) : boolean {
            return LowLevelDatabaseEmulator.writeEntry(key, value.toString());
        }

        /**
         * Creates a new database entry (Key/Value store).
         */
        private createNewEntry(key : string, value : SettingsValue) : boolean {
            return LowLevelDatabaseEmulator.createNewEntry(key, value.toString());
        }


        private readEntry(key : string) : SettingsValue {
            // Instead of returning a new value, return the one from the database.
            return SettingsValue.fromString(LowLevelDatabaseEmulator.readEntry(key));
        }

        /**
         * Gets all the settings values from the database.
         * Example: returns all values with the following keys: "settings.*"
         */
        private getAllSettingsContainersFromDB() : SettingsContainer[] {
            var strbuf : string[] = LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("settings.*");

            if (strbuf == null) {
                return null;
            }

            var containerBuf : SettingsContainer[] = [];
            for (var i = 0; i < strbuf.length; i++) {
                containerBuf.push(new SettingsContainer(strbuf[i], this.readEntry(strbuf[i]),
                    SettingsIODirection.read));
            }
            return containerBuf;
        }
    }

    /**
     * Permanent.
     * The settings value (e.g. 200) / identifier (e.g. km/h, meter...) tuple.
     *  Note: Maybe it does make sense to add "extends Value", maybe not...
     */
    export class SettingsValue extends Value {

        constructor(pValue:number, pID:string) {
            super(pValue, pID);
        }

        public toString():string {
            return "SettingsValue[|" + this.value + "|" + this.identifier + "|]";
        }

        public static fromString(stringToParse : string) : SettingsValue {
            if (stringToParse == null) {
                return null;
            }
            var splitted : string[] = stringToParse.split("|");
            if (splitted.length < 3) {
                return null;
            }
            if (splitted[0] == "SettingsValue[") {
                return new SettingsValue(parseFloat(splitted[1]), splitted[2]);
            }
            return null;
        }

        public static getCountOfSplitters() : number {
            return 3;
        }

        public static getCountOfSplitSegments() : number {
            return SettingsValue.getCountOfSplitters() + 1;
        }
    }



    /**
     * Permanent.
     * The settings message.
     */
    export class SettingsMessage extends Message {
        private handledByDB : boolean;
        private containers : SettingsContainer[];

        constructor(containers : SettingsContainer[], hasBeenHandledByDB : boolean) {
            super(Topic.SETTINGS_MSG);
            this.containers = containers;
            if (containers != null && containers.length == 0) {
                this.containers = null;
            }
            this.handledByDB = hasBeenHandledByDB;
        }

        public toString() : string {
            var buf : string = "SettingsMessage[|";
            if (this.handledByDB == true) {
                buf += "true|";
            } else {
                buf += "false|";
            }
            if (this.containers != null) {
                for (var i = 0; i < this.containers.length; i++) {
                    buf += this.containers[i].toString() + "|";
                }
            } else {
                buf += "null|";
            }
            buf += "]";
            return buf;
        }

        public static fromString(stringToParse : string) : SettingsMessage {
            var splitted = stringToParse.split("|");
            var containers : SettingsContainer[] = [];
            if (splitted[0] == "SettingsMessage[") {
                for (var i = 2; i < splitted.length - SettingsContainer.getCountOfSplitSegments() + 1;
                     i += SettingsContainer.getCountOfSplitSegments()) {
                    var strconc = splitted[i];
                    for (var j = 1; j < SettingsContainer.getCountOfSplitSegments(); j++) {
                        strconc += "|" + splitted[i + j];
                    }
                    var sc = SettingsContainer.fromString(strconc);
                    if (sc == null) {
                        // Error.
                        return null;
                    }
                    containers.push(sc);
                }
            } else {
                return null;
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

    /**
     * Permament.
     * Used to encapsulate the Topic (e.g.: "settings.car.width"), the Value (e.g.: 4000) and the Direction (e.g. "read").
     */
    export class SettingsContainer {
        private topic : string;
        private value : SettingsValue;
        private direction : SettingsIODirection;

        constructor(topic : string, value : SettingsValue, direction : SettingsIODirection) {
            this.topic = topic;
            this.value = value;
            this.direction = direction;
        }

        public toString() : string {
            var dir : string = "write";
            if (this.direction == SettingsIODirection.read) {
                dir = "read";
            }
            return "SettingsContainer[|" + this.topic + "|" + this.value.toString() + "|" + dir + "|]";
        }

        public static fromString(stringToParse : string) : SettingsContainer {
            if (stringToParse == null) {
                return null;
            }
            var svSplitters = SettingsValue.getCountOfSplitters();
            var splitted = stringToParse.split("|");
            if (splitted[0] != "SettingsContainer[") {
                return null;
            } else if (splitted.length != 5 + svSplitters) {
                return null;
            } else {
                var direction;
                if (splitted[3 + svSplitters] == "read") {
                    direction = SettingsIODirection.read;
                } else if (splitted[3 + svSplitters] == "write") {
                    direction = SettingsIODirection.write;
                } else {
                    return null;
                }
                var settingsValueString : string = "";
                for (var i = 0; i < svSplitters; i++) {
                    settingsValueString += splitted[2 + i] + "|";
                }
                settingsValueString += splitted[2 + svSplitters];
                return new SettingsContainer(splitted[1], SettingsValue.fromString(settingsValueString), direction);
            }
        }

        public getTopic() : string {
            return this.topic;
        }

        public getValue() : SettingsValue {
            return this.value;
        }

        public setValue(value : SettingsValue) {
            this.value = value;
        }

        public getDirection() : SettingsIODirection {
            return this.direction;
        }

        public static getCountOfSplitSegments() : number {
            return SettingsValue.getCountOfSplitSegments() + 4;
        }
    }

    /**
     * Permament.
     * Used to specify the direction: read from database or write to database.
     */
    export enum SettingsIODirection {
        read, write
    }

}

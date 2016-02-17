/**
 * @author David G.
 */

///<reference path="./SMessage.ts" />
///<reference path="./SettingsMessageInterface.ts" />
///<reference path="./SettingsMessageClient.ts" />

module SettingsDBCOM {

    /**
     * Temporary. The highest-level-interface of this structure.
     * Structure:
     * Bus <-> DatabaseCommunicator <-> ExampleDatabaseInterface <-> LowLevelDatabaseEmulator
     */
    export class DatabaseCommunicator { // extends BusDevice
        // Yeah, I know, it could have been static...
        private dbInterface:ExampleDatabaseInterface;
        private specimenFactory : SettingsMessageInterface.ISpecimenFactory;

        constructor() {
            // subscribe to Settings message Topic
            this.specimenFactory = new SettingsMessageClient.SpecimenFactory();
            this.dbInterface = new ExampleDatabaseInterface(this.specimenFactory);
        }

        public handleMessage(message:SettingsMessageInterface.ISettingsMessage) {
            var buf:SettingsMessageInterface.ISettingsMessage;

            switch (message.getTopic()) {

                case SMessage.Topic.SETTINGS_MSG:
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
        private static keys:string[] = [];
        private static values:string[] = [];

        public static clearDB() {
            this.keys = [];
            this.values = [];
        }

        public static readFullKeysOfMultipleEntries(key:string):string[] {
            if (key[key.length - 1] != '*') {
                return null;
            }
            var answer:string[] = [];
            var trimmedKey = key.substring(0, key.length - 1);


            for (var i = 0; i < LowLevelDatabaseEmulator.keys.length; i++) {
                var res:boolean = false;
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

        public static readEntry(key:string):string {
            var index:number = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index == -1) {
                return null;
            }
            return LowLevelDatabaseEmulator.values[index];
        }

        public static writeEntry(key:string, value:string):boolean {
            var index:number = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index == -1) {
                // Does not exist, therefore can not be written.
                return false;
            }
            LowLevelDatabaseEmulator.values[index] = value;
            return true;
        }

        public static createNewEntry(key:string, value:string):boolean {
            var index:number = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index != -1) {
                // Already in database, create operation was not successful.
                return false;
            }
            LowLevelDatabaseEmulator.keys.push(key);
            LowLevelDatabaseEmulator.values.push(value);
            return true;
        }

        public static deleteEntry(key:string):void {
            // No need for return value, doesn't matter if not found and [does not exist] or found, deleted and [does not exist].
            var index = LowLevelDatabaseEmulator.getIndexOfKey(key);
            if (index == -1) {
                return;
            }

            LowLevelDatabaseEmulator.keys.splice(index, 1);
            LowLevelDatabaseEmulator.values.splice(index, 1);
        }

        private static getIndexOfKey(key:string):number {
            for (var i = 0; i < this.keys.length; i++) {
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
        private specimenFactory : SettingsMessageInterface.ISpecimenFactory;
        constructor(specimenFactory : SettingsMessageInterface.ISpecimenFactory) {
            this.specimenFactory = specimenFactory;
        }

        /**
         * Handles the settings message.
         * @param message Any settings message.
         * @returns {any} Null if there is nothing to be put on the bus afterwards, a valid SettingsMessage if something should
         *  be sent back.
         */
        public handleSettingsMessage(message:SettingsMessageInterface.ISettingsMessage):SettingsMessageInterface.ISettingsMessage {
            if (message.hasBeenHandledByDB() == true) {
                // Ignore echo.
                return null;
            }

            var containers = message.getContainers();

            if (containers == null) {
                // No topics (keys) specified.

                //  Can be used to clean up inconsistent database / XML structure, return every settings entry stored in the DB.

                return this.specimenFactory.getMessageSpecimen().createMe(this.getAllSettingsContainersFromDB(), true);
            }

            // else: a list of topics specified.
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].getDirection() == SettingsMessageCommon.SettingsIODirection.read) {
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

        private deleteEntry(key:string) {
            LowLevelDatabaseEmulator.deleteEntry(key);
        }

        private writeOrCreateEntry(key:string, value:SettingsMessageInterface.ISettingsValue):void {
            if (this.writeEntry(key, value) != true) {
                this.createNewEntry(key, value);
            }
        }

        /**
         * Writes to a database entry (Key/Value store).
         */
        private writeEntry(key:string, value:SettingsMessageInterface.ISettingsValue):boolean {
            return LowLevelDatabaseEmulator.writeEntry(key, SettingsMessageCommon.SettingsValue.stringifyValue(value));
        }

        /**
         * Creates a new database entry (Key/Value store).
         */
        private createNewEntry(key:string, value:SettingsMessageInterface.ISettingsValue):boolean {
            return LowLevelDatabaseEmulator.createNewEntry(key, SettingsMessageCommon.SettingsValue.stringifyValue(value));
        }


        private readEntry(key:string):SettingsMessageInterface.ISettingsValue {
            // Instead of returning a new value, return the one from the database.

            return SettingsMessageCommon.SettingsValue.fromString(LowLevelDatabaseEmulator.readEntry(key),
                this.specimenFactory.getValueSpecimen().createMe(0, null));
        }

        /**
         * Gets all the settings values from the database.
         * Example: returns all values with the following keys: "settings.*"
         */
        private getAllSettingsContainersFromDB():SettingsMessageInterface.ISettingsContainer[] {
            var strbuf:string[] = LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("settings.*");

            if (strbuf == null) {
                return null;
            }

            var containerBuf:SettingsMessageInterface.ISettingsContainer[] = [];
            for (var i = 0; i < strbuf.length; i++) {
                containerBuf.push(new SettingsMessageCommon.SettingsContainer(strbuf[i], this.readEntry(strbuf[i]),
                    SettingsMessageCommon.SettingsIODirection.read));
            }
            return containerBuf;
        }
    }
}

/**
 * @author David G.
 */

/**
 * Settings unified Database communication module.
  */

class SettingsValue {
    private value:number;
    private identifier:string;

    constructor(pValue:number, pID:string) {
        this.value = pValue;
        this.identifier = pID;
    }

    public toString():string {
        return "SettingsValue[|" + this.value + "|" + this.identifier + "|]";
    }

    public static fromString(stringToParse : string) : SettingsValue {
        var splitted : string[] = stringToParse.split("|");
        if (splitted[0] == "SettingsValue[") {
            return new SettingsValue(parseInt(splitted[1]), splitted[2]);
        }
        return null;
    }

    public numericalValue():number {
        return this.value;
    }

    public getIdentifier():string {
        return this.identifier;
    }
}
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
            var valueInDB : SettingsValue = this.readEntry(containers[i].getTopic());

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
    private writeEntry(key : string, value : SettingsValue) {
        var stringified = value.toString();
        return;
    }

    /**
     * Creates a new database entry (Key/Value store).
     */
    private createNewEntry(key : string, value : SettingsValue) {

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
    private readEntry(key : string) : SettingsValue {
        // Instead of returning a new value, return the one from the database.
        if (true) {
            // Key exists in DB and the entry stored under key is a Value object.
            var stringReadFromDB : string = "SettingsValue[|0|Name|]";
            return SettingsValue.fromString(stringReadFromDB);
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
            return new SettingsContainer(splitted[1], SettingsValue.fromString(splitted[2]), direction);
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
}

enum SettingsIODirection {
    read, write
}

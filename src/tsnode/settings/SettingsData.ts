
/**
 * Created by VJTemp on 20.02.2016.
 */

module SettingsData {

    export class SettingsData {
        private directionIsFromDB : boolean;
        private ioIsRead : boolean;
        private containers:SettingsContainer[];

        constructor(containers:SettingsContainer[], ioIsRead : boolean, directionIsFromDB : boolean) {
            this.containers = containers;
            this.ioIsRead = ioIsRead;
            this.directionIsFromDB = directionIsFromDB;
        }

        getContainers() : SettingsContainer[] {
            return this.containers;
        }

        getValueOf(topic : string) : SettingsContainer {
            var buf = this.getIndexOfContainer(topic);
            if (buf == -1) {
                return null;
            }
            return this.containers[buf];
        }

        setValueOf(settingsContainer : SettingsContainer) : boolean {
            var buf = this.getIndexOfContainer(settingsContainer.getTopic());
            if (buf == -1) {
                return false;
            }
            this.containers[buf] = settingsContainer;
            return true;
        }

        private getIndexOfContainer(topic : string) : number {
            for (var i = 0; i < this.containers.length; i++) {
                if (this.containers[i].getTopic() == topic) {
                    return i;
                }
            }
            return -1;
        }

        isIORead() : boolean {
            return this.ioIsRead;
        }

        isDirectionFromDB() : boolean {
            return this.directionIsFromDB;
        }

        stringifyMe() : string {
            var buf = "SettingsData[|";

            if (this.isIORead()) {
                buf += "read|";
            } else {
                buf += "write|";
            }

            if (this.isDirectionFromDB()) {
                buf += "fromDB|";
            } else {
                buf += "toDB|";
            }

            for (var i = 0; i < this.containers.length; i++) {
                buf += this.containers[i].stringifyMe() + "|";
            }
            buf += "]";
            return buf;
        }

        static parseMe(input : string) {
            var splitted = input.split("|");
            if (splitted[0] != "SettingsData[") {
                return null;
            }
            /*if (splitted.length - 2 < SettingsContainer.getCountOfSplitSegments()) {
                return null;
            }*/

            var io;
            if (splitted[1] == "read") {
                io = true;
            } else if (splitted[1] == "write") {
                io = false;
            } else {
                return null;
            }

            var direction;
            if (splitted[2] == "fromDB") {
                direction = true;
            } else if (splitted[2] == "toDB") {
                direction = false;
            } else {
                return null;
            }

            var contArray : SettingsContainer[] = [];
            for (var i = 3; i < splitted.length - SettingsContainer.getCountOfSplitSegments() + 1;
                 i += SettingsContainer.getCountOfSplitSegments()) {
                var buf = SettingsContainer.parseMe(input, i);
                if (buf == null) {
                    return null;
                }
                contArray.push(buf);
            }
            return new SettingsData(contArray, io, direction);
        }
    }

    export class SettingsContainer {
        private topic : string;
        private value : number;
        private description : string;

        constructor(topic : string, value : number, description : string) {
            this.topic = topic;
            this.value = value;
            this.description = description;
        }

        cloneMe() : SettingsContainer {
            var newTopic = "";
            for (var i = 0; i < this.topic.length; i++) {
                newTopic += this.topic[i];
            }

            var newValue = 0;
            newValue = this.value;

            var newDescription = "";
            for (var i = 0; i < this.description.length; i++) {
                newDescription += this.description[i];
            }
            return new SettingsContainer(newTopic, newValue, newDescription);
        }

        getTopic() : string {
            return this.topic;
        }

        getValue() : number {
            return this.value;
        }

        getDescription() : string {
            return this.description;
        }

        stringifyMe() : string {
            return "SettingsContainer[|" + this.getTopic() + "|" + this.getValue() + "|" + this.getDescription() + "|]";
        }

        static getCountOfSplitSegments() : number {
            return 5;
        }

        static parseMe(input : string, index : number) : SettingsContainer {
            var splitted = input.split("|");
            if (splitted[index] != "SettingsContainer[") {
                return null;
            }
            if (splitted.length < 5) {
                return null;
            }

            var topic : string = splitted[index + 1];
            var value : number = parseFloat(splitted[index + 2]);
            var description : string = splitted[index + 3];

            return new SettingsContainer(topic, value, description);
        }
    }
}

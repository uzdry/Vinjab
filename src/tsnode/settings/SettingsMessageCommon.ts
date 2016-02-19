/**
 * @author David G.
 */

/// <reference path="./SettingsMessageInterface.ts"/>

module SettingsMessageCommon {



    export class SettingsValue {
        public static getCountOfSplitters() : number {
            return 3;
        }

        public static getCountOfSplitSegments() : number {
            return SettingsValue.getCountOfSplitters() + 1;
        }

        public static fromString(stringToParse : string, target : SettingsMessageInterface.ISettingsValue)
            : SettingsMessageInterface.ISettingsValue {

            if (stringToParse == null) {
                return null;
            }
            var splitted : string[] = stringToParse.split("|");
            if (splitted.length < 3) {
                return null;
            }
            if (splitted[0] == "SettingsValue[") {
                return target.createMe(parseFloat(splitted[1]), splitted[2]);
            }
            return null;
        }

        public static stringifyValue(iValue : SettingsMessageInterface.ISettingsValue) {
            return "SettingsValue[|" + iValue.numericalValue() + "|" + iValue.getIdentifier() + "|]";
        }
    }

    export class SettingsContainer {
        private topic : string;
        private iValue : SettingsMessageInterface.ISettingsValue;
        private directionIsRead : boolean;


        constructor(topic : string, iValue : SettingsMessageInterface.ISettingsValue, directionIsRead : boolean) {

            this.topic = topic;
            this.iValue = iValue;
            this.directionIsRead = directionIsRead;
        }

        public static getCountOfSplitSegments() : number {
            return SettingsMessageCommon.SettingsValue.getCountOfSplitSegments() + 4;
        }

        public static stringifyContainer(iContainer : SettingsMessageInterface.ISettingsContainer) {

                var dir : string = "write";
                if (iContainer.myDirectionIsRead() == true) {
                    dir = "read";
                }
                return "SettingsContainer[|" + iContainer.getTopic() + "|"
                    + SettingsMessageCommon.SettingsValue.stringifyValue(iContainer.getValue()) + "|" + dir + "|]";

        }

        public getTopic() : string {
            return this.topic;
        }

        public getValue() : SettingsMessageInterface.ISettingsValue {
            return this.iValue;
        }

        public setValue(value : SettingsMessageInterface.ISettingsValue) {
            this.iValue = value;
        }

        public myDirectionIsRead() : boolean {
            return this.directionIsRead;
        }

        public static fromString(stringToParse : string,
            specimenFactory : SettingsMessageInterface.ISpecimenFactory) : SettingsMessageInterface.ISettingsContainer {
            if (stringToParse == null) {
                return null;
            }
            var svSplitters = SettingsMessageCommon.SettingsValue.getCountOfSplitters();
            var splitted = stringToParse.split("|");
            if (splitted[0] != "SettingsContainer[") {
                return null;
            } else if (splitted.length != 5 + svSplitters) {
                return null;
            } else {
                var direction;
                if (splitted[3 + svSplitters] == "read") {
                    direction = true;
                } else if (splitted[3 + svSplitters] == "write") {
                    direction = false;
                } else {
                    return null;
                }
                var settingsValueString:string = "";
                for (var i = 0; i < svSplitters; i++) {
                    settingsValueString += splitted[2 + i] + "|";
                }
                settingsValueString += splitted[2 + svSplitters];

                return new SettingsMessageCommon.SettingsContainer(splitted[1],
                    SettingsMessageCommon.SettingsValue.fromString(settingsValueString,
                        specimenFactory.getValueSpecimen().createMe(0, null)), direction);
            }
        }
    }

    export class SettingsMessage extends SMessage.Message {

        public stringifyMessage(message : SettingsMessageInterface.ISettingsMessage) : string {
            var buf : string = "SettingsMessage[|";
            if (message.hasBeenHandledByDB() == true) {
                buf += "true|";
            } else {
                buf += "false|";
            }
            if (message.getContainer != null) {
                    buf += SettingsMessageCommon.SettingsContainer.stringifyContainer(message.getContainer()) + "|";

            } else {
                buf += "null|";
            }
            buf += "]";
            return buf;
        }

        public static fromString(stringToParse : string, specimenFactory : SettingsMessageInterface.ISpecimenFactory)
            : SettingsMessageInterface.ISettingsMessage {
            var splitted = stringToParse.split("|");
            var container : SettingsMessageInterface.ISettingsContainer = null;
            if (splitted[0] == "SettingsMessage[") {
                for (var i = 2; i < splitted.length - SettingsMessageCommon.SettingsContainer.getCountOfSplitSegments() + 1;
                     i += SettingsMessageCommon.SettingsContainer.getCountOfSplitSegments()) {
                    var strconc = splitted[i];
                    for (var j = 1; j < SettingsMessageCommon.SettingsContainer.getCountOfSplitSegments(); j++) {
                        strconc += "|" + splitted[i + j];
                    }
                    var sc = SettingsMessageCommon.SettingsContainer.fromString(strconc, specimenFactory);
                    if (sc == null) {
                        // Error.
                        return null;
                    }
                    container = sc;
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
            return specimenFactory.getMessageSpecimen().createMe(container, alreadyHandled);
        }

    }
}

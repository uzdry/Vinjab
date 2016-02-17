/**
 * @author David G.
 */

/// <reference path="./SettingsMessageInterface.ts"/>
/// <reference path="./SettingsMessageCommon.ts"/>
/// <reference path="./../messages.ts"/>

import {Value} from "../messages";
import {Message} from "../messages";

module SettingsMessageServer{
    export class SpecimenFactory implements SettingsMessageInterface.ISpecimenFactory {
        private iValue = new SettingsValue(0, null);
        private iMessage = new SettingsMessage(null, false);

        getValueSpecimen() : SettingsMessageInterface.ISettingsValue {
            return this.iValue;
        }
        getMessageSpecimen() : SettingsMessageInterface.ISettingsMessage {
            return this.iMessage;
        }
    }
    /**
     * Permanent.
     * The settings value (e.g. 200) / identifier (e.g. km/h, meter...) tuple.
     *  Note: Maybe it does make sense to add "extends Value", maybe not...
     */
    export class SettingsValue extends Value implements SettingsMessageInterface.ISettingsValue {
        public createMe(pValue:number, pID:string) {
            return new SettingsValue(pValue, pID);
        }

        public fromString(stringToParse : string) : SettingsMessageInterface.ISettingsValue {
            return SettingsMessageCommon.SettingsValue.fromString(stringToParse, new SettingsValue(0, null));
        }
    }

    export class SettingsMessage extends Message {
        private handledByDB : boolean;
        private containers : SettingsMessageInterface.ISettingsContainer[];

        constructor(containers : SettingsMessageInterface.ISettingsContainer[], hasBeenHandledByDB : boolean) {
            super(SMessage.Topic.SETTINGS_MSG);

            this.containers = containers;
            if (containers != null && containers.length == 0) {
                this.containers = null;
            }
            this.handledByDB = hasBeenHandledByDB;
        }

        public createMe(containers : SettingsMessageInterface.ISettingsContainer[], hasBeenHandledByDB : boolean) {
            return new SettingsMessage(containers, hasBeenHandledByDB);
        }

        public getContainers() : SettingsMessageInterface.ISettingsContainer[] {
            return this.containers;
        }

        public hasBeenHandledByDB() : boolean {
            return this.handledByDB;
        }

        public setHandledByDBFlag() {
            this.handledByDB = true;
        }
    }
}

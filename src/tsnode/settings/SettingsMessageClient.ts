/**
 * @author David G.
 */

/// <reference path="./SMessage.ts"/>
/// <reference path="./SettingsMessageInterface.ts"/>
/// <reference path="./SettingsMessageCommon.ts"/>

module SettingsMessageClient{
    export class STopic extends SMessage.Topic {

    }

    export class SValue extends SMessage.Value {

    }

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
    export class SettingsValue extends SValue implements SettingsMessageInterface.ISettingsValue {
        public createMe(pValue:number, pID:string) {
            return new SettingsValue(pValue, pID);
        }

        public fromString(stringToParse : string) : SettingsMessageInterface.ISettingsValue {
            return SettingsMessageCommon.SettingsValue.fromString(stringToParse, new SettingsValue(0, null));
        }
    }

    export class SettingsMessage extends SettingsMessageCommon.SettingsMessage {
        private handledByDB : boolean;
        private container : SettingsMessageInterface.ISettingsContainer;

        constructor(container : SettingsMessageInterface.ISettingsContainer, hasBeenHandledByDB : boolean) {
            super(SMessage.Topic.SETTINGS_MSG);

            this.container = container;
            this.handledByDB = hasBeenHandledByDB;
        }

        public createMe(container : SettingsMessageInterface.ISettingsContainer, hasBeenHandledByDB : boolean) {
            return new SettingsMessage(container, hasBeenHandledByDB);
        }

        public getContainer() : SettingsMessageInterface.ISettingsContainer {
            return this.container;
        }

        public hasBeenHandledByDB() : boolean {
            return this.handledByDB;
        }

        public setHandledByDBFlag() {
            this.handledByDB = true;
        }
    }
}

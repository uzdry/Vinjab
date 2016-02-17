/**
 * @author David G.
 */

/// <reference path="./SMessage.ts"/>
/// <reference path="./SettingsDBCOM.ts"/>

module SettingsMessageInterface {
    export interface ISettingsMessage {
        getTopic() : SMessage.Topic;
        hasBeenHandledByDB() : boolean;
        getContainers() : ISettingsContainer[];
        setHandledByDBFlag() : void;
        createMe(containers : SettingsMessageInterface.ISettingsContainer[], hasBeenHandledByDB : boolean) : ISettingsMessage;
    }

    export interface ISettingsContainer {
        getDirection() : SettingsMessageCommon.SettingsIODirection;
        setValue(value : SettingsMessageInterface.ISettingsValue) : void;
        getValue() : SettingsMessageInterface.ISettingsValue;
        getTopic() : string;
    }

    export interface ISettingsValue {
        createMe(pValue:number, pID: string) : ISettingsValue;
        numericalValue() : number;
        getIdentifier(): string;
        fromString(stringToParse : string) : ISettingsValue;
    }

    export interface ISpecimenFactory {
        getValueSpecimen() : ISettingsValue;
        getMessageSpecimen() : ISettingsMessage;
    }
}

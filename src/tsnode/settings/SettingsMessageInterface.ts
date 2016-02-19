/**
 * @author David G.
 */

/// <reference path="./SMessage.ts"/>
/// <reference path="./SettingsDBCOM.ts"/>

module SettingsMessageInterface {
    export interface ISettingsMessage {
        getTopic() : SMessage.Topic;
        hasBeenHandledByDB() : boolean;
        getContainer() : ISettingsContainer;
        setHandledByDBFlag() : void;
        createMe(container : SettingsMessageInterface.ISettingsContainer, hasBeenHandledByDB : boolean) : ISettingsMessage;
    }

    export interface ISettingsContainer {
        myDirectionIsRead() : boolean;
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

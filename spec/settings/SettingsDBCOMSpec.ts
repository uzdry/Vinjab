import LowLevelDatabaseEmulator = SettingsDBCOM.LowLevelDatabaseEmulator;
/**
 * @author David G.
 */

///<reference path="./../../src/tsnode/settings/SettingsDBCOM.ts"/>
///<reference path="../typings/jasmine/jasmine.d.ts"/>

describe("SettingsDBCOM", function () {
    it("SettingsValue - Tests the SettingsValue constructor", function () {
        var value : number = 50.7;
        var name : string = "testNameOfSettings";
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(value, name);

        expect(sv.numericalValue()).toEqual(value);
        expect(sv.getIdentifier()).toEqual(name);
    });

    it("SettingsValue - Tests the SettingsValue string2 function", function () {
        var value : number = 41.73;
        var name : string = "myNameOfThisSettingsValue";
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(value, name);

        expect(sv.toString()).toEqual("SettingsValue[|41.73|myNameOfThisSettingsValue|]");
    });

    it("SettingsValue - Tests the SettingsValue fromString function", function () {
        var value : number = -28.1;
        var name : string = "testName";
        var stringified : string = "SettingsValue[|-28.1|testName|]";
        var sv : SettingsDBCOM.SettingsValue = SettingsDBCOM.SettingsValue.fromString(stringified);

        expect(sv.toString()).toEqual(stringified);
        expect(sv.numericalValue()).toEqual(value);
        expect(sv.getIdentifier()).toEqual(name);
    });

    it("SettingsValue - Tests the SettingsValue fromString function", function () {
        var stringified : string = "HelloWorld";
        var sv : SettingsDBCOM.SettingsValue = SettingsDBCOM.SettingsValue.fromString(stringified);

        expect(sv).toEqual(null);
    });

    it("SettingsValue - Tests the SettingsValue fromString function", function () {
        var stringified : string = null;
        var sv : SettingsDBCOM.SettingsValue = SettingsDBCOM.SettingsValue.fromString(stringified);

        expect(sv).toEqual(null);
    });

    it("SettingsValue - Tests the SettingsValue fromString function", function () {
        var value : number = -2.7;
        var name : string = "myName";
        var stringified : string = "SettingsValue[|-2.7|myName|]";
        var sv : SettingsDBCOM.SettingsValue = SettingsDBCOM.SettingsValue.fromString(stringified);

        expect(sv.getIdentifier()).toEqual(name);
        expect(sv.numericalValue()).toEqual(value);
    });

    it("SettingsValue - Tests the SettingsValue fromString function", function () {
        var value : number = -2.3;
        var name : string = "myTestName";
        var stringified : string = "SettingsValue[|-2.3|myTestName|]SomethingElseComingAfter";
        var sv : SettingsDBCOM.SettingsValue = SettingsDBCOM.SettingsValue.fromString(stringified);

        expect(sv.getIdentifier()).toEqual(name);
        expect(sv.numericalValue()).toEqual(value);
    });

    it("SettingsValue - Tests the SettingsValue fromString function", function () {
        var stringified : string = "SomethingElseComingBefore|SettingsValue[|-2.3|myTestName|]";
        var sv : SettingsDBCOM.SettingsValue = SettingsDBCOM.SettingsValue.fromString(stringified);

        expect(sv).toEqual(null);
    });

    it("SettingsContainer - Tests the SettingsContainer constructor and the get methods", function () {
        var topic : string = "settings.test";
        var numValue : number = 1.4;
        var valName : string = "nameOfValue";
        var direction : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.read;
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(numValue, valName);
        var sc : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic, sv, direction);

        expect(sc.getDirection()).toEqual(direction);
        expect(sc.getTopic()).toEqual(topic);
        expect(sc.getValue()).toEqual(sv);
        expect(sc.getValue().getIdentifier()).toEqual(valName);
        expect(sc.getValue().numericalValue()).toEqual(numValue);
    });

    it("SettingsContainer - Tests the SettingsContainer constructor, the get methods and the set method", function () {
        var topic : string = "settings.mytest";
        var numValue : number = -0.1;
        var valName : string = "testname";
        var direction : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.write;
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(numValue, valName);
        var sc : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic, sv, direction);

        expect(sc.getDirection()).toEqual(direction);
        expect(sc.getTopic()).toEqual(topic);
        expect(sc.getValue()).toEqual(sv);
        expect(sc.getValue().getIdentifier()).toEqual(valName);
        expect(sc.getValue().numericalValue()).toEqual(numValue);

        var newNumValue : number = 1.7;
        var newValName : string = "newname";
        var newValue : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(newNumValue, newValName);

        sc.setValue(newValue);

        expect(sc.getValue()).toEqual(newValue);
        expect(sc.getValue().getIdentifier()).toEqual(newValName);
        expect(sc.getValue().numericalValue()).toEqual(newNumValue);
    });

    it("SettingsContainer - Tests the SettingsContainer string2 method", function () {
        var topic : string = "setting.myTest";
        var numValue : number = -0.7;
        var valName : string = "testName";
        var direction : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.read;
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(numValue, valName);
        var sc : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic, sv, direction);

        expect(sc.toString()).toEqual("SettingsContainer[|setting.myTest|"
            + sv.toString() + "|read|]");
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var topic : string = "settings.Test";
        var numValue : number = 113.53;
        var valName : string = "name";
        var direction : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.write;
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(numValue, valName);
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(
            "SettingsContainer[|" + topic + "|" + sv.toString() + "|write|]");

        expect(sc.toString()).toEqual("SettingsContainer[|" + topic + "|"
            + sv.toString() + "|write|]");
        expect(sc.getDirection()).toEqual(direction);
        expect(sc.getTopic()).toEqual(topic);
        expect(sc.getValue()).toEqual(sv);
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var topic : string = "settings.Testname";
        var numValue : number = 71.89;
        var valName : string = "tname";
        var direction : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.read;
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(numValue, valName);
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(
            "SettingsContainer[|" + topic + "|" + sv.toString() + "|read|]");

        expect(sc.toString()).toEqual("SettingsContainer[|" + topic + "|"
            + sv.toString() + "|read|]");
        expect(sc.getDirection()).toEqual(direction);
        expect(sc.getTopic()).toEqual(topic);
        expect(sc.getValue()).toEqual(sv);
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(null);
        expect(sc).toEqual(null);
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(
            "SettingsContainer[|126|SettintransmissionError...");
        expect(sc).toEqual(null);
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(17, "name");
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(
            "SettingsContainer[|126|" + sv.toString() + "|read|]|SomethingElse");
        expect(sc).toEqual(null);
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(17, "name");
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(
            "SettingsCoooooontainer[|126|" + sv.toString() + "|read|]");
        expect(sc).toEqual(null);
    });

    it("SettingsContainer - Tests the SettingsContainer fromString method", function () {
        var sv : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(17, "name");
        var sc : SettingsDBCOM.SettingsContainer = SettingsDBCOM.SettingsContainer.fromString(
            "SettingsContainer[|126|" + sv.toString() + "|check|]");
        expect(sc).toEqual(null);
    });

    it("SettingsMessage - Tests the SettingsMessage constructor and the get methods", function() {
        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(1, "name1");
        var sv2 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(2, "name2");

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "topic1", sv1, SettingsDBCOM.SettingsIODirection.read);
        var sc2 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "topic2", sv2, SettingsDBCOM.SettingsIODirection.write);

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc1, sc2], false);

        expect(sm.getContainers().length).toEqual(2);
        expect(sm.getContainers()[0]).toEqual(sc1);
        expect(sm.getContainers()[1]).toEqual(sc2);
        expect(sm.hasBeenHandledByDB()).toEqual(false);
        expect(sm.getTopic()).toEqual(Topic.SETTINGS_MSG);
    });

    it("SettingsMessage - Tests the SettingsMessage constructor and the get methods", function() {
        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage(null, true);

        expect(sm.getContainers()).toEqual(null);
        expect(sm.hasBeenHandledByDB()).toEqual(true);
        expect(sm.getTopic()).toEqual(Topic.SETTINGS_MSG);
    });

    it("SettingsMessage - Tests the SettingsMessage constructor and the get methods", function() {
        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([], false);

        expect(sm.getContainers()).toEqual(null);
        expect(sm.hasBeenHandledByDB()).toEqual(false);
        expect(sm.getTopic()).toEqual(Topic.SETTINGS_MSG);
    });

    it("SettingsMessage - Tests the SettingsMessage setHandledByDBFlag function", function() {
        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(1, "name1");

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "topic1", sv1, SettingsDBCOM.SettingsIODirection.read);

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc1], false);

        expect(sm.getContainers().length).toEqual(1);
        expect(sm.getContainers()[0]).toEqual(sc1);
        expect(sm.hasBeenHandledByDB()).toEqual(false);

        sm.setHandledByDBFlag();

        expect(sm.hasBeenHandledByDB()).toEqual(true);
    });

    it("SettingsMessage - Tests the SettingsMessage string2 function", function() {
        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(1, "name1");

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "topic1", sv1, SettingsDBCOM.SettingsIODirection.read);

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc1], false);

        expect(sm.toString()).toEqual("SettingsMessage[|false|" + sc1.toString() + "|]");
    });

    it("SettingsMessage - Tests the SettingsMessage string2 function", function() {
        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(1, "myName1");
        var sv2 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(2, "myName2");

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "myTopic1", sv1, SettingsDBCOM.SettingsIODirection.read);
        var sc2 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "myTopic2", sv2, SettingsDBCOM.SettingsIODirection.write);

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc1, sc2], false);

        expect(sm.toString()).toEqual("SettingsMessage[|false|" + sc1.toString() + "|" + sc2.toString() + "|]");
    });

    it("SettingsMessage - Tests the SettingsMessage string2 function", function() {
        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage(null, true);

        expect(sm.toString()).toEqual("SettingsMessage[|true|null|]");
    });

    it("SettingsMessage - Tests the SettingsMessage fromString function", function() {
        var val1 : number = 5.2;
        var name1 : string = "valName";

        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(val1, name1);
        var topic : string = "topic1";
        var rw : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.read;

        var sc : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic, sv1, rw);
        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc], true);

        var stringified : string = sm.toString();
        expect(stringified).toEqual("SettingsMessage[|true|" + sc.toString() + "|]");

        var smFromString : SettingsDBCOM.SettingsMessage = SettingsDBCOM.SettingsMessage.fromString(stringified);
        expect(smFromString.toString()).toEqual(stringified);
        expect(smFromString.getContainers().length).toEqual(1);
        expect(smFromString.getContainers()[0].myDirectionIsRead()).toEqual(rw);
        expect(smFromString.getContainers()[0].getTopic()).toEqual(topic);
        expect(smFromString.getContainers()[0].getValue()).toEqual(sv1);
    });

    it("SettingsMessage - Tests the SettingsMessage fromString function", function() {
        var val1 : number = -7.1;
        var name1 : string = "valName1";

        var val2 : number = -2.8;
        var name2 : string = "valName2";

        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(val1, name1);
        var sv2 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(val2, name2);

        var topic1 : string = "topic1";
        var topic2 : string = "topic2";
        var rw1 : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.read;
        var rw2 : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.write;

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic1, sv1, rw1);
        var sc2 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic2, sv2, rw2);

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc1, sc2], false);

        var stringified : string = sm.toString();
        expect(stringified).toEqual("SettingsMessage[|false|" + sc1.toString() + "|" + sc2.toString() + "|]");

        var smFromString : SettingsDBCOM.SettingsMessage = SettingsDBCOM.SettingsMessage.fromString(stringified);
        expect(smFromString.toString()).toEqual(stringified);
        expect(smFromString.hasBeenHandledByDB()).toEqual(false);
        expect(smFromString.getContainers().length).toEqual(2);
        expect(smFromString.getContainers()[0].myDirectionIsRead()).toEqual(rw1);
        expect(smFromString.getContainers()[0].getTopic()).toEqual(topic1);
        expect(smFromString.getContainers()[0].getValue()).toEqual(sv1);
        expect(smFromString.getContainers()[1].myDirectionIsRead()).toEqual(rw2);
        expect(smFromString.getContainers()[1].getTopic()).toEqual(topic2);
        expect(smFromString.getContainers()[1].getValue()).toEqual(sv2);
    });

    it("SettingsMessage - Tests the SettingsMessage fromString function", function() {
        var val1 : number = -7.1;
        var name1 : string = "valName1";
        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(val1, name1);

        var topic1 : string = "topic1";
        var rw1 : SettingsDBCOM.SettingsIODirection = SettingsDBCOM.SettingsIODirection.read;

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(topic1, sv1, rw1);

        var stringified : string = "SettingsMessage[|true|" + "ERR" + sc1.toString() + "|]";

        var sm : SettingsDBCOM.SettingsMessage = SettingsDBCOM.SettingsMessage.fromString(stringified);

        expect(sm).toEqual(null);

    });

    it("SettingsMessage - Tests the SettingsMessage fromString function", function() {
        var stringified : string = "SettingsMSG[|true|null|]";

        var sm : SettingsDBCOM.SettingsMessage = SettingsDBCOM.SettingsMessage.fromString(stringified);

        expect(sm).toEqual(null);
    });

    it("SettingsMessage - Tests the SettingsMessage fromString function", function() {
        var stringified : string = "SettingsMessage[|yes|null|]";

        var sm : SettingsDBCOM.SettingsMessage = SettingsDBCOM.SettingsMessage.fromString(stringified);

        expect(sm).toEqual(null);
    });

    it("SettingsMessage - Tests the SettingsMessage fromString function", function() {

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage(null, true);

        var stringified : string = sm.toString();
        expect(stringified).toEqual("SettingsMessage[|true|null|]");

        var smFromString : SettingsDBCOM.SettingsMessage = SettingsDBCOM.SettingsMessage.fromString(stringified);
        expect(smFromString.toString()).toEqual(stringified);
        expect(smFromString.getContainers()).toEqual(null);
    });

    it("DEBUG ONLY - LowLevelDatabaseEmulator test", function() {
        // Constructor dummy test
        var testll : SettingsDBCOM.LowLevelDatabaseEmulator = new SettingsDBCOM.LowLevelDatabaseEmulator();

        var buf : string = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test");
        expect(buf).toEqual(null);

        var flag : boolean = SettingsDBCOM.LowLevelDatabaseEmulator.createNewEntry("test", "value1");
        expect(flag).toEqual(true);
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test");
        expect(buf).toEqual("value1");

        var flag : boolean = SettingsDBCOM.LowLevelDatabaseEmulator.createNewEntry("test", "value1");
        expect(flag).toEqual(false);
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test");
        expect(buf).toEqual("value1");


        var flag : boolean = SettingsDBCOM.LowLevelDatabaseEmulator.createNewEntry("test2", "value2");
        expect(flag).toEqual(true);
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test2");
        expect(buf).toEqual("value2");


        var flag : boolean = SettingsDBCOM.LowLevelDatabaseEmulator.createNewEntry("test2", "value2");
        expect(flag).toEqual(false);
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test2");
        expect(buf).toEqual("value2");


        var flag : boolean = SettingsDBCOM.LowLevelDatabaseEmulator.writeEntry("test2", "valueX");
        expect(flag).toEqual(true);
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test2");
        expect(buf).toEqual("valueX");

        var flag : boolean = SettingsDBCOM.LowLevelDatabaseEmulator.writeEntry("test5", "valueX");
        expect(flag).toEqual(false);
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test5");
        expect(buf).toEqual(null);


        SettingsDBCOM.LowLevelDatabaseEmulator.deleteEntry("test5");
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test5");
        expect(buf).toEqual(null);


        SettingsDBCOM.LowLevelDatabaseEmulator.deleteEntry("test2");
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test2");
        expect(buf).toEqual(null);

        SettingsDBCOM.LowLevelDatabaseEmulator.createNewEntry("test6", "value6");
        buf = SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("test6");
        expect(buf).toEqual("value6");

        var answers : string[]  = SettingsDBCOM.LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("test");
        expect(answers).toEqual(null);

        answers = SettingsDBCOM.LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("tes*");
        expect(answers.length).toEqual(2);
        if (answers[0] == "test") {
            expect(answers[0]).toEqual("test");
            expect(answers[1]).toEqual("test6");
        } else {
            expect(answers[1]).toEqual("test");
            expect(answers[0]).toEqual("test6");
        }


        answers = SettingsDBCOM.LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("test6*");
        expect(answers.length).toEqual(1);
        expect(answers[0]).toEqual("test6");

        answers = SettingsDBCOM.LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("test67*");
        expect(answers).toEqual(null);

        answers = SettingsDBCOM.LowLevelDatabaseEmulator.readFullKeysOfMultipleEntries("sth*");
        expect(answers).toEqual(null);

    })

    it("DEBUG ONLY - ExampleDatabaseInterface test", function() {
        var sv1 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(1, "myName1");

        // Initialize LevelUP database
        SettingsDBCOM.LowLevelDatabaseEmulator.clearDB();
        SettingsDBCOM.LowLevelDatabaseEmulator.createNewEntry("settings.key1", sv1.toString());

        // Start interface emulator
        var dbInterface = new SettingsDBCOM.ExampleDatabaseInterface();

        // Test pass 0.
        // Handle and ignore echo.
        var sm = new SettingsDBCOM.SettingsMessage(null, true);
        var ResponseMessage0 = dbInterface.handleSettingsMessage(sm);
        expect(ResponseMessage0).toEqual(null);

        // Test pass 1.

        // Create message
        // Read key1 that is already in the database (see above), create SettingsValue2 in the database.

        var sv2 : SettingsDBCOM.SettingsValue = new SettingsDBCOM.SettingsValue(2, "myName2");

        var sc1 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key1", null, SettingsDBCOM.SettingsIODirection.read);
        var sc2 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key2", sv2, SettingsDBCOM.SettingsIODirection.write);

        var sm : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc1, sc2], false);

        var responseMessage = dbInterface.handleSettingsMessage(sm);
        expect(responseMessage.hasBeenHandledByDB()).toEqual(true);
        expect(responseMessage.getContainers().length).toEqual(2);
        expect(responseMessage.getContainers()[0].getDirection()).toEqual(SettingsDBCOM.SettingsIODirection.read);
        expect(responseMessage.getContainers()[0].getTopic()).toEqual("settings.key1");
        expect(responseMessage.getContainers()[0].getValue()).toEqual(sv1);
        expect(responseMessage.getContainers()[1].getDirection()).toEqual(SettingsDBCOM.SettingsIODirection.write);
        expect(responseMessage.getContainers()[1].getTopic()).toEqual("settings.key2");
        // Since create or write operation, return value MAY be null to save bandwidth.


        // Test pass 2.
        //  Read all entries.

        var sm1b = new SettingsDBCOM.SettingsMessage(null, false);
        var responseMessage1b : SettingsDBCOM.SettingsMessage = dbInterface.handleSettingsMessage(sm1b);

        //expect(responseMessage1b.getContainers().length).toEqual(2);

        // Test pass 3.

        // Create message
        // Read key2 that has been written to the database (see above), create SettingsValue4 in the database
        //  and read SettingsValue4 back again in the same message then writes a new value to SettingsValue4.
        //  Note: It is undefined what should come back, because this message does not make sense, but the system should
        //   not run into unhandled exceptions or something... Therefore what comes back for key4 will not be tested.

        var sv4 = new SettingsDBCOM.SettingsValue(4, "myName4");

        var sc3 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key2", null, SettingsDBCOM.SettingsIODirection.read);
        var sc4a : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key4", sv4, SettingsDBCOM.SettingsIODirection.write);
        var sc4b : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key4", null, SettingsDBCOM.SettingsIODirection.read);
        var sc4c : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key4", sv4, SettingsDBCOM.SettingsIODirection.write);
        var sc5 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key1", null, SettingsDBCOM.SettingsIODirection.read);

        var sm2 : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc3, sc4a, sc4b, sc4c, sc5], false);

        var responseMessage2 = dbInterface.handleSettingsMessage(sm2);
        expect(responseMessage2.getContainers()[0].getValue()).toEqual(sv2);
        expect(responseMessage2.getContainers()[4].getValue()).toEqual(sv1);


        // Test pass 4.
        //  Delete entries.

        var sc6 : SettingsDBCOM.SettingsContainer = new SettingsDBCOM.SettingsContainer(
            "settings.key1", null, SettingsDBCOM.SettingsIODirection.write);

        var sm3 : SettingsDBCOM.SettingsMessage = new SettingsDBCOM.SettingsMessage([sc6], false);

        expect(SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("settings.key1")).toEqual(sv1.toString());
        var responseMessage3 = dbInterface.handleSettingsMessage(sm3);

        // Doesn't matter what's in the response message, but the entry should be deleted.

        expect(SettingsDBCOM.LowLevelDatabaseEmulator.readEntry("settings.key1")).toEqual(null);


        // Test pass 5.
        //  Get all entries again and delete all.

        var responseMessage4 = dbInterface.handleSettingsMessage(new SettingsDBCOM.SettingsMessage(null, false));
        expect(responseMessage4.getContainers().length).toEqual(2);

        for(var i = 0; i < 2; i++) {
            var topicBuf : string = responseMessage4.getContainers()[i].getTopic();
            dbInterface.handleSettingsMessage(new SettingsDBCOM.SettingsMessage(
                [new SettingsDBCOM.SettingsContainer(topicBuf, null, SettingsDBCOM.SettingsIODirection.write)]));
        }

        var responseMessage4a = dbInterface.handleSettingsMessage(new SettingsDBCOM.SettingsMessage(null, false));

        // Now all the entries should be deleted.
        expect(responseMessage4a.getContainers()).toEqual(null);

    })
}

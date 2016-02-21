/**
 * Created by VJTemp on 21.02.2016.
 */
///<reference path="../../src/tsnode/settings/SettingsData.ts"/>
///<reference path="../typings/jasmine/jasmine.d.ts"/>

describe("SettingsData", function () {
    it("SettingsContainer - Tests the SettingsContainer constructor and the get methods.", function () {
        var topic:string = "testTopic";
        var value:number = 17;
        var description:string = "tDescriptioN";
        var sv:SettingsData.SettingsContainer = new SettingsData.SettingsContainer(topic, value, description);
        expect(sv.getTopic()).toEqual(topic);
        expect(sv.getValue()).toEqual(value);
        expect(sv.getDescription()).toEqual(description);
    });

    it("SettingsContainer - Tests the SettingsContainer split counter.", function () {
        var topic:string = "tt";
        var value:number = 3;
        var description:string = "td";
        var sv:SettingsData.SettingsContainer = new SettingsData.SettingsContainer(topic, value, description);
        expect(sv.getTopic()).toEqual(topic);
        expect(sv.getValue()).toEqual(value);
        expect(sv.getDescription()).toEqual(description);
        expect(sv.stringifyMe().split("|").length).toEqual(SettingsData.SettingsContainer.getCountOfSplitSegments());
    });

    it("SettingsContainer - Tests the SettingsContainer stringification.", function () {
        var topic:string = "tt";
        var value:number = 3;
        var description:string = "td";
        var sv:SettingsData.SettingsContainer = new SettingsData.SettingsContainer(topic, value, description);
        expect(sv.stringifyMe()).toEqual("SettingsContainer[|tt|3|td|]");
    });

    it("SettingsContainer - Tests the SettingsContainer parse method.", function () {
        var str:string = "SettingsContainer[|topTest|-3.32|desc|]";
        var sv:SettingsData.SettingsContainer = SettingsData.SettingsContainer.parseMe(str, 0);
        var topic:string = "topTest";
        var value:number = -3.32;
        var description:string = "desc";
        expect(sv.getTopic()).toEqual(topic);
        expect(sv.getValue()).toEqual(value);
        expect(sv.getDescription()).toEqual(description);
    });

    it("SettingsContainer - Tests the SettingsContainer parse method.", function () {
        var str:string = "Som|Et|Hingel|Se|SettingsContainer[|topTest|-3.32|desc|]";
        var sv:SettingsData.SettingsContainer = SettingsData.SettingsContainer.parseMe(str, 4);
        var topic:string = "topTest";
        var value:number = -3.32;
        var description:string = "desc";
        expect(sv.getTopic()).toEqual(topic);
        expect(sv.getValue()).toEqual(value);
        expect(sv.getDescription()).toEqual(description);
    });

    it("SettingsContainer - Tests the SettingsContainer parse method.", function () {
        var str:string = "SettingsCont[|t|5|d|]";
        var sv:SettingsData.SettingsContainer = SettingsData.SettingsContainer.parseMe(str, 0);
        expect(sv).toEqual(null);
    });


    it("SettingsContainer - Tests the SettingsContainer parse method.", function () {
        var str:string = "SettingsContainer[|t|5|somethingElse...";
        var sv:SettingsData.SettingsContainer = SettingsData.SettingsContainer.parseMe(str, 0);
        expect(sv).toEqual(null);
    });

    it("SettingsContainer - Tests the SettingsContainer stringify and parse methods.", function () {
        var str:string = "SettingsContainer[|test1|2.5|des|]";
        var sv:SettingsData.SettingsContainer = SettingsData.SettingsContainer.parseMe(str, 0);
        var topic:string = "test1";
        var value:number = 2.5;
        var description:string = "des";
        expect(sv.getTopic()).toEqual(topic);
        expect(sv.getValue()).toEqual(value);
        expect(sv.getDescription()).toEqual(description);
        expect(sv.stringifyMe()).toEqual(str);
    });

    it("SettingsContainer - Tests the SettingsContainer clone method.", function () {
        var topic:string = "t1";
        var value:number = 7;
        var description:string = "d";
        var sv:SettingsData.SettingsContainer = new SettingsData.SettingsContainer(topic, value, description);
        expect(sv.getTopic()).toEqual(topic);
        expect(sv.getValue()).toEqual(value);
        expect(sv.getDescription()).toEqual(description);

        var sv2 = sv.cloneMe();
        expect(sv2.getTopic()).toEqual(topic);
        expect(sv2.getValue()).toEqual(value);
        expect(sv2.getDescription()).toEqual(description);
    });

    it("SettingsData - Tests the SettingsData constructor and get methods.", function () {
        var topic1:string = "test1";
        var value1:number = 11;
        var description1:string = "desc1";

        var topic2:string = "test2";
        var value2:number = 22;
        var description2:string = "desc2";

        var sv1 = new SettingsData.SettingsContainer(topic1, value1, description1);
        var sv2 = new SettingsData.SettingsContainer(topic2, value2, description2);

        var sva = [sv1, sv2];

        var sm1 = new SettingsData.SettingsData(sva, true, true);

        expect(sm1.getContainers()).toEqual(sva);
        expect(sm1.getContainers()[0]).toEqual(sv1);
        expect(sm1.isDirectionFromDB()).toEqual(true);
        expect(sm1.isIORead()).toEqual(true);


        var sm2 = new SettingsData.SettingsData(sva, false, false);

        expect(sm2.getContainers()).toEqual(sva);
        expect(sm2.getContainers()[0]).toEqual(sv1);
        expect(sm2.isDirectionFromDB()).toEqual(false);
        expect(sm2.isIORead()).toEqual(false);
    });

    it("SettingsData - Tests the SettingsData getValueOf method.", function () {
        var topic1:string = "Test1";
        var value1:number = 100;
        var description1:string = "Desc1";

        var topic2:string = "Test2";
        var value2:number = 200;
        var description2:string = "Desc2";

        var sv1 = new SettingsData.SettingsContainer(topic1, value1, description1);
        var sv2 = new SettingsData.SettingsContainer(topic2, value2, description2);

        var sva = [sv1, sv2];

        var sm1 = new SettingsData.SettingsData(sva, true, true);

        expect(sm1.getValueOf(topic1)).toEqual(sv1);
        expect(sm1.getValueOf(topic2)).toEqual(sv2);
        expect(sm1.getValueOf("HelloWorld")).toEqual(null);
    });

    it("SettingsData - Tests the SettingsData setValueOf and getValueOf method.", function () {
        var topic1:string = "t111";
        var value1:number = 111;
        var description1:string = "d111";

        var topic2:string = "t222";
        var value2:number = 222;
        var description2:string = "d222";

        var value3:number = 333;
        var description3:string = "d333";

        var sv1 = new SettingsData.SettingsContainer(topic1, value1, description1);
        var sv2 = new SettingsData.SettingsContainer(topic2, value2, description2);
        var sv3 = new SettingsData.SettingsContainer(topic1, value3, description3);

        var sva = [sv1, sv2];

        var sm1 = new SettingsData.SettingsData(sva, true, true);

        expect(sm1.getValueOf(topic1)).toEqual(sv1);
        expect(sm1.getValueOf(topic2)).toEqual(sv2);
        expect(sm1.setValueOf(sv3)).toEqual(true);
        expect(sm1.getValueOf(topic1)).toEqual(sv3);
        expect(sm1.setValueOf(new SettingsData.SettingsContainer("HelloWorld", 5, "unknown"))).toEqual(false);
    });

    it("SettingsData - Tests the SettingsData stringify method.", function () {
        var topic1:string = "t111";
        var value1:number = 111;
        var description1:string = "d111";

        var topic2:string = "t222";
        var value2:number = 222;
        var description2:string = "d222";

        var sv1 = new SettingsData.SettingsContainer(topic1, value1, description1);
        var sv2 = new SettingsData.SettingsContainer(topic2, value2, description2);

        var sva1 = [sv1];
        var sva2 = [sv1, sv2];

        var sm1 = new SettingsData.SettingsData(sva1, true, true);

        expect(sm1.stringifyMe()).toEqual("SettingsData[|read|fromDB|" + sv1.stringifyMe() + "|]");

        var sm2 = new SettingsData.SettingsData(sva2, false, false);
        expect(sm2.stringifyMe()).toEqual("SettingsData[|write|toDB|" + sv1.stringifyMe() + "|" + sv2.stringifyMe() + "|]");
    });

    it("SettingsData - Tests the SettingsData stringify method.", function () {
        var topic1:string = "topic_001";
        var value1:number = -1001.101;
        var description1:string = "description_001";

        var topic2:string = "topic_002";
        var value2:number = -2002.202;
        var description2:string = "description_002";

        var sv1 = new SettingsData.SettingsContainer(topic1, value1, description1);
        var sv2 = new SettingsData.SettingsContainer(topic2, value2, description2);

        var sva1 = [sv1];
        var sva2 = [sv1, sv2];

        var sm1 = new SettingsData.SettingsData(sva1, true, false);
        var sm2 = new SettingsData.SettingsData(sva2, false, true);

        var str1 = sm1.stringifyMe();
        var str2 = sm2.stringifyMe();

        var smr1 = SettingsData.SettingsData.parseMe(str1);
        var smr2 = SettingsData.SettingsData.parseMe(str2);

        expect(sm1).toEqual(smr1);
        expect(sm1.getContainers()).toEqual(smr1.getContainers());
        expect(sm1.isDirectionFromDB()).toEqual(smr1.isDirectionFromDB());
        expect(sm1.isIORead()).toEqual(smr1.isIORead());
        expect(sm1.stringifyMe()).toEqual(smr1.stringifyMe());

        expect(sm2).toEqual(smr2);
        expect(sm2.getContainers()).toEqual(smr2.getContainers());
        expect(sm2.isDirectionFromDB()).toEqual(smr2.isDirectionFromDB());
        expect(sm2.isIORead()).toEqual(smr2.isIORead());
        expect(sm2.stringifyMe()).toEqual(smr2.stringifyMe());

        var str3 = "SettingsData[|push|toDB|" + sv1.stringifyMe() + "|]";
        var sm3 = SettingsData.SettingsData.parseMe(str3);
        expect(sm3).toEqual(null);

        var str4 = "SettingsData[|read|toDatabase|" + sv2.stringifyMe() + "|]";
        var sm4 = SettingsData.SettingsData.parseMe(str4);
        expect(sm4).toEqual(null);

        var str5 = "SettingsData[|read|toDB|ERRORHEREWITHOUTSPLITTER" + sv2.stringifyMe() + "|]";
        var sm5 = SettingsData.SettingsData.parseMe(str5);
        expect(sm5).toEqual(null);

        var str6 = "SetData[|read|toDB|" + sv1.stringifyMe() + "|]";
        var sm6 = SettingsData.SettingsData.parseMe(str6);
        expect(sm6).toEqual(null);
    });
}

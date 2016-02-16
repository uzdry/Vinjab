///<reference path="./typings/jasmine/jasmine.d.ts"/>
///<reference path="../levelup.d.ts"/>

import{DBBusDevice} from "../src/tsnode/DBAccess";
import * as msg from "../src/tsnode/messages";
import * as bus from "../src/tsnode/Bus";
import leveldown = require("leveldown");

describe("init", function () {
    it("destroy and init the database", function() {
        leveldown.destroy("../testDB", function() {
        });
        var db = new DBBusDevice();
    });
    it("open an existing database", function() {
        var db = new DBBusDevice();
    })
});

describe("putAndGetValues", function () {
    it("handle values and request", function () {
        var db = new DBBusDevice();
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.VALUE_ANSWER_MSG);
        var i = 0;
        while(i < 100) {
            db.handleMessage(new msg.ValueMessage(msg.Topic.VALUE_MSG, new msg.Value(i, msg.Topic.SPEED.name)));
            i++;
        }
        db.handleMessage(new msg.DBRequestMessage(0, new Date(0), new Date(), msg.Topic.SPEED));
        setTimeout(function() {
            var vam = <msg.ValueAnswerMessage> simplesub.message;
            expect(vam.getValues()).toContain(0);
            expect(vam.getValues()).toContain(1);
            expect(vam.getValues()).toContain(100);
        }, 200);
    });

    it("flood the db with values", function () {
        leveldown.destroy("../testDB", function() {});
        var db = new DBBusDevice();
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.VALUE_ANSWER_MSG);
        var i = 0;
        while(i < 20000) {
            db.handleMessage(new msg.ValueMessage(msg.Topic.VALUE_MSG, new msg.Value(i, msg.Topic.SPEED.name)));
            i++;
        }
        db.handleMessage(new msg.DBRequestMessage(0, new Date(0), new Date(), msg.Topic.SPEED));
        setTimeout(function() {
            var vam = <msg.ValueAnswerMessage> simplesub.message;
            expect(vam.getValues()[0]).toBeGreaterThan(9000);
            expect(vam.getValues()).toContain(11000);
            expect(vam.getValues()).toContain(12000);
            expect(vam.getValues()).toContain(14001);
            expect(vam.getValues().length).toBeLessThan(10001);
        }, 200);
    });
});

describe("putAndGetDriver", function () {
    it("handle driver request", function() {
        var db = new DBBusDevice();
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.DASHBOARD_ANS_MSG);
        db.handleMessage(new msg.DashboardMessage("testd", "", true));
        setTimeout(function () {
            var dam = <msg.DashboardRspMessage> simplesub.message;
            expect(dam.user).toBe("testd");
            expect(dam.config).toBe('[{"row":1,"col":1,"size_x":4,"size_y":4,"name":' +
                '"SpeedGauge","id":140},{"row":1,"col":5,"size_x":3,"size_y":3,' +
                '"name":"PercentGauge","id":150},{"row":1,"col":8,"size_x":4,"size_y":4,' +
                '"name":"PercentGauge","id":350}]');
        }, 200);
    });
    it("handle driver msg and request", function() {
        var db = new DBBusDevice();
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.DASHBOARD_ANS_MSG);
        db.handleMessage(new msg.DashboardMessage("testa", "DasIstEinTestString!", false));
        db.handleMessage(new msg.DashboardMessage("testa", "DerStringHierGehtVerloren", true));
        setTimeout(function() {
            var dam = <msg.DashboardMessage> simplesub.message;
            expect(dam.user).toBe("testa");
            expect(dam.config).toBe("DasIstEinTestString!");
        }, 200);
    });
});

class SimpleSubscriber extends bus.BusDevice {

    message: msg.Message;

    public handleMessage(m: msg.Message): void {
        this.message = m;
    }

}

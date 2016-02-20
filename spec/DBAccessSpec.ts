///<reference path="./typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/levelup/levelup.d.ts"/>

import{DBBusDevice} from "../src/tsnode/DBAccess";
import * as msg from "../src/tsnode/messages";
import * as bus from "../src/tsnode/Bus";
import leveldown = require("leveldown");

describe("init", function () {
    it("destroy and init the database", function() {
        var db;
        db = new DBBusDevice();
        db = undefined;
        db = new DBBusDevice();
        db.handleMessage(new msg.ValueMessage(msg.Topic.SPEED, new msg.Value(3, "value.speed")));
        setTimeout(db.handleMessage(new msg.ValueMessage(msg.Topic.SPEED, new msg.Value(255, "value.speed"))), 300);
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.VALUE_ANSWER_MSG);
        db.handleMessage(new msg.DBRequestMessage(1, new Date(0), new Date(), msg.Topic.SPEED));
        var vam = undefined;
        while (!vam) {
            setTimeout(function(){
                vam = simplesub.message;
            }.bind(this), 0)
        }
        expect(vam.getValues()).toContain(3);
        expect(vam.getValues()).toContain(100);
        db = null;
    });
    it("open an existing database", function() {
        var db = new DBBusDevice();
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.REPLAY_INFO);
        db.handleMessage(new msg.DashboardMessage("lorem", "ipsum", true));
        var ri = undefined;
        while(!ri) {
            setTimeout(function() {
                ri = <msg.ReplayInfoMessage> simplesub.message;
            }.bind(this), 0);
        }
        expect(ri.finishTime.length).toBeGreaterThan(0);
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
        }, 400);
    });

    it("flood the db with values", function () {
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
        }.bind(this), 400);
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
        }.bind(this), 400);
    });
    it("handle driver msg and request", function() {
        var db = new DBBusDevice();
        var simplesub = new SimpleSubscriber();
        simplesub.subscribe(msg.Topic.DASHBOARD_ANS_MSG);
        db.handleMessage(new msg.DashboardMessage("testa", "DasIstEinTestString!", false));
        db.handleMessage(new msg.DashboardMessage("testa", "DerStringHierGehtVerloren.Nicht!", false));
        setTimeout(function() {
            var dam = <msg.DashboardMessage> simplesub.message;
            expect(dam.user).toBe("testa");
            expect(dam.config).toBe("DerStringHierGehtVerloren.Nicht!");
        }.bind(this), 400);
    });
});

class SimpleSubscriber extends bus.BusDevice {

    message: msg.Message;

    public handleMessage(m: msg.Message): void {
        this.message = m;
        console.log(JSON.stringify(m));
    }
}

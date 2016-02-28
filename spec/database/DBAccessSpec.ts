///<reference path="./../typings/jasmine/jasmine.d.ts"/>
///<reference path="../../typings/levelup/levelup.d.ts"/>

import{DBBusDevice} from "../../src/tsnode/DBAccess";
import * as msg from "../../src/tsnode/messages";
import * as bus from "../../src/tsnode/Bus";
import leveldown = require("leveldown");

describe("init", function () {
    var db;
    var simplesub;

    beforeEach(function () {
        db = new DBBusDevice();
        simplesub = new SimpleSubscriber();
    });

    afterEach(function () {
        db = null;
        simplesub = null;
        leveldown.destroy("../../VINJAB-DB", function () {
        });
    });

    it("open a new the database", function () {
        db.handleMessage(new msg.ValueMessage(msg.Topic.SPEED, new msg.Value(3, "value.speed")));
        setTimeout(db.handleMessage(new msg.ValueMessage(msg.Topic.SPEED, new msg.Value(255, "value.speed"))), 300);
        simplesub.subscribe(msg.Topic.VALUE_ANSWER_MSG);
        db.handleMessage(new msg.DBRequestMessage(0, new Date(0), new Date(), msg.Topic.SPEED));
        var vam = undefined;
        while (!vam) {
            setTimeout(function () {
                vam = simplesub.message;
            }.bind(this), 100)
        }
        expect(vam.getValues()).toContain(3);
        expect(vam.getValues()).toContain(255);
    });

    it("open an existing database", function () {
        db = null;
        db = new DBBusDevice();
        simplesub.subscribe(msg.Topic.DASHBOARD_ANS_MSG);
        db.handleMessage(new msg.DashboardMessage("lorem", "ipsum", false));
        db.handleMessage(new msg.DashboardMessage("lorem", "ipsum", true));
        var ri = undefined;
        while (!ri) {
            setTimeout(function () {
                ri = <msg.ReplayInfoMessage> simplesub.message;
            }.bind(this), 100);
        }
        expect(ri.finishTime.length).toBeGreaterThan(0);
    })
});

describe("putAndGetValues", function () {
    var db;
    var simplesub;

    beforeEach(function () {
        db = new DBBusDevice();
        simplesub = new SimpleSubscriber();
    });

    afterEach(function () {
        db = null;
        simplesub = null;
        leveldown.destroy("../../VINJAB-DB", function () {
        });
    });


    it("handle values and request", function () {
        simplesub.subscribe(msg.Topic.VALUE_ANSWER_MSG);
        var i = 0;
        while (i < 100) {
            db.handleMessage(new msg.ValueMessage(msg.Topic.VALUE_MSG, new msg.Value(i, msg.Topic.SPEED.name)));
            i++;
        }
        db.handleMessage(new msg.DBRequestMessage(0, new Date(0), new Date(), msg.Topic.SPEED));
        setTimeout(function () {
            var vam = <msg.ValueAnswerMessage> simplesub.message;
            i = 0;
            while (i < 100) {
                expect(vam.getValues()).toContain(i);
                i++;
            }
        }, 400);
    });


    it("flood the db with values", function () {
        simplesub.subscribe(msg.Topic.VALUE_ANSWER_MSG);
        var i = 0;
        while (i < 100000) {
            db.handleMessage(new msg.ValueMessage(msg.Topic.VALUE_MSG, new msg.Value(i, msg.Topic.SPEED.name)));
            i++;
        }
        db.handleMessage(new msg.DBRequestMessage(0, new Date(0), new Date(), msg.Topic.SPEED));
        setTimeout(function () {
            var vam = <msg.ValueAnswerMessage> simplesub.message;
            var j = vam.getValues()[0];
            var k = 0;
            while (k < vam.getValues()[vam.getValues().length - 1]) {
                expect(vam.getValues()[k]).toBe(j);
                k++;
            }
            expect(vam.getAnsTopic()).toBe(msg.Topic.SPEED);
        }.bind(this), 100);
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
        }.bind(this), 100);
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
        }.bind(this), 100);
    });
});

class SimpleSubscriber extends bus.BusDevice {

    message: msg.Message;

    constructor() {
        super();
    }

    public handleMessage(m: msg.Message): void {
        this.message = m;
        console.log(JSON.stringify(m));
    }
}


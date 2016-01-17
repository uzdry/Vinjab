var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Topic = (function () {
    function Topic(pID, pName) {
        if (pID < 0) {
            return null;
        }
        this.id = pID;
        this.name = pName;
    }
    Topic.prototype.getID = function () {
        return this.id;
    };
    Topic.prototype.equals = function (topic) {
        return this.getID() === topic.getID();
    };
    return Topic;
})();
exports.Topic = Topic;
var Message = (function () {
    function Message(pTopic) {
        this.topic = pTopic;
    }
    Message.prototype.getTopic = function () {
        return this.topic;
    };
    return Message;
})();
exports.Message = Message;
var BusDevice = (function () {
    function BusDevice() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }
    BusDevice.prototype.handleMessage = function (m) {
        this.abstractHandle();
    };
    BusDevice.prototype.abstractHandle = function () {
        throw new Error('This method is abstract and must be overridden');
    };
    BusDevice.prototype.subscribe = function (t) {
        this.broker.subscribe(t, this);
    };
    BusDevice.prototype.unsubscribe = function (t) {
        this.broker.unsubscribe(t, this);
    };
    BusDevice.prototype.getID = function () {
        return this.id;
    };
    BusDevice.cnt = 0;
    return BusDevice;
})();
exports.BusDevice = BusDevice;
var Broker = (function () {
    function Broker() {
        this.subs = [];
    }
    Broker.get = function () {
        if (this.instance == null) {
            this.instance = new Broker();
        }
        return Broker.instance;
    };
    Broker.prototype.handleMessage = function (m) {
        this.distribute(m);
    };
    Broker.prototype.subscribe = function (topic, sub) {
        if (!this.subs[topic.getID()]) {
            this.subs[topic.getID()] = new Array();
        }
        this.subs[topic.getID()].push(sub);
    };
    Broker.prototype.unsubscribe = function (topic, sub) {
        var index = this.subs[topic.getID()].indexOf(sub, 0);
        if (index != undefined) {
            this.subs[topic.getID()].splice(index, 1);
        }
    };
    Broker.prototype.distribute = function (m) {
        for (var i in this.subs[m.getTopic().getID()]) {
            i.handleMessage();
        }
    };
    return Broker;
})();
var DBRequestMessage = (function (_super) {
    __extends(DBRequestMessage, _super);
    function DBRequestMessage(pReq) {
        _super.call(this, DBRequestMessage.TOPIC);
        this.req = pReq;
    }
    DBRequestMessage.prototype.getRequest = function () {
        return this.req;
    };
    DBRequestMessage.TOPIC = new Topic(10, "Database request message");
    return DBRequestMessage;
})(Message);
exports.DBRequestMessage = DBRequestMessage;
var SettingsMessage = (function (_super) {
    __extends(SettingsMessage, _super);
    function SettingsMessage() {
        _super.call(this, SettingsMessage.TOPIC);
    }
    SettingsMessage.TOPIC = new Topic(20, "Settings message");
    return SettingsMessage;
})(Message);
exports.SettingsMessage = SettingsMessage;

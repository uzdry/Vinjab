var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//Topic defines the Topic of a message. BusDevices subscribe to Topics
var Topic = (function () {
    //instantiates a new Topic with ID and name
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
//super class for all Message Types
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
//A BusDevice has acces to the Bus
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
        this.subscribers = new Map();
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
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new Set());
            console.log('Set created');
        }
        this.subscribers.get(topic).add(sub);
    };
    Broker.prototype.unsubscribe = function (topic, sub) {
        this.subscribers.get(topic).delete(sub);
    };
    Broker.prototype.distribute = function (m) {
        if (this.subscribers.get(m.getTopic()) == null) {
            return;
        }
        var iter = this.subscribers.get(m.getTopic()).entries();
        var x;
        while ((x = iter.next().value) != null) {
            x[0].handleMessage(m);
        }
    };
    return Broker;
})();
var ValueMessage = (function (_super) {
    __extends(ValueMessage, _super);
    function ValueMessage(pTopic, pValue) {
        _super.call(this, pTopic);
        this.value = pValue;
    }
    ValueMessage.prototype.getValue = function () {
        return this.value;
    };
    ValueMessage.TOPIC = new Topic(30, "Value message");
    return ValueMessage;
})(Message);
exports.ValueMessage = ValueMessage;
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
        this.configs = new Map();
    }
    SettingsMessage.prototype.getConfigs = function () {
        return this.configs;
    };
    SettingsMessage.TOPIC = new Topic(20, "Settings message");
    return SettingsMessage;
})(Message);
exports.SettingsMessage = SettingsMessage;

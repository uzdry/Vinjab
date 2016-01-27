///<reference path="../../typings/node/node.d.ts"/>
//A BusDevice has acces to the Bus
var BusDevice = (function () {
    function BusDevice() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }
    BusDevice.prototype.abstractHandle = function () {
        throw new Error('This method is abstract and must be overridden');
    };
    BusDevice.prototype.subscribe = function (t) {
        this.broker.subscribe(t, this);
    };
    BusDevice.prototype.subscribeAll = function (topics) {
        for (var x in topics) {
            this.broker.subscribe(x, this);
        }
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
        this.subscribers = new Map();
    }
    Broker.get = function () {
        if (Broker.instance == null || typeof Broker.instance == undefined) {
            Broker.instance = new Broker();
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
exports.Broker = Broker;

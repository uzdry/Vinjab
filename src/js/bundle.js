(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// reference path="/Users/valentin/Downloads/TypeScript-master/lib/lib.es6.d.ts"
/**
 * Created by valentin on 10/01/16.
 */
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
    BusDevice.prototype.getID = function () {
        return this.id;
    };
    BusDevice.cnt = 0;
    return BusDevice;
})();
exports.__esModule = true;
exports["default"] = BusDevice;
var Broker = (function () {
    function Broker() {
        this.subs = [];
    }
    Broker.get = function () {
        if (this.instance == null) {
            this.instance = new Broker();
        }
        return this.instance;
    };
    Broker.prototype.handleMessage = function (m) {
        var topic = m.getTopic();
    };
    Broker.prototype.subscribe = function (topic, sub) {
        this.subs[topic.getID()] = sub;
        console.log(this.subs[topic.getID()].getID());
    };
    return Broker;
})();

},{}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bus_1 = require("./../tsnode/Bus");
/**
 * Created by valentin on 12/01/16.
 */
var Source = (function (_super) {
    __extends(Source, _super);
    function Source() {
        _super.call(this);
    }
    return Source;
})(Bus_1["default"]);
exports.__esModule = true;
exports["default"] = Source;

},{"./Bus":1}],3:[function(require,module,exports){
var Source_1 = require("./../tsnode/Source");
var Bus_1 = require("./../tsnode/Bus");
var s = new Source_1["default"]();
var t = new Bus_1.Topic(0, "test");
s.subscribe(new Bus_1.Topic(0, "aaa"));
var sub = new Array();
for (var i = 0; i < 25; i++) {
    sub.push(new Source_1["default"]());
}
sub.pop().subscribe(t);

},{"./Bus":1,"./Source":2}]},{},[3]);

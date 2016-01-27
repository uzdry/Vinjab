///<reference path="../../typings/node/node.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bus_1 = require("./Bus");
var Utils_1 = require("./Utils");
var messages_1 = require("./messages");
var Source = (function (_super) {
    __extends(Source, _super);
    function Source(pTopic) {
        _super.call(this);
        this.cnt = 0;
        this.value = new Utils_1.Value(0, 'km/h');
        this.cnt = 0;
        this.topic = pTopic;
    }
    Source.prototype.fire = function () {
        setInterval(this.update.bind(this), 500);
    };
    Source.prototype.update = function () {
        console.log('went in');
        this.value = new Utils_1.Value(60, 'km/h');
        var m = new messages_1.ValueMessage(this.topic, this.value);
        this.broker.handleMessage(m);
    };
    Source.prototype.handleMessage = function (m) {
    };
    Source.prototype.publish = function (t) {
        var m = new messages_1.ValueMessage(t, this.value);
        Bus_1.Broker.get().handleMessage(m);
    };
    return Source;
})(Bus_1.BusDevice);
exports.Source = Source;
var TerminalProxy = (function (_super) {
    __extends(TerminalProxy, _super);
    function TerminalProxy() {
        _super.apply(this, arguments);
    }
    TerminalProxy.prototype.handleMessage = function (m) {
        if (m instanceof messages_1.ValueMessage) {
            console.log(m.value.numericalValue());
        }
    };
    return TerminalProxy;
})(Bus_1.BusDevice);
exports.TerminalProxy = TerminalProxy;

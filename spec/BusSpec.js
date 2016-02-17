///<reference path="./typings/jasmine/jasmine.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bus_1 = require("../src/tsnode/Bus");
var Source_1 = require("../src/tsnode/Source");
var messages_1 = require("../src/tsnode/messages");
describe("pubsub", function () {
    it("publish messages", function () {
        var publisher = new Source_1.Source(messages_1.Topic.SPEED, 2);
        var subscriber = new SimpleSubscriber();
        subscriber.subscribe(messages_1.Topic.SPEED);
        var value = new messages_1.Value(22, "km/h");
        publisher.publish(value);
        var vm = (subscriber.message);
        expect(value).toEqual(vm.value);
    });
    it("average aggregation", function () {
        /*  var publisher = new Source(Topic.SPEED, 2);
          var subscriber = new SimpleSubscriber();
          subscriber.subscribe(Topic.AVG_SPEED);
          var aggregation = new AverageComputation(Topic.SPEED);
          var value = new Value(22, "km/h");
          publisher.publish(value);
          sleep(2000);
          var value = new Value(24, "km/h");
          publisher.publish(value);
          sleep(2000);
          publisher.publish(value);
          var vm;
          sleep(500);
          vm = <ValueMessage>(subscriber.message);
          expect(vm.value.value).toEqual(23);*/
    });
});
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay)
        ;
}
var SimpleSubscriber = (function (_super) {
    __extends(SimpleSubscriber, _super);
    function SimpleSubscriber() {
        _super.apply(this, arguments);
    }
    SimpleSubscriber.prototype.handleMessage = function (m) {
        this.message = m;
    };
    return SimpleSubscriber;
})(Bus_1.BusDevice);

///reference path="./typings/jasmine/jasmine.d.ts"/>
///reference path="../typings/tsd.d.ts"/>

import {BusDevice} from "../src/tsnode/Bus";
import {Source} from "../src/tsnode/Source";
import {Topic, Message, Value, ValueMessage} from "../src/tsnode/messages";
import {AverageComputation} from "../src/tsnode/AggregatedFunctions"

describe("pubsub" ,function() {
    it("publish messages", function() {
        var publisher = new Source(Topic.SPEED, 2);
        var subscriber = new SimpleSubscriber();
        subscriber.subscribe(Topic.SPEED);
        var value = new Value(22, "km/h");
        publisher.publish(value);
        var vm: ValueMessage = <ValueMessage>(subscriber.message);
        expect(value).toEqual(vm.value);
    });

    it("average aggregation", function() {
        var publisher = new Source(Topic.SPEED, 2);
        var subscriber = new SimpleSubscriber();
        subscriber.subscribe(Topic.AVG_SPEED);
        var aggregation = new AverageComputation(Topic.SPEED);
        var value = new Value(22, "km/h");
        publisher.publish(value);
        var value = new Value(24, "km/h");
        publisher.publish(value);
        var vm;
        while (vm == null) {
            vm = <ValueMessage>(subscriber.message);
        }
        expect(vm.value.value).toEqual(23);
    });

});

class SimpleSubscriber extends BusDevice {

    message: Message;

    public handleMessage(m: Message): void {
        this.message = m;
    }

}

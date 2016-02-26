///<reference path="./../typings/jasmine/jasmine.d.ts"/>

import {BusDevice} from "../../src/tsnode/Bus";
import {Source} from "../../src/tsnode/Source";
import {Topic, Message, Value, ValueMessage} from "../../src/tsnode/messages";
import {AverageComputation} from "../../src/tsnode/AggregatedFunctions";

describe("pubsub" ,function() {


    it("subscribe unsubscribe", function() {
        var subscriber = new SimpleSubscriber();
        subscriber.subscribe(Topic.SPEED);
        expect(subscriber.broker.getSubscribers(Topic.SPEED.name)).toEqual([subscriber]);
        subscriber.unsubscribe(Topic.SPEED);
        expect(subscriber.broker.getSubscribers(Topic.SPEED.name)).toEqual([]);
    });

    it("subscribe unsubscribe all", function() {
        var subscriber = new SimpleSubscriber();
        subscriber.subscribeAll(Topic.VALUES);

        for (var i in Topic.VALUES) {
            expect(subscriber.broker.getSubscribers(Topic.VALUES[i].name)).toEqual([subscriber]);
        }

        subscriber.unsubscribeAll();

        for (var i in Topic.VALUES) {
            expect(subscriber.broker.getSubscribers(Topic.VALUES[i].name)).toEqual([]);
        }

    });

    it("publish messages", function() {
        var publisher = new Source(Topic.SPEED, 1);
        var subscriber = new SimpleSubscriber();
        subscriber.subscribe(Topic.SPEED);
        var value = new Value(22, "km/h");
        publisher.publish(value);
        var vm: ValueMessage = <ValueMessage>(subscriber.message);
        expect(value).toEqual(vm.value);
    });

    it("average aggregation", function(done) {
        var publisher = new Source(Topic.SPEED, 2);
        var subscriber = new SimpleSubscriber();
        subscriber.subscribe(Topic.AVG_SPEED);
        var aggregation = new AverageComputation(Topic.SPEED);
        setTimeout(function() {
            var value1 = new Value(22, "km/h");
            publisher.publish(value1);
            setTimeout(function() {
                var value2 = new Value(24, "km/h");
                publisher.publish(value2);
                var vm;
                vm = <ValueMessage>(subscriber.message);
                expect(vm.value.value).toEqual(23);
                done();
            }, 2);
        },2);


    });


});



class SimpleSubscriber extends BusDevice {

    message: Message;

    public handleMessage(m: Message): void {
        this.message = m;
    }

}

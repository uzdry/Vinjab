
///<reference path="../../typings/node/node.d.ts"/>

import * as Msg from "./messages"


//A BusDevice has access to the Bus
class BusDevice {
    broker:Broker;
    id:number;
    static cnt:number = 0;

    constructor() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }

    public handleMessage(m:Msg.Message):void {
        this.abstractHandle();
    }

    private abstractHandle():void {
        throw new Error('This method is abstract and must be overridden');
    }

    public subscribe(t: Msg.Topic) {
        this.broker.subscribe(t.name, this);
    }

    public subscribeAll(topics: Msg.Topic[]): void {
        for (var i in topics) {
            this.broker.subscribe(topics[i].name, this);
        }
    }

    public unsubscribeAll() {
        this.broker.unsubscribeAll(this);
    }

    public unsubscribe(t:Msg.Topic) {
        this.broker.unsubscribe(t.name, this);
    }

    public getID():number {
        return this.id;
    }


}

/**
 * A Simple Broker tackeling subscriptions of topics and distributing messages accordingly
 */
class Broker {


    private static instance:Broker = new Broker();
  //  private subs: Map<string, Set<BusDevice>>;

    private subscribers: { [topic:string]:Array<BusDevice>; } = {};

    /**
     * For internal calls only
     */
    constructor() {
     //   this.subs = new Map<string, Set<BusDevice>>();
        if (Broker.instance) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.get() instead of new.");
        }
        Broker.instance = this;
    }

    /**
     * This class should only be initialized once;
     * @returns {Broker} instance of a broker;
     */
    public static get():Broker {
        return Broker.instance;
    }

    public handleMessage(m: Msg.Message) {
        this.distribute(m);
    }


    public subscribe(topic:string, sub:BusDevice):void {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = new Array<BusDevice>();
       //     console.log('Set created: ' + topic + " " + sub.constructor.name);
        }
        this.subscribers[topic].push(sub);
    }

    public unsubscribeAll(sub: BusDevice) {
        for (var i = 0; i < Msg.Topic.VALUES.length; i++) {
            if (this.subscribers[Msg.Topic.VALUES[i].name]) {
                for (var j = 0; j < this.subscribers[Msg.Topic.VALUES[i].name].length; j++) {
                    if (this.subscribers[Msg.Topic.VALUES[i].name][j] == sub) {
                        this.unsubscribe(Msg.Topic.VALUES[i].name, sub);
                    }
                }
            }
        }
    }

    public unsubscribe(topic:string, sub:BusDevice):void {

    //    this.subscribers.get(topic).delete(sub);

        var subsOfTopic = this.subscribers[topic];

        if(!this.subscribers[topic]) {
            return;
        }

        var i = this.subscribers[topic].indexOf(sub);
        this.subscribers[topic].splice(i,1);




    }

    private distribute(m:Msg.Message) {
       /* if (this.subscribers.get(m.topic.name) == null) {
            return;
        }

        var iter = this.subscribers.get(m.topic.name).entries();

        var x;
        while((x = iter.next().value) != null) {
            x[0].handleMessage(m);
        }*/

        if (!this.subscribers[m.topic.name]) {
            return;
        }

        for (var i = 0; i < this.subscribers[m.topic.name].length; i++) {
            this.subscribers[m.topic.name][i].handleMessage(m);
        }

    }
}

export {BusDevice, Broker};

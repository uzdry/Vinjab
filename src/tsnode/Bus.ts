
///<reference path="../../typings/node/node.d.ts"/>

import * as Msg from "./messages"


//A BusDevice has acces to the Bus
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
        for (var x in topics) {
            this.broker.subscribe(x.name, this);
        }
    }


    public unsubscribe(t:Msg.Topic) {
        this.broker.unsubscribe(t.name, this);
    }

    public getID():number {
        return this.id;
    }


}

class Broker {


    private static instance:Broker;
    private subscribers: Map<string, Set<BusDevice>>;

    constructor() {
        this.subscribers = new Map<string, Set<BusDevice>>();
    }

    public static get():Broker {
        if (Broker.instance == null || typeof Broker.instance == undefined) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    }

    public handleMessage(m: Msg.Message) {
        this.distribute(m);
    }


    public subscribe(topic:string, sub:BusDevice):void {
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new Set<BusDevice>());
            console.log('Set created: ' + topic);
        }
        this.subscribers.get(topic).add(sub);
    }

    public unsubscribe(topic:string, sub:BusDevice):void {

        this.subscribers.get(topic).delete(sub);

    }

    private distribute(m:Msg.Message) {
        if (this.subscribers.get(m.topic.name) == null) {
            return;
        }

        var iter = this.subscribers.get(m.topic.name).entries();

        var x;
        while((x = iter.next().value) != null) {
            x[0].handleMessage(m);
        }

    }
}


export {BusDevice, Broker};

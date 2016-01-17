///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>

import Value from "./Utils";
import DBReqest from "./Utils";
import Value from "./Utils";
class Topic {
    private id:number;
    private name:string;

    constructor(pID:number, pName:string) {
        if (pID < 0) {
            return null;
        }
        this.id = pID;
        this.name = pName;
    }

    public getID():number {
        return this.id;
    }

    public equals(topic: Topic) {
        return this.getID() === topic.getID();
    }

}

class Message {
    private topic:Topic;

    constructor(pTopic:Topic) {
        this.topic = pTopic;
    }

    getTopic():Topic {
        return this.topic;
    }
}

class BusDevice {
    protected broker:Broker;
    private id:number;
    static cnt:number = 0;

    constructor() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }

    public handleMessage(m:Message):void {
        this.abstractHandle();
    }

    private abstractHandle():void {
        throw new Error('This method is abstract and must be overridden');
    }

    public subscribe(t:Topic) {
        this.broker.subscribe(t, this);
    }

    public unsubscribe(t:Topic) {
        this.broker.unsubscribe(t, this);
    }

    public getID():number {
        return this.id;
    }


}

class Broker {

    private subs:{[tid: number]:Array<BusDevice>} = <any>[];
    private static instance:Broker;

    bds: Set<BusDevice>;
    private subscribers: Map<Topic, Set<BusDevice>>;

    constructor() {
        this.subscribers = new Map<Topic, Set<BusDevice>>();
    }

    public static get():Broker {
        if (this.instance == null) {
            this.instance = new Broker();
        }
        return Broker.instance;
    }

    public handleMessage(m:Message):void {
        this.distribute(m);
    }

    public subscribe(topic:Topic, sub:BusDevice):void {
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new Set<BusDevice>());
            console.log('Set created');
        }


        this.subscribers.get(topic).add(sub);

        var iter = this.subscribers.get(topic).entries();
        var x;
        while ((x = iter.next().value) != null) {
            console.log(x[0]);
        }


    }

    public unsubscribe(topic:Topic, sub:BusDevice):void {

        this.subscribers.get(topic).delete(sub);



    }

    private distribute(m:Message) {

        for (var i in this.subscribers.get(m.getTopic()).values()) {
            i.handleMessage();
        }

    }
}

class ValueMessage extends Message {
    static TOPIC = new Topic(30, "Value message")
    private value: Value;
    constructor(pValue: Value) {
        super(ValueMessage.TOPIC);
        this.value = pValue;

    }
}

class DBRequestMessage extends Message {
    private req: DBReqest;
    static TOPIC = new Topic(10, "Database request message");

    constructor(pReq: DBReqest) {
        super(DBRequestMessage.TOPIC);
        this.req = pReq;
    }

    public getRequest():DBReqest {
        return this.req
    }

}

class SettingsMessage extends Message {
    private configs: Map<Topic, Value>;
    static TOPIC = new Topic(20, "Settings message");

    constructor() {
        super(SettingsMessage.TOPIC);
        this.configs = new Map<Topic, Value>();
    }

    getConfigs(): Map<Topic,Value> {
        return this.configs;
    }

}

export {BusDevice, Topic, Message, ValueMessage, DBRequestMessage, SettingsMessage};

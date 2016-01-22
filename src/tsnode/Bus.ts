///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>
///<reference path="../../typings/node/node.d.ts"/>

import {Value} from "./Utils";
import {DBRequest} from "./DBAccess";

//Topic defines the Topic of a message. BusDevices subscribe to Topics
class Topic {
    private id:number;
    private name:string;
    static SPEED: Topic = new Topic(99, "Speed");

    //instantiates a new Topic with ID and name
    constructor(pID:number, pName:string) {
        if (pID < 0) {
            return null;
        }
        this.id = pID;
        this.name = pName;
    }

    public getID():number {
        return this.id
    }

    public equals(topic: Topic): boolean {
        return this.getID() === topic.getID();
    }

}

//super class for all Message Types
class Message {
    private topic:Topic;

    constructor(pTopic:Topic) {
        this.topic = pTopic;
    }

    public getTopic():Topic {
        return this.topic;
    }
}

//A BusDevice has acces to the Bus
class BusDevice {
    broker:Broker;
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


    private static instance:Broker;

    private emit = new EventEmitter();

    bds: Set<BusDevice>;
    private subscribers: Map<Topic, Set<BusDevice>>;

    constructor() {
        this.subscribers = new Map<Topic, Set<BusDevice>>();
    }

    public static get():Broker {
        if (Broker.instance == null || typeof Broker.instance == undefined) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    }

    public handleMessage(m: Message) {
        this.distribute(m);
    }


    public subscribe(topic:Topic, sub:BusDevice):void {
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new Set<BusDevice>());
            console.log('Set created');
        }
        console.log(sub);
        this.subscribers.get(topic).add(sub);


        console.log(this.subscribers.get(topic));

        this.emit.on('event', function() {
            console.log('ja');
        });



    }

    public unsubscribe(topic:Topic, sub:BusDevice):void {

        this.subscribers.get(topic).delete(sub);

    }

    private distribute(m:Message) {
        if (this.subscribers.get(m.getTopic()) == null) {
            console.log("serious");
            return;
        }

        var iter = this.subscribers.get(m.getTopic()).entries();

        var x;
        while((x = iter.next().value) != null) {
            x[0].handleMessage(m);
        }

    }
}

class ValueAnswerMessage extends Message {
    static TOPIC = new Topic(31, "Value answer message");
    private times: number[];
    private values: any[];
    constructor(pTopic: Topic, times: number[], values: any[]) {
        super(pTopic);
        this.times = times;
        this.values = values;
    }

    public getTimes(): number[] {
        return this.times;
    }
    public getValues(): any[] {
        return this.values;
    }
}

class ValueMessage extends Message {
    static TOPIC = new Topic(30, "Value message");
    private value: Value;
    constructor(pTopic: Topic, pValue: Value) {
        super(pTopic);
        this.value = pValue;
    }

    public getValue(): Value {
        return this.value;
    }
}

class DBRequestMessage extends Message {
    private req: DBRequest;
    static TOPIC = new Topic(10, "Database request message");

    constructor(pReq: DBRequest) {
        super(DBRequestMessage.TOPIC);
        this.req = pReq;
    }

    public getRequest():DBRequest {
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

    public getConfigs(): Map<Topic,Value> {
        return this.configs;
    }

}

export {BusDevice, Broker, Topic, Message, ValueMessage, DBRequestMessage, SettingsMessage, ValueAnswerMessage};

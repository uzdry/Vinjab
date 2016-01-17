import Value from "./Utils";
import DBReqest from "./Utils";

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
    private broker:Broker;
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


    constructor() {
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
        if (!this.subs[topic.getID()]) {
            this.subs[topic.getID()] = new Array<BusDevice>();
        }

        this.subs[topic.getID()].push(sub);

    }

    public unsubscribe(topic:Topic, sub:BusDevice):void {

        var index =  this.subs[topic.getID()].indexOf(sub, 0);
        if (index != undefined) {
            this.subs[topic.getID()].splice(index, 1);
        }

    }

    private distribute(m:Message) {

        for (var i in this.subs[m.getTopic().getID()]) {
            i.handleMessage();
        }

    }
}

class DBRequestMessage extends Message {
    private req: DBReqest;
    static TOPIC = new Topic(10, "Database request message");

    constructor(pReq: DBReqest) {
        super(DBRequestMessage.TOPIC);
        this.req = pReq;
    }
}

class SettingsMessage extends Message {
    static TOPIC = new Topic(20, "Settings message");

    constructor() {
        super(SettingsMessage.TOPIC);

    }
}

export {BusDevice, Topic, Message, DBRequestMessage};

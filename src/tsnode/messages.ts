
import * as Utils from "./Utils";

//Topic defines the Topic of a message. BusDevices subscribe to Topics
class Topic {

    static VALUE_MSG =          new Topic(10, "value message");
    static DBREQ_MSG =          new Topic(20, "database request message");
    static VALUE_ANSWER_MSG =   new Topic(30, "value answer message");
    static SETTINGS_MSG =       new Topic(40, "settings message");

    static SPEED =              new Topic(140, "speed");
    static MAF =                new Topic(350, "mass air flow");;
    static CO0LANT_PRESSURE =   new Topic(110, "coolant temperature");
    static FUEL_PRESSURE =      new Topic(120, "fuel pressure");
    static RPM =                new Topic(130, "RPM");
    static STEERING =           new Topic(150, "steering");
    static INTAKE_TEMP =        new Topic(160, "intake air temperature");
    static ENGINE_RUNTIME =     new Topic(170, "engine runtime");
    static FUEL =               new Topic(180, "fuel");
    static EGR_STATE =          new Topic(190, "exhaust gas recirculation state");
    static INJ_PRESSURE =       new Topic(200, "injection pressure State");
    static FPC_STATE =          new Topic(210, "fuel pressure control state");
    static GPV =                new Topic(220, "gas pressure vaporizer");
    static CAT_TEMP =           new Topic(230, "catalyst temperature");
    static THROTTLE =           new Topic(240, "throttle");
    static ACCELERATOR =        new Topic(250, "accelerator pedal position");
    static TEMP_OUT =           new Topic(260, "temperature outside");
    static TORQUE =             new Topic(270, "engine torque");
    static EGT =                new Topic(280, "exhaust gas temperature");
    static EGP =                new Topic(290, "exhaust gas pressure");
    static ULTRASONIC =         new Topic(300, "ultrasonic sensor distance");
    static AVG_FUEL =           new Topic(310, "average fuel consumption");
    static FUEL_CONSUMPTION =   new Topic(320, "fuel consumption");
    static MILEAGE =            new Topic(330, "mileage");
    static AVG_SPEED =          new Topic(340, "average speed");
    static FUEL_CONSUMPTION_H = new Topic(360, "fuel per hour")

    static VALUES: Topic[] = [     Topic.SPEED,
        Topic.MAF,
        Topic.CO0LANT_PRESSURE,
        Topic.FUEL_PRESSURE,
        Topic.RPM,
        Topic.STEERING,
        Topic.INTAKE_TEMP,
        Topic.ENGINE_RUNTIME,
        Topic.FUEL,
        Topic.EGR_STATE,
        Topic.INJ_PRESSURE,
        Topic.FPC_STATE,
        Topic.GPV,
        Topic.CAT_TEMP,
        Topic.THROTTLE,
        Topic.ACCELERATOR,
        Topic.TEMP_OUT,
        Topic.TORQUE,
        Topic.EGT,
        Topic.EGP,
        Topic.ULTRASONIC,
        Topic.AVG_FUEL,
        Topic.FUEL_CONSUMPTION,
        Topic.MILEAGE,
        Topic.AVG_SPEED,
        Topic.FUEL_CONSUMPTION_H];

    private id:number;
    private name:string;

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

class ValueAnswerMessage extends Message {
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
    public value: Utils.Value;
    constructor(pTopic: Topic, pValue: Utils.Value) {
        super(pTopic);
        this.value = pValue;
    }
}

class DBRequestMessage extends Message {
    private req: DBRequest;

    constructor(pReq: DBRequest) {
        super(Topic.DBREQ_MSG);
        this.req = pReq;
    }

    public getRequest():DBRequest {
        return this.req
    }
}

export {Topic, Message, ValueMessage, ValueAnswerMessage, DBRequestMessage};

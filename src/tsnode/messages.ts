

//Topic defines the Topic of a message. BusDevices subscribe to Topics
class Topic {

    static VALUE_MSG =          new Topic("value.*");
    static DBREQ_MSG =          new Topic("database request message");
    static VALUE_ANSWER_MSG =   new Topic("value answer message");
    static SETTINGS_MSG =       new Topic("settings message");

    static SPEED =              new Topic("value.speed");
    static MAF =                new Topic("value.mass air flow");
    static COOLANT_TEMP =       new Topic("value.coolant temperature");
    static FUEL_PRESSURE =      new Topic("value.fuel pressure");
    static RPM =                new Topic("value.RPM");
    static STEERING =           new Topic("value.steering");
    static INTAKE_TEMP =        new Topic("value.intake air temperature");
    static ENGINE_RUNTIME =     new Topic("value.engine runtime");
    static FUEL =               new Topic("value.fuel");
    static EGR_STATE =          new Topic("value.exhaust gas recirculation state");
    static INJ_PRESSURE =       new Topic("value.injection pressure State");
    static FPC_STATE =          new Topic("value.fuel pressure control state");
    static GPV =                new Topic("value.gas pressure vaporizer");
    static CAT_TEMP =           new Topic("value.catalyst temperature");
    static THROTTLE =           new Topic("value.throttle");
    static ACCELERATOR =        new Topic("value.accelerator pedal position");
    static TEMP_OUT =           new Topic("value.temperature outside");
    static TORQUE =             new Topic("value.engine torque");
    static EGT =                new Topic("value.exhaust gas temperature");
    static EGP =                new Topic("value.exhaust gas pressure");
    static ULTRASONIC =         new Topic("value.ultrasonic sensor distance");


    static FUEL_CONSUMPTION =   new Topic("value.aggregated.fuel consumption");
    static MILEAGE =            new Topic("value.aggregated.mileage");
    static FUEL_CONSUMPTION_H = new Topic("value.aggregated.fuel per hour");

    static AVG_FUEL =           new Topic("value.avg.aggregated.fuel consumption");
    static AVG_SPEED =          new Topic("value.avg.speed");

    static DASHBOARD_MSG =      new Topic("dashboard settings");
    static DASHBOARD_ANS_MSG =  new Topic("dashboard settings from database");
    static REPLAY_REQ =         new Topic("replay request");
    static REPLAY_ANS =         new Topic("replay answer");
    static REPLAY_INFO =        new Topic("replay information");

    static SETTINGS_REQ_MSG =   new Topic("settings request message");
    static SETTINGS_RSP_MSG =   new Topic("settings response message");

    static VALUES: Topic[] = [     Topic.SPEED,
        Topic.MAF,
        Topic.COOLANT_TEMP,
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
        Topic.FUEL_CONSUMPTION_H,

        Topic.SETTINGS_REQ_MSG,
        Topic.SETTINGS_RSP_MSG];

    name:string;

    //instantiates a new Topic with ID and name
    constructor(pName:string) {
        this.name = pName;
    }

    public getName(): string {
        return this.name
    }

    public equals(topic: Topic): boolean {
        return this.name === topic.name;
    }
}

//super class for all Message Types
class Message {
    topic:Topic;

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
    private ansTopic: Topic;
    constructor(top: Topic, times: number[], values: any[]) {
        super(Topic.VALUE_ANSWER_MSG);
        this.times = times;
        this.values = values;
        this.ansTopic = top;
    }

    public getTimes(): number[] {
        return this.times;
    }
    public getValues(): any[] {
        return this.values;
    }
    public getAnsTopic(): Topic {
        return this.ansTopic;
    }
}

class ValueMessage extends Message {
    public value: Value;
    constructor(pTopic: Topic, pValue: Value ) {
        super(pTopic);
        this.value= pValue;
    }
}

class ReplayInfoMessage extends Message {
    finishTime: number[];

    constructor(end: number[]) {
        super(Topic.REPLAY_INFO);
        this.finishTime = end;
    }
}

class DBRequestMessage extends Message {
    beginDate: Date;
    endDate: Date;
    driveNr: number;
    reqTopic: Topic;

    constructor (driveNr: number, beginDate: Date, endDate: Date, reqTopic: Topic) {
        super(Topic.DBREQ_MSG);
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.driveNr = driveNr;
        this.reqTopic = reqTopic;
    }
}

class ReplayRequestMessage extends Message {
    driveNr: number;
    callerID: string;
    //true <-> start, false <-> stop:
    startStop: boolean;

    constructor(driveNr: number, callerID: string, startStop: boolean) { //last param: true = start, false = stop
        super(Topic.REPLAY_REQ);
        this.driveNr = driveNr;
        this.callerID = callerID;
        this.startStop = startStop;
    }
}

class ReplayValueMessage extends Message {
    public valueMessage: ValueMessage;
    public caller: string;

    constructor(pValueMessage: ValueMessage, caller: string) {
        super(Topic.REPLAY_ANS);
        this.valueMessage= pValueMessage;
        this.caller = caller;
    }
}

class DashboardMessage extends Message {
    public request: boolean;
    public user: string;
    public config: string;

    constructor(usr: string, cnfg: string, req: boolean) {
        super(Topic.DASHBOARD_MSG);
        this.request = req;
        this.user = usr;
        this.config = cnfg;
    }
}

class DashboardRspMessage extends Message {
    public user: string;
    public config: string;

    constructor(usr: string, cnfg: string) {
        super(Topic.DASHBOARD_ANS_MSG);
        this.user = usr;
        this.config = cnfg;
    }
}

class Value {
    value: number;
    identifier: string;

    constructor(pValue:number, pID: string) {
        this.value = pValue;
        this.identifier = pID;
    }

    public numericalValue(): number {
        return this.value;
    }

    public getIdentifier(): string{
        return this.identifier;
    }

}

class SettingsRequestMessage extends Message {
    settings : string;
    // True if the value should be read from the database, false if it should be written to the database.
    readFromDB : boolean;

    constructor(settings : string, readFromDB : boolean) {
        super(Topic.SETTINGS_REQ_MSG);
        this.settings = settings;
        this.readFromDB = readFromDB;
    }
}

class SettingsResponseMessage extends Message {
    settings : string;

    constructor(settings : string) {
        super(Topic.SETTINGS_RSP_MSG);
        this.settings = settings;
    }
}

export {Topic, Message, ValueMessage, ReplayInfoMessage, ValueAnswerMessage, DBRequestMessage, ReplayValueMessage,
    ReplayRequestMessage, Value, DashboardMessage, DashboardRspMessage, SettingsRequestMessage, SettingsResponseMessage};

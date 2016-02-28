declare class Topic {
    static VALUE_MSG: Topic;
    static DBREQ_MSG: Topic;
    static VALUE_ANSWER_MSG: Topic;
    static SETTINGS_MSG: Topic;
    static SPEED: Topic;
    static MAF: Topic;
    static COOLANT_TEMP: Topic;
    static FUEL_PRESSURE: Topic;
    static RPM: Topic;
    static STEERING: Topic;
    static INTAKE_TEMP: Topic;
    static ENGINE_RUNTIME: Topic;
    static FUEL: Topic;
    static EGR_STATE: Topic;
    static INJ_PRESSURE: Topic;
    static FPC_STATE: Topic;
    static GPV: Topic;
    static CAT_TEMP: Topic;
    static THROTTLE: Topic;
    static ACCELERATOR: Topic;
    static TEMP_OUT: Topic;
    static TORQUE: Topic;
    static EGT: Topic;
    static EGP: Topic;
    static ULTRASONIC: Topic;
    static FUEL_CONSUMPTION: Topic;
    static MILEAGE: Topic;
    static FUEL_CONSUMPTION_H: Topic;
    static FUEL_CONSUMPTION_PHK: Topic;
    static AVG_FUEL: Topic;
    static AVG_SPEED: Topic;
    static DASHBOARD_MSG: Topic;
    static DASHBOARD_ANS_MSG: Topic;
    static REPLAY_REQ: Topic;
    static REPLAY_ANS: Topic;
    static REPLAY_INFO: Topic;
    static SETTINGS_REQ_MSG: Topic;
    static SETTINGS_RSP_MSG: Topic;
    static VALUES: Topic[];
    name: string;
    constructor(pName: string);
    getName(): string;
    equals(topic: Topic): boolean;
}
declare class Message {
    topic: Topic;
    constructor(pTopic: Topic);
    getTopic(): Topic;
}
declare class ValueAnswerMessage extends Message {
    private times;
    private values;
    private ansTopic;
    constructor(top: Topic, times: number[], values: any[]);
    getTimes(): number[];
    getValues(): any[];
    getAnsTopic(): Topic;
}
declare class ValueMessage extends Message {
    value: Value;
    constructor(pTopic: Topic, pValue: Value);
}
declare class ReplayInfoMessage extends Message {
    finishTime: number[];
    constructor(end: number[]);
}
declare class DBRequestMessage extends Message {
    beginDate: Date;
    endDate: Date;
    driveNr: number;
    reqTopic: Topic;
    constructor(driveNr: number, beginDate: Date, endDate: Date, reqTopic: Topic);
}
declare class ReplayRequestMessage extends Message {
    driveNr: number;
    callerID: string;
    startStop: boolean;
    constructor(driveNr: number, callerID: string, startStop: boolean);
}
declare class ReplayValueMessage extends Message {
    valueMessage: ValueMessage;
    caller: string;
    constructor(pValueMessage: ValueMessage, caller: string);
}
declare class DashboardMessage extends Message {
    request: boolean;
    user: string;
    config: string;
    constructor(usr: string, cnfg: string, req: boolean);
}
declare class DashboardRspMessage extends Message {
    user: string;
    config: string;
    constructor(usr: string, cnfg: string);
}
declare class Value {
    value: number;
    identifier: string;
    constructor(pValue: number, pID: string);
    numericalValue(): number;
    getIdentifier(): string;
}
declare class SettingsRequestMessage extends Message {
    settings: string;
    readFromDB: boolean;
    constructor(settings: string, readFromDB: boolean);
}
declare class SettingsResponseMessage extends Message {
    settings: string;
    constructor(settings: string);
}

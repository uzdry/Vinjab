/**
 * Created by yimeng on 28/01/16.
 */
declare class OBDReader{

    public constructor();

    //public dataRecieved: (data: Reply)=> void;

    getPIDByName(Name): string;

    parseOBDCommand(hexString) : Reply;

    autoconnect(query: string) : string;

    connect(address : string, channel: number): void;

    disconnect():void;

    write(message:string, replies:number):void;

    requestValueByName(name:string):void;

    addPoller(name:string):void;

    removePoller(name:string):void;

    removeAllPollers():void;

    writePollers():void;

    startPolling(interval? : number):void;

    stopPolling():void;

    on( event: string, fn: Function ): void;
}

/**
 * The Reply Object from the OBD
 */
declare interface Reply {
    /**
     * The value that is already converted. This can be a PID converted answer or "OK" or "NO DATA".
     */
    value : string;

    /**
     * The name. --! Only if the reply is a PID.
     */
    name : string;

    /**
     * The mode of the PID. --! Only if the reply is a PID.
     */
    mode : string;

    /**
     * The PID. --! Only if the reply is a PID.
     */
    pid : string;
}



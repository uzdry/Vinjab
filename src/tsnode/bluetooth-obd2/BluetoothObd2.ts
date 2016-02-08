/**
 * Created by yimeng on 29/01/16.
 */
///<reference path= "../../../typings/bluetooth-obd2/bluetooth-obd2.d.ts" />
import {BusDevice} from "./../Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./../messages";

class BluetoothObd2 extends BusDevice{

    /**
     * the OBDReader Object to find OBD-Device and receive data
     */
    private btOBDReader:OBDReader;

    /**
     * the Object, which contains the data from OBD
     */
    private dataReceivedMarker;

    constructor() {
        super();

        var OBDReader = require('bluetooth-obd');
        this.btOBDReader = new OBDReader();
        this.dataReceivedMarker = {};

        //if the obd device is connected, request the speed value for every second.
        this.btOBDReader.on('connected', function () {

            //vss = vehicle speed sensor
            //this.btOBDReader.requestValueByName("vss");
            this.addPoller("vss");

            //Request all values each second.
            this.startPolling(1000);
        });

        this.btOBDReader.on('error', function (error) {
            console.log(error);
        })

        this.btOBDReader.on('debug', function (data) {
            console.log('Debug: ' + data);
        });

        //receive the data from OBD
        this.btOBDReader.on('dataReceived', function (data) {
            console.log(JSON.stringify(data));
            //this.handleMessage(data);
        });

        // Use first device with 'obd' in the name
        this.btOBDReader.autoconnect('obd');

        //this.handleMessage()
    }

    /**
     * if a new value with pidName is asked for, then add the poller with this pidName
     * @param pidName the name of the asked parameter
     */
    public askForValue(pidName: string) : void {
        this.btOBDReader.addPoller(pidName);
    }


    //public handleMessage(m : Message): void {
    //    this.broker.handleMessage(m);
    //}


}

export{BluetoothObd2};
var obd = new BluetoothObd2();






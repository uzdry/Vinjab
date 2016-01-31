/**
 * Created by yimeng on 29/01/16.
 */
///<reference path= "../../../typings/bluetooth-obd2/bluetooth-obd2.d.ts" />
import {BusDevice} from "./../Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./../messages";

class BluetoothObd2 {

    /**
     * the OBDReader Object to find OBD-Device and receive data
     */
    private btOBDReader:OBDReader;

    /**
     * the Object, which contains the data from OBD
     */
    private dataReceivedMarker;

    constructor() {
        var OBDReader = require('bluetooth-obd');
        this.btOBDReader = new OBDReader();
        this.dataReceivedMarker = {};

        //if the obd device is connected, request the speed value for every second.
        this.btOBDReader.on('connected', function () {

            //vss = vehicle speed sensor
            this.btOBDReader.requestValueByName("vss");
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
            console.log(data);
            this.dataReceivedMarker = data;
            //this.handleMessage();
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


//    public handleMessage(): void {
//        postal.publish({
//            channel : "MyChannel",
//            topic   : "name.change",
//            data    : {
//                message : JSON.stringify(this.dataReceivedMarker)
//            }


}
var obd = new BluetoothObd2();






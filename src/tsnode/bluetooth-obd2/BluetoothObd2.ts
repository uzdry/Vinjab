/**
 * Created by yimeng on 29/01/16.
 */
///<reference path= "../../../typings/bluetooth-obd2/bluetooth-obd2.d.ts" />
import {BusDevice} from "./../Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./../messages";

class BluetoothObd2 {

    private btOBDReader : OBDReader;
    private dataReceivedMarker;

    constructor(){
        var OBDReader = require('bluetooth-obd');
        this.btOBDReader = new OBDReader();
        this.dataReceivedMarker = {};
        this.btOBDReader.on('connected', function () {
            //this.requestValueByName("vss"); //vss = vehicle speed sensor

            this.addPoller("vss");
            this.addPoller("rpm");
            this.addPoller("temp");
            this.addPoller("load_pct");
            this.addPoller("map");
            this.addPoller("frp");

            this.startPolling(1000); //Request all values each second.
        });

        this.btOBDReader.on('dataReceived', function (data) {
            console.log(data);
            this.dataReceivedMarker = data;
        });

    // Use first device with 'obd' in the name
        this.btOBDReader.autoconnect('obd');
    }



    public handleMessage(m: Message): void {
        postal.publish({
            channel : "MyChannel",
            topic   : "name.change",
            data    : {
                name : JSON.parse(this.dataReceivedMarker)
            }
        })
    }
}

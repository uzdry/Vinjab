/**
 * Created by yimeng on 29/01/16.
 */
///<reference path= "../../../typings/bluetooth-obd2/bluetooth-obd2.d.ts" />
import {BusDevice} from "./../Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Value, Topic} from "./../messages";


class BluetoothObd2 extends BusDevice{

    static counter = 0;
    static array = [
    'ATZ',
    'ATD',
    'ATAL',
    'ATAT2',
    'ATH0',
    'ATE0',
    'ATE0',
    'ATRV',
    'ATSPA6',
    '0100',
    '0100',
    'ATDPN',
    'ATDP',
    '0103',
    '0107',
    'ATH1',
    'ATH0',
    '010A',
    '010C',
    '010D',
    '010F',
    '0110',
    '010F',
    '0111',
    '012F',
    '013C',
    '0146',
    '0149',
    '0163',
    '0167',
    '016B',
    '0173',
    ];
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

            this.write(BluetoothObd2.array[BluetoothObd2.counter]);
            BluetoothObd2.counter++;

        });

        this.btOBDReader.on('error', function (error) {
            console.log(error);
        });

        this.btOBDReader.on('debug', function (data) {
            console.log('Debug: ' + data);
        });

        var broker = this.broker;

        //receive the data from OBD
        this.btOBDReader.on('dataReceived', function (data) {
            var dataString = JSON.stringify(data);
            console.log("output: " + dataString);



            if(Object.keys(data).length === 0) return;

            var value: ValueMessage;
            switch(data.pid) {
                case '0A': value = new ValueMessage(Topic.FUEL_PRESSURE, new Value(data.value, "bar"));break;
                case '0C': value = new ValueMessage(Topic.RPM, new Value(data.value, "rpm"));           break;
                case '0D': value = new ValueMessage(Topic.SPEED, new Value(data.value, "km/h"));        break;
                case '0F': value = new ValueMessage(Topic.INTAKE_TEMP, new Value(data.value, "C"));     break;
                case '10': value = new ValueMessage(Topic.MAF, new Value(data.value, "grams/sec"));     break;
                case '11': value = new ValueMessage(Topic.THROTTLE, new Value(data.value, "percent"));        break;
                case '1F': value = new ValueMessage(Topic.ENGINE_RUNTIME, new Value(data.value, "s"));  break;
                case '2F': value = new ValueMessage(Topic.FUEL, new Value(data.value, "percent"));            break;
                case '3C': value = new ValueMessage(Topic.CAT_TEMP, new Value(data.value, "C"));        break;
                case '46': value = new ValueMessage(Topic.TEMP_OUT, new Value(data.value, "C"));        break;
                case '49': value = new ValueMessage(Topic.ACCELERATOR, new Value(data.value, "percent"));     break;
                case '63': value = new ValueMessage(Topic.TORQUE, new Value(data.value, "NM"));         break;
                case '67': value = new ValueMessage(Topic.COOLANT_TEMP, new Value(data.value, "C"));    break;
                case '6B': value = new ValueMessage(Topic.EGT, new Value(data.value, "C"));             break;
                case '73': value = new ValueMessage(Topic.EGP, new Value(data.value, "bar"));           break;
                default : value = new ValueMessage(Topic.TORQUE, new Value(0, "nr")); break;
            }

            broker.handleMessage(value);

            this.write(BluetoothObd2.array[BluetoothObd2.counter]);
            console.log('obd command: ' + BluetoothObd2.array[BluetoothObd2.counter]);
                if (BluetoothObd2.counter < BluetoothObd2.array.length - 1) {
                    BluetoothObd2.counter++;
                } else {
                    BluetoothObd2.counter = BluetoothObd2.counter - 14;
                }


        });

        // Use first device with 'obd' in the name
        this.btOBDReader.autoconnect('obd');
    }


    /**
     * put the message on the bus
     * @param message the message to be put on the bus
     */
    public handleMessage(message:Message) : void {
    }



}

export {BluetoothObd2};






/**
 * Created by yimeng on 29/01/16.
 */
///<reference path= "../../../typings/bluetooth-obd2/bluetooth-obd2.d.ts" />
import {BusDevice} from "./../Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./../messages";
import {write} from "fs";

var counter = 0;
var array = [
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
    '03',
    '07',
    '0100',
    '0900',
    '0100',
    'ATH1',
    '0100',
    'ATH0',
    '0100',
    '0120',
    '0100',
    '0101',
    '0102',
    '0103',
    '0104',
    '0105',
    '0106',
    '0107',
    '0108',
    '0109',
    '010A',
    '010B',
    '010C',
    '010D',
    '01OE',
    '010F',
    '0110',
    '0111',
];


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

            this.write(array[counter]);
            counter++;

        });

        this.btOBDReader.on('error', function (error) {
            console.log(error);
        });

        this.btOBDReader.on('debug', function (data) {
            console.log('Debug: ' + data);
        });

        //receive the data from OBD
        this.btOBDReader.on('dataReceived', function (data) {
            var dataString = JSON.stringify(data);
            console.log("output: " + dataString);

            var recievedMessage = this.receivedDataToMessage(data);
            this.hanleMessage(recievedMessage);

            if(Object.keys(data).length === 0) return;

                if (counter < array.length - 1) {

                    this.write(array[counter]);
                    counter++;
                } else {

                    this.write(array[counter]);
                    counter = counter - 17;
                }


        });

        // Use first device with 'obd' in the name
        this.btOBDReader.autoconnect('obd');
    }

    /**
     * capsule the recieved data as a value message object
     * @param data the data recieved from OBD2
     * @returns {ValueMessage} the corresponding value message object
     */
    private receivedDataToMessage(data) : ValueMessage {
        var value: ValueMessage;
        switch(data.pid) {
            case '01': value = new ValueMessage(Topic.ENGINE_RUNTIME, data.value);break;
            case '0A': value = new ValueMessage(Topic.FUEL_PRESSURE, data.value);break;
            case '0C': value = new ValueMessage(Topic.RPM, data.value);break;
            case '0D': value = new ValueMessage(Topic.SPEED, data.value);break;
            case '0E': value = new ValueMessage(Topic.ENGINE_RUNTIME, data.value);break;
            case '0F': value = new ValueMessage(Topic.INTAKE_TEMP, data.value);break;
            case '11': value = new ValueMessage(Topic.THROTTLE, data.value);break;
            case '3C': value = new ValueMessage(Topic.CAT_TEMP, data.value);break;
            case '46': value = new ValueMessage(Topic.TEMP_OUT, data.value);break;
            case '5A': value = new ValueMessage(Topic.ACCELERATOR, data.value);break;
            case '5E': value = new ValueMessage(Topic.FUEL, data.value);break;
            case '54': value = new ValueMessage(Topic.GPV, data.value);break;
            case '62': value = new ValueMessage(Topic.TORQUE, data.value);break;
            case '66': value = new ValueMessage(Topic.MAF, data.value);break;
            case '67': value = new ValueMessage(Topic.COOLANT_TEMP, data.value);break;
            case '6B': value = new ValueMessage(Topic.EGR_STATE, data.value);break;
            case '6E': value = new ValueMessage(Topic.INJ_PRESSURE, data.value);break;
            case '6D': value = new ValueMessage(Topic.FPC_STATE, data.value);break;
            case '78': value = new ValueMessage(Topic.EGT, data.value);break;
            case '73': value = new ValueMessage(Topic.EGP, data.value);break;
            default : break;
        }
        return value;
    }

    /**
     * put the message on the bus
     * @param message the message to be put on the bus
     */
    public hanleMessage(message:Message) : void {
        this.broker.handleMessage(message);
    }



}

export {BluetoothObd2};

var obd = new BluetoothObd2();






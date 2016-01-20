/**
 * Created by yimeng on 17/01/16.
 */
/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

import * as Bus from "./Bus";
import socketIO = require('socket.io');

export class Proxy extends Bus.BusDevice {

    private address:string;

    constructor(address:string) {
        super();
        this.address = address;
    }

    public handleMessage(m:Bus.Message):void {
        var content = m.getTopic();
        sendMessage(JSON.stringify(content));
    }

}


function sendMessage(content:string) {
    var io = socketIO.listen(80);
    var chat = io
        .of('/chat')
        .on('connection', function (socket) {
            socket.emit('message', content);
        });
}

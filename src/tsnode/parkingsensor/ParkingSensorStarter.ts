
/**
 * @author David G.
 */

/// <reference path="./../settings/SettingsData.ts"/>
/// <reference path="./PSGUI.ts"/>
/// <reference path="../../../typings/postal/postal.d.ts"/>


import {Topic} from "../messages";
import {Message} from "../messages";
import {DashboardRspMessage} from "../messages";
import {DashboardMessage} from "../messages";
import {DBRequestMessage} from "../messages";
import {SettingsRequestMessage} from "../messages";
import {SettingsResponseMessage} from "../messages";


class ParkingSensorStarter {

    private rcvFlags : number = 0;
    private cvb : PSGUI.CameraValuesBuffer = new PSGUI.CameraValuesBuffer();
    private cp : PSGUI.CarParameters = new PSGUI.CarParameters();
    private mysub = null;

    start() {
        var reqmsg1 = new SettingsData.SettingsData(null, true, false);
        this.mysub = postal.channel(PSConstants.db2psChannel).subscribe(PSConstants.db2psTopic, this.onMessageReceived.bind(this));
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic,
            new SettingsRequestMessage(reqmsg1.stringifyMe(), true));
    }

    onMessageReceived(data) : void {
        var msg = SettingsData.SettingsData.parseMe(data.settings);

        var tpc = "settings.parkingsensor.camera.posx";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);

        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraPositionX = buf.getValue();
            this.rcvFlags |= 1;
        }

        tpc = "settings.parkingsensor.camera.posy";
        buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraPositionY = buf.getValue();
            this.rcvFlags |= 2;
        }

        var tpc = "settings.parkingsensor.camera.posz";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraPositionZ = buf.getValue();
            this.rcvFlags |= 4;
        }

        var tpc = "settings.parkingsensor.camera.rotx";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraRotationX = buf.getValue();
            this.rcvFlags |= 8;
        }

        var tpc = "settings.parkingsensor.camera.roty";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraRotationY = buf.getValue();
            this.rcvFlags |= 16;
        }

        var tpc = "settings.parkingsensor.camera.rotz";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraRotationZ = buf.getValue();
            this.rcvFlags |= 32;
        }

        var tpc = "settings.parkingsensor.camera.hres";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraResolutionHorizontal = buf.getValue();
            this.rcvFlags |= 64;
        }

        var tpc = "settings.parkingsensor.camera.vres";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraResolutionVertical = buf.getValue();
            this.rcvFlags |= 128;
        }

        var tpc = "settings.parkingsensor.camera.haov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraHorizontalAOV = buf.getValue();
            this.rcvFlags |= 256;
        }

        var tpc = "settings.parkingsensor.camera.vaov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraVerticalAOV = buf.getValue();
            this.rcvFlags |= 512;
        }


        var tpc = "settings.parkingsensor.camera.vaov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraVerticalAOV = buf.getValue();
            this.rcvFlags |= 512;
        }


        var tpc = "settings.car.wheelbase";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cp.wheelBase = buf.getValue();
            this.rcvFlags |= 1024;
        }

        var tpc = "settings.car.axletrack";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cp.track = buf.getValue();
            this.rcvFlags |= 2048;
        }

        var tpc = "settings.car.steeringratio";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cp.steeringRatio = buf.getValue();
            this.rcvFlags |= 4096;
        }

        var tpc = "settings.car.steeringratio";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            // Nothing happens, only acknowledge.
            this.rcvFlags |= 8192;
        }

        if (this.rcvFlags == 16383) {
            this.mysub.unsubscribe();
            PSGUI.Starter.start(this.cvb, this.cp);
        }
    }

    private static getContainer(msg : SettingsData.SettingsData, topic : string) : SettingsData.SettingsContainer {
        return msg.getValueOf(topic);
    }
}

class PSConstants {
    public static ps2dbChannel = "settingsREQ";
    public static db2psChannel = "values";

    public static ps2dbTopic = "settings request message";
    public static db2psTopic = "settings response message";

}

var ps : ParkingSensorStarter = new ParkingSensorStarter();
ps.start();


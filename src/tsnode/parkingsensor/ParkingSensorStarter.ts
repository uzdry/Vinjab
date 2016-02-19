
/**
 * @author David G.
 */

/// <reference path="./Debug.ts"/>
/// <reference path="./Communicator.ts"/>
/// <reference path="./../settings/SettingsMessageCommon.ts"/>
/// <reference path="./../settings/SettingsMessageClient.ts"/>
/// <reference path="./../settings/SettingsMessageInterface.ts"/>
/// <reference path="../../../typings/postal/postal.d.ts"/>

class ParkingSensorStarter {

    private rcvFlags : number = 0;
    private cvb : Debug.CameraValuesBuffer = new Debug.CameraValuesBuffer();
    dbg_init() {
        var db : DummyDatabase = new DummyDatabase();
    }

    start() {
        var camPosX = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.posx", null,
            true);
        var camPosY = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.posy", null,
            true);
        var camPosZ = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.posz", null,
            true);
        var camRotX = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.rotx", null,
            true);
        var camRotY = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.roty", null,
            true);
        var camRotZ = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.rotz", null,
            true);
        var camHRes = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.hres", null,
            true);
        var camVRes = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.vres", null,
            true);
        var camHAOV = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.haov", null,
            true);
        var camVAOV = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.vaov", null,
            true);

        var reqmsg1 = new SettingsMessageClient.SettingsMessage(camPosX, false);
        var reqmsg2 = new SettingsMessageClient.SettingsMessage(camPosY, false);
        var reqmsg3 = new SettingsMessageClient.SettingsMessage(camPosZ, false);
        var reqmsg4 = new SettingsMessageClient.SettingsMessage(camRotX, false);
        var reqmsg5 = new SettingsMessageClient.SettingsMessage(camRotY, false);
        var reqmsg6 = new SettingsMessageClient.SettingsMessage(camRotZ, false);
        var reqmsg7 = new SettingsMessageClient.SettingsMessage(camHRes, false);
        var reqmsg8 = new SettingsMessageClient.SettingsMessage(camVRes, false);
        var reqmsg9 = new SettingsMessageClient.SettingsMessage(camHAOV, false);
        var reqmsg10 = new SettingsMessageClient.SettingsMessage(camVAOV, false);
        postal.channel(PSConstants.db2psChannel).subscribe(PSConstants.db2psTopic, this.onMessageReceived.bind(this));
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg1);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg2);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg3);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg4);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg5);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg6);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg7);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg8);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg9);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg10);
    }

    onMessageReceived(data) : void {
        var msg = (<SettingsMessageClient.SettingsMessage>data);

        var tpc = "posx";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);

        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraPositionX = buf.getValue().numericalValue();
            this.rcvFlags |= 1;
        } else {
            this.onError(tpc);
        }

        tpc = "posy";
        buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraPositionY = buf.getValue().numericalValue();
            this.rcvFlags |= 2;
        } else {
            this.onError(tpc);
        }

        var tpc = "posz";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraPositionZ = buf.getValue().numericalValue();
            this.rcvFlags |= 4;
        } else {
            this.onError(tpc);
        }

        var tpc = "rotx";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraRotationX = buf.getValue().numericalValue();
            this.rcvFlags |= 8;
        } else {
            this.onError(tpc);
        }

        var tpc = "roty";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraRotationY = buf.getValue().numericalValue();
            this.rcvFlags |= 16;
        } else {
            this.onError(tpc);
        }

        var tpc = "rotz";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraRotationZ = buf.getValue().numericalValue();
            this.rcvFlags |= 32;
        } else {
            this.onError(tpc);
        }

        var tpc = "hres";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraResolutionHorizontal = buf.getValue().numericalValue();
            this.rcvFlags |= 64;
        } else {
            this.onError(tpc);
        }

        var tpc = "vres";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraResolutionVertical = buf.getValue().numericalValue();
            this.rcvFlags |= 128;
        } else {
            this.onError(tpc);
        }

        var tpc = "haov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraHorizontalAOV = buf.getValue().numericalValue();
            this.rcvFlags |= 256;
        } else {
            this.onError(tpc);
        }

        var tpc = "vaov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            this.cvb.cameraVerticalAOV = buf.getValue().numericalValue();
            this.rcvFlags |= 512;
        } else {
            this.onError(tpc);
        }

        if (this.rcvFlags == 1023) {
            Debug.Starter.start(this.cvb);
        }
    }

    private onError(topic : string) : void {
        //var div = document.createElement("div");
        //div.innerHTML = "Error, topic: " + "settings.parkingsensor.camera." + topic + " has not been found in the database.";
        //document.getElementById("divPS").appendChild(div);
    }

    private static getContainer(msg : SettingsMessageClient.SettingsMessage, topic : string) : SettingsMessageInterface.ISettingsContainer {
        var topicBuf = "settings.parkingsensor.camera." + topic;
        if (msg.getContainer().getTopic() == topicBuf) {
            return msg.getContainer();
        }
        return null;
    }
}


class DummyDatabase {

    private dbinf:SettingsDBCOM.ExampleDatabaseInterface;


    public constructor() {

        //SettingsDBCOM.LowLevelDatabaseEmulator.clearDB();

        this.dbinf = new SettingsDBCOM.ExampleDatabaseInterface(new SettingsMessageClient.SpecimenFactory());


        var pch = postal.channel(PSConstants.ps2dbChannel);
        pch.subscribe(PSConstants.ps2dbTopic, this.postal_handleMessage.bind(this));
    }

    public postal_handleMessage(data):void {
        var answer = this.dbinf.handleSettingsMessage(data);
        if (answer != null) {
            var pch = postal.channel(PSConstants.db2psChannel);
            for (var i = 0; i < answer.length; i++) {
                var ans = answer[i];
                pch.publish(PSConstants.db2psTopic, ans);
            }
        }
    }
}


class DBInitializer {
    public static init() {

        var topic1 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.posx");
        var value1 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc1 = new SettingsMessageCommon.SettingsContainer(topic1.getName(), value1,
            false);

        var topic2 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.posy");
        var value2 = new SettingsMessageClient.SettingsValue(800, 'valueName');
        var sc2 = new SettingsMessageCommon.SettingsContainer(topic2.getName(), value2,
            false);

        var topic3 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.posz');
        var value3 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc3 = new SettingsMessageCommon.SettingsContainer(topic3.getName(), value3,
            false);

        var topic4 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.rotx");
        var value4 = new SettingsMessageClient.SettingsValue(20, 'valueName');
        var sc4 = new SettingsMessageCommon.SettingsContainer(topic4.getName(), value4,
            false);

        var topic5 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.roty");
        var value5 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc5 = new SettingsMessageCommon.SettingsContainer(topic5.getName(), value5,
            false);

        var topic6 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.rotz');
        var value6 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc6 = new SettingsMessageCommon.SettingsContainer(topic6.getName(), value6,
            false);


        var topic7 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.hres");
        var value7 = new SettingsMessageClient.SettingsValue(640, 'valueName');
        var sc7 = new SettingsMessageCommon.SettingsContainer(topic7.getName(), value7,
            false);

        var topic8 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.vres');
        var value8 = new SettingsMessageClient.SettingsValue(480, 'valueName');
        var sc8 = new SettingsMessageCommon.SettingsContainer(topic8.getName(), value8,
            false);

        var topic9 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.haov");
        var value9 = new SettingsMessageClient.SettingsValue(106, 'valueName');
        var sc9 = new SettingsMessageCommon.SettingsContainer(topic9.getName(), value9,
            false);

        var topic10 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.vaov');
        var value10 = new SettingsMessageClient.SettingsValue(90, 'valueName');
        var sc10 = new SettingsMessageCommon.SettingsContainer(topic10.getName(), value10,
            false);

        var settingsMessage1 = new SettingsMessageClient.SettingsMessage(sc1, false);
        var settingsMessage2 = new SettingsMessageClient.SettingsMessage(sc2, false);
        var settingsMessage3 = new SettingsMessageClient.SettingsMessage(sc3, false);
        var settingsMessage4 = new SettingsMessageClient.SettingsMessage(sc4, false);
        var settingsMessage5 = new SettingsMessageClient.SettingsMessage(sc5, false);
        var settingsMessage6 = new SettingsMessageClient.SettingsMessage(sc6, false);
        var settingsMessage7 = new SettingsMessageClient.SettingsMessage(sc7, false);
        var settingsMessage8 = new SettingsMessageClient.SettingsMessage(sc8, false);
        var settingsMessage9 = new SettingsMessageClient.SettingsMessage(sc9, false);
        var settingsMessage10 = new SettingsMessageClient.SettingsMessage(sc10, false);

        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage1);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage2);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage3);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage4);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage5);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage6);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage7);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage8);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage9);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage10);
    }
}

class PSConstants {
    public static db2psChannel = "parkingsensorintern_db2ps";
    public static db2psTopic = "parkingsensorintern_db2ps";
    public static ps2dbChannel = "parkingsensorintern_ps2db";
    public static ps2dbTopic = "parkingsensorintern_ps2db";

}

var ps : ParkingSensorStarter = new ParkingSensorStarter();
ps.dbg_init();
DBInitializer.init();
ps.start();


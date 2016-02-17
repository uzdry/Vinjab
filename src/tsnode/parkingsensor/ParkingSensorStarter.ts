
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

    dbg_init() {
        var db : DummyDatabase = new DummyDatabase();
    }

    start() {
        var camPosX = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.posx", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camPosY = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.posy", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camPosZ = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.posz", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camRotX = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.rotx", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camRotY = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.roty", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camRotZ = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.rotz", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camHRes = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.hres", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camVRes = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.vres", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camHAOV = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.haov", null,
            SettingsMessageCommon.SettingsIODirection.read);
        var camVAOV = new SettingsMessageCommon.SettingsContainer("settings.parkingsensor.camera.vaov", null,
            SettingsMessageCommon.SettingsIODirection.read);

        var reqmsg = new SettingsMessageClient.SettingsMessage([camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ,
            camHRes, camVRes, camHAOV, camVAOV], false);
        postal.channel(PSConstants.db2psChannel).subscribe(PSConstants.db2psTopic, this.onMessageReceived.bind(this));
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, reqmsg);
    }

    onMessageReceived(data) : void {
        var msg = (<SettingsMessageClient.SettingsMessage>data);

        var tpc = "posx";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);

        var cvb = new Debug.CameraValuesBuffer();

        if (buf != null && buf.getValue() != null) {
            cvb.cameraPositionX = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        tpc = "posy";
        buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraPositionY = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "posz";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraPositionZ = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "rotx";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraRotationX = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "roty";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraRotationY = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "rotz";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraRotationZ = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "hres";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraResolutionHorizontal = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "vres";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraResolutionVertical = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "haov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraHorizontalAOV = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        var tpc = "vaov";
        var buf = ParkingSensorStarter.getContainer(msg, tpc);
        if (buf != null && buf.getValue() != null) {
            cvb.cameraVerticalAOV = buf.getValue().numericalValue();
        } else {
            this.onError(tpc);
        }

        Debug.Starter.start(cvb);
    }

    private onError(topic : string) : void {
        var div = document.createElement("div");
        div.innerHTML = "Error, topic: " + "settings.parkingsensor.camera." + topic + " has not been found in the database.";
        document.getElementById("divPS").appendChild(div);
    }

    private static getContainer(msg : SettingsMessageClient.SettingsMessage, topic : string) : SettingsMessageInterface.ISettingsContainer {
        var topicBuf = "settings.parkingsensor.camera." + topic;
        for (var i = 0; i < msg.getContainers().length; i++) {
            if (msg.getContainers()[i].getTopic() == topicBuf) {
                return msg.getContainers()[i];
            }
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
            pch.publish(PSConstants.db2psTopic, answer);
        }
    }
}


class DBInitializer {
    public static init() {

        var topic1 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.posx");
        var value1 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc1 = new SettingsMessageCommon.SettingsContainer(topic1.getName(), value1,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic2 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.posy");
        var value2 = new SettingsMessageClient.SettingsValue(800, 'valueName');
        var sc2 = new SettingsMessageCommon.SettingsContainer(topic2.getName(), value2,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic3 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.posz');
        var value3 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc3 = new SettingsMessageCommon.SettingsContainer(topic3.getName(), value3,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic4 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.rotx");
        var value4 = new SettingsMessageClient.SettingsValue(20, 'valueName');
        var sc4 = new SettingsMessageCommon.SettingsContainer(topic4.getName(), value4,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic5 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.roty");
        var value5 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc5 = new SettingsMessageCommon.SettingsContainer(topic5.getName(), value5,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic6 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.rotz');
        var value6 = new SettingsMessageClient.SettingsValue(0, 'valueName');
        var sc6 = new SettingsMessageCommon.SettingsContainer(topic6.getName(), value6,
            SettingsMessageCommon.SettingsIODirection.write);


        var topic7 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.hres");
        var value7 = new SettingsMessageClient.SettingsValue(640, 'valueName');
        var sc7 = new SettingsMessageCommon.SettingsContainer(topic7.getName(), value7,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic8 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.vres');
        var value8 = new SettingsMessageClient.SettingsValue(480, 'valueName');
        var sc8 = new SettingsMessageCommon.SettingsContainer(topic8.getName(), value8,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic9 = new SettingsMessageClient.STopic("settings.parkingsensor.camera.haov");
        var value9 = new SettingsMessageClient.SettingsValue(106, 'valueName');
        var sc9 = new SettingsMessageCommon.SettingsContainer(topic9.getName(), value9,
            SettingsMessageCommon.SettingsIODirection.write);

        var topic10 = new SettingsMessageClient.STopic('settings.parkingsensor.camera.vaov');
        var value10 = new SettingsMessageClient.SettingsValue(90, 'valueName');
        var sc10 = new SettingsMessageCommon.SettingsContainer(topic10.getName(), value10,
            SettingsMessageCommon.SettingsIODirection.write);

        var settingsMessage = new SettingsMessageClient.SettingsMessage([sc1, sc2, sc3, sc4, sc5, sc6, sc7, sc8, sc9, sc10], false);
        postal.channel(PSConstants.ps2dbChannel).publish(PSConstants.ps2dbTopic, settingsMessage);
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


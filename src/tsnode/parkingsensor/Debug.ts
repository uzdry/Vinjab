/**
 * @author David G.
 */


///<reference path="ARFactory.ts"/>
///<reference path="Communicator.ts"/>
///<reference path="Geometry.ts"/>
///<reference path="XMLParser.ts"/>
///<reference path="./drawer/PolygonDrawer.ts"/>


var mydomsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

var myisvg = ARFactory.Drawer.createEmptySVG(mydomsvg);

module Debug {

    export class CameraValuesBuffer {
        public cameraPositionX : number = 0;
        public cameraPositionY : number = 16;
        public cameraPositionZ : number = 0;

        public cameraRotationX : number = 90;
        public cameraRotationY : number = 0;
        public cameraRotationZ : number = 0;

        public cameraResolutionHorizontal : number = 640;
        public cameraResolutionVertical : number = 480;

        public cameraHorizontalAOV : number = 106;
        public cameraVerticalAOV : number = 90;
    }

    export class CarParameters {
        public static wheelBase : number = 4000;
        public static track : number = 1400;
        public static steeringRatio : number = 20;
        public static steeringWheelAngle : number = 0;
    }


    export enum DebugGUIMode {
        simpleCircle, tracks, kitLogo
    }
    export class DebugGUI implements Communicator.PComListener {

        private cameraValuesBuffer : Debug.CameraValuesBuffer;
        private mode : DebugGUIMode;

        constructor(cameraValuesBuffer : Debug.CameraValuesBuffer) {
            this.cameraValuesBuffer = cameraValuesBuffer;
        }
        public onMessageReceived(data) {
            CarParameters.steeringWheelAngle = data.value.value;
            this.redrawTracks();
        }

        public getCameraValuesBuffer() {
            return this.cameraValuesBuffer;
        }

        public setMode(mode : DebugGUIMode) {
            this.mode = mode;
        }


        public redrawTracks() {

            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(this.cameraValuesBuffer.cameraRotationX / 180 * Math.PI),
                new Geometry.Angle(this.cameraValuesBuffer.cameraRotationY / 180 * Math.PI), new Geometry.Angle(this.cameraValuesBuffer.cameraRotationZ / 180 * Math.PI));

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([this.cameraValuesBuffer.cameraPositionX,
                this.cameraValuesBuffer.cameraPositionY, this.cameraValuesBuffer.cameraPositionZ]);

            // Camera Horizontal and Vertical Angle Of View.
            var cameraHAOV : Geometry.Angle = new Geometry.Angle(this.cameraValuesBuffer.cameraHorizontalAOV / 180 * Math.PI);
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(this.cameraValuesBuffer.cameraVerticalAOV / 180 * Math.PI);

            // Camera horizontal and vertical resolution.
            var cameraResolution : Geometry.Vec2 = new Geometry.Vec2(this.cameraValuesBuffer.cameraResolutionHorizontal, this.cameraValuesBuffer.cameraResolutionVertical);

            var camera : Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            var world : Visualization.World = new Visualization.World(camera);



            var cnormal = new Geometry.Vec3([0, 1, 0]);
            var cfill = null;
            var cstroke = new Format.RGB(128, 255, 0);
            var cstrokewidth = 10;
            var cformat = new Format.FormatContainer(cfill, cstroke, cstrokewidth, "");

            var steeringWheelAngleRad = CarParameters.steeringWheelAngle / 180 * Math.PI;
            if (steeringWheelAngleRad == 0) {
                // No circle needs to be drawn, only two parallel lines.

                world.addPolygon(new Primitive.Polygon([new Geometry.Vec3([CarParameters.track / 2, 0, 0]), new Geometry.Vec3([CarParameters.track / 2, 0, 5000000])], cformat));
                world.addPolygon(new Primitive.Polygon([new Geometry.Vec3([-CarParameters.track / 2, 0, 0]), new Geometry.Vec3([-CarParameters.track / 2, 0, 5000000])], cformat));
            } else {

                var frontMidWheelAngle = steeringWheelAngleRad / CarParameters.steeringRatio;

                var radiusMidRear = CarParameters.wheelBase / Math.atan(frontMidWheelAngle);

                var cpos = new Geometry.Vec3([radiusMidRear, 0, 0]);
                var circleOne = new Primitive.Circle(cpos, cnormal, radiusMidRear + CarParameters.track / 2, cformat);
                var circleTwo = new Primitive.Circle(cpos, cnormal, radiusMidRear - CarParameters.track / 2, cformat);


                var polygonCount = 256;

                world.addPolygon(circleOne.toPolygon(polygonCount));
                world.addPolygon(circleTwo.toPolygon(polygonCount));
            }


            myisvg.clear();
            camera.toImage(myisvg);
            myisvg.refresh();
        }

        public drawDebugGUISteeringWheel() {
            var ifrm = document.createElement("IFRAME");
            ifrm.setAttribute("src", "http://192.168.43.1:8080/video");
            ifrm.style.width = "" + this.cameraValuesBuffer.cameraResolutionHorizontal + "px";
            ifrm.style.height = "" + this.cameraValuesBuffer.cameraResolutionVertical + "px";
            document.getElementById("divPS").appendChild(ifrm);


            this.mode = DebugGUIMode.tracks;

            var oldTable = document.getElementById("table_dbg_gui");
            while (oldTable != null) {
                document.getElementById("divPS").removeChild(oldTable);
                oldTable = document.getElementById("table_dbg_gui");
            }

            var table = document.createElement('table');
            table.id = "table_dbg_gui";

            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');

            td.appendChild(mydomsvg);
            td.colSpan = 4;

            tr.appendChild(td);

            tbody.appendChild(tr);

            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);
            table.style.marginTop = "-480px";
            this.redrawTracks();
        }
    }

    export class Starter {
        static start(cameraValuesBuffer : Debug.CameraValuesBuffer) {
            var div = document.createElement("div");
            div.id = "ps_msgDIV";
            div.innerHTML = "No messages received yet.";
            document.getElementById("divPS").appendChild(div);
            var dbgui = new Debug.DebugGUI(cameraValuesBuffer);
            dbgui.drawDebugGUISteeringWheel();

            var pcom : Communicator.PCommunicator = new Communicator.PCommunicator("ps_msgDIV", dbgui);
            pcom.subscribe();

            myisvg.refresh();
        }
    }


}

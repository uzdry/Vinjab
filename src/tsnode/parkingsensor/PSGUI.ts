/**
 * @author David G.
 */

///<reference path="Visualization.ts"/>
///<reference path="Communicator.ts"/>
///<reference path="Geometry.ts"/>

class DOMSVGFactory {
    public static createEmptySVG(svg : Node) : Visualization.ISVG {
        return new Visualization.DOMSVG(svg);
    }
}


module PSGUI {

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
        public wheelBase : number = 4000;
        public track : number = 1400;
        public steeringRatio : number = 20;
        public steeringWheelAngle : number = 0;
    }

    export class PSGUI implements Communicator.PComListener {

        private cameraValuesBuffer : PSGUI.CameraValuesBuffer;
        private carParameters : CarParameters;
        private myisvg : Visualization.ISVG;
        private mydomsvg : Element;

        constructor(cameraValuesBuffer : PSGUI.CameraValuesBuffer, carParameters : CarParameters,
                    myisvg : Visualization.ISVG, mydomsvg : Element) {
            this.cameraValuesBuffer = cameraValuesBuffer;
            this.myisvg = myisvg;
            this.mydomsvg = mydomsvg;
            this.carParameters = carParameters;
        }
        public onMessageReceived(data) {
            this.carParameters.steeringWheelAngle = data.value.value;
            this.redrawTracks();
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

            var steeringWheelAngleRad = this.carParameters.steeringWheelAngle / 180 * Math.PI;
            if (steeringWheelAngleRad == 0) {
                // No circle needs to be drawn, only two parallel lines.

                world.addPolygon(new Primitive.Polygon([new Geometry.Vec3([this.carParameters.track / 2, 0, 0]), new Geometry.Vec3([this.carParameters.track / 2, 0, 5000000])], cformat));
                world.addPolygon(new Primitive.Polygon([new Geometry.Vec3([-this.carParameters.track / 2, 0, 0]), new Geometry.Vec3([-this.carParameters.track / 2, 0, 5000000])], cformat));
            } else {

                var frontMidWheelAngle = steeringWheelAngleRad / this.carParameters.steeringRatio;

                var radiusMidRear = this.carParameters.wheelBase / Math.atan(frontMidWheelAngle);

                var cpos = new Geometry.Vec3([radiusMidRear, 0, 0]);
                var circleOne = new Primitive.Circle(cpos, cnormal, radiusMidRear + this.carParameters.track / 2, cformat);
                var circleTwo = new Primitive.Circle(cpos, cnormal, radiusMidRear - this.carParameters.track / 2, cformat);


                var polygonCount = 256;

                world.addPolygon(circleOne.toPolygon(polygonCount));
                world.addPolygon(circleTwo.toPolygon(polygonCount));
            }


            this.myisvg.clear();
            camera.toImage(this.myisvg);
            this.myisvg.refresh();
        }

        public drawDebugGUISteeringWheel() {
            var ifrm = document.createElement("IFRAME");
            ifrm.setAttribute("src", "http://192.168.43.1:8080/video");
            ifrm.style.width = "" + this.cameraValuesBuffer.cameraResolutionHorizontal + "px";
            ifrm.style.height = "" + this.cameraValuesBuffer.cameraResolutionVertical + "px";
            document.getElementById("divPS").appendChild(ifrm);

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

            td.appendChild(this.mydomsvg);
            td.colSpan = 4;

            tr.appendChild(td);

            tbody.appendChild(tr);

            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);
            table.style.marginTop = "-" + this.cameraValuesBuffer.cameraResolutionVertical;
            this.redrawTracks();
        }
    }

    export class Starter {
        static start(cameraValuesBuffer : PSGUI.CameraValuesBuffer, carParameters : CarParameters) {

            var mydomsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            var myisvg = DOMSVGFactory.createEmptySVG(mydomsvg);

            var dbgui = new PSGUI(cameraValuesBuffer, carParameters, myisvg, mydomsvg);
            dbgui.drawDebugGUISteeringWheel();

            var pcom : Communicator.PCommunicator = new Communicator.PCommunicator(dbgui);
            pcom.subscribe();
        }
    }
}

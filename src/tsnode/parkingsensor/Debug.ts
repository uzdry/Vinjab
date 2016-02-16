/**
 * @author David G.
 */


///<reference path="ARFactory.ts"/>
///<reference path="Geometry.ts"/>
///<reference path="XMLParser.ts"/>
///<reference path="./drawer/PolygonDrawer.ts"/>


var mydomsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

var myisvg = ARFactory.Drawer.createEmptySVG(mydomsvg);

module Debug {

    export class CircleValuesBuffer {

        public static cx : number = 3.0;
        public static cy : number = 0.0;
        public static cz : number = 0.0;

        public static cnx : number = 0.0;
        public static cny : number = 1.0;
        public static cnz : number = 0.0;

        public static radius : number = 4.0;

        public static circleStrokeRed : number = 128;
        public static circleStrokeGreen : number = 0;
        public static circleStrokeBlue : number = 0;

        public static polygonSegmentCount : number = 10;

        public static circleStrokeWidth : number = 1.0;

        public static cfill : boolean = true;

        public static circleFillRed : number = 255;
        public static circleFillGreen : number = 255;
        public static circleFillBlue : number = 0;

    }
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
    export class DebugGUI {

        private static cameraValuesBuffer : Debug.CameraValuesBuffer = new Debug.CameraValuesBuffer();
        private static mode : DebugGUIMode;
        private static polygonDrawer : Drawer.PolygonDrawer = new Drawer.PolygonDrawer(mydomsvg, myisvg);

        public static getCameraValuesBuffer() {
            return DebugGUI.cameraValuesBuffer;
        }

        public static setMode(mode : DebugGUIMode) {
            this.mode = mode;
        }

        public static drawCommonDebugGUI() {
            var table = document.createElement('table');
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');

            var form;
            var input;

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'button';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";

            input.value = "Draw!";
            input.style.height = "30px";

            input.id = 'button_dbg_drawSimpleCircle';
            input.onclick = function() {
                DebugGUI.drawDebugGUISimpleCircle();
            };

            form.appendChild(document.createTextNode('Simple Circle in 3D: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);



            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'button';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";

            input.value = "Draw!";
            input.style.height = "30px";

            input.id = 'button_dbg_drawSimpleCircle';
            input.onclick = function() {
                DebugGUI.drawDebugGUISteeringWheel();
            };

            form.appendChild(document.createTextNode('Tracks of rear wheels: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);
            table.appendChild(tbody);



            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'button';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";

            input.value = "Draw!";
            input.style.height = "30px";

            input.id = 'button_dbg_drawKITlogo';
            input.onclick = function() {
                DebugGUI.polygonDrawer.drawDebugGUIlogoKIT();
            };

            form.appendChild(document.createTextNode('KIT logo: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);
            table.appendChild(tbody);

            document.getElementById("divPS").appendChild(table);
        }

        public static drawDebugGUIAppendCamera(tbody : HTMLElement) {
            var tr;
            var td;
            var form;
            var input;

            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Camera position: ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraPositionX;
            input.id = 'kpx';
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraPositionX = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('x: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraPositionY;
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraPositionY = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('y: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraPositionZ;
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraPositionZ = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('z: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);



            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Cam. rotation (deg., default direction: z+, up = y+): ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraRotationX;
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraRotationX = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('x: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraRotationY;
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraRotationY = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('y: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraRotationZ;
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraRotationZ = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('z: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);




            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Camera resolution (pixels): ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraResolutionHorizontal;
            input.min = '1';
            input.id = 'kresh';
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraResolutionHorizontal = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('Hor.: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraResolutionVertical;
            input.min = '1';
            input.id = 'kresv';
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraResolutionVertical = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('Ver.: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);




            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Camera Angle of View (degrees): ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraHorizontalAOV;
            input.min = '1';
            input.max = '160';
            input.id = 'khaov';
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraHorizontalAOV = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('Hor.: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = DebugGUI.cameraValuesBuffer.cameraVerticalAOV;
            input.min = '1';
            input.max = '160';
            input.id = 'kvaov';
            input.onchange = function() {
                DebugGUI.cameraValuesBuffer.cameraVerticalAOV = parseFloat(this.value);
                DebugGUI.redrawDebugGUICommon();
            };

            form.appendChild(document.createTextNode('Ver.: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);
        }

        public static redrawDebugGUICommon() {
            if (DebugGUI.mode == DebugGUIMode.simpleCircle) {
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            } else if (DebugGUI.mode == DebugGUIMode.tracks) {
                DebugGUI.redrawTracks();
            } else if (DebugGUI.mode == DebugGUIMode.kitLogo) {
                DebugGUI.polygonDrawer.redrawKITlogo();
            }
        }

        public static drawDebugGUISimpleCircle() {

            DebugGUI.cameraValuesBuffer.cameraPositionX = 0;
            DebugGUI.cameraValuesBuffer.cameraPositionY = 16;
            DebugGUI.cameraValuesBuffer.cameraPositionZ = 0;

            DebugGUI.cameraValuesBuffer.cameraRotationX = 90;
            DebugGUI.cameraValuesBuffer.cameraRotationY = 0;
            DebugGUI.cameraValuesBuffer.cameraRotationZ = 0;

            DebugGUI.cameraValuesBuffer.cameraResolutionHorizontal = 640;
            DebugGUI.cameraValuesBuffer.cameraResolutionVertical = 480;

            DebugGUI.cameraValuesBuffer.cameraHorizontalAOV = 106;
            DebugGUI.cameraValuesBuffer.cameraVerticalAOV = 90;

            DebugGUI.mode = DebugGUIMode.simpleCircle;
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

            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Circle position: ";
            tr.appendChild(td);

            td = document.createElement('td');

            var form;
            var input;

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.cx;
            input.id = 'cx';
            input.onchange = function() {
                CircleValuesBuffer.cx = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('x: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.cy;
            input.id = 'cy';
            input.onchange = function() {
                CircleValuesBuffer.cy = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('y: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.cz;
            input.id = 'cz';
            input.onchange = function() {
                CircleValuesBuffer.cz = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('z: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);


            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Circle normal: ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.cnx;
            input.id = 'cnx';
            input.onchange = function() {
                CircleValuesBuffer.cnx = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('x: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.cny;
            input.id = 'cny';
            input.onchange = function() {
                CircleValuesBuffer.cny = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('y: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.cnz;
            input.id = 'cnz';
            input.onchange = function() {
                CircleValuesBuffer.cnz = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('z: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);




            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = "Circle radius: ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.radius;
            input.min = '1';
            input.id = 'cr';
            input.onchange = function() {
                CircleValuesBuffer.radius = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('r: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);
            tbody.appendChild(tr);


            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = "Polygon segment count: ";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.polygonSegmentCount;
            input.min = '3';
            input.id = 'psc';
            input.onchange = function() {
                CircleValuesBuffer.polygonSegmentCount = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('#: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);
            tbody.appendChild(tr);




            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = "Stroke-width";
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleStrokeWidth;
            input.min = '1';
            input.id = 'csw';
            input.onchange = function() {
                CircleValuesBuffer.circleStrokeWidth = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('w: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);


            tbody.appendChild(tr);


            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Circle stroke color: ";
            tr.appendChild(td);

            td = document.createElement('td');

            var form;
            var input;

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleStrokeRed;
            input.min = 0;
            input.max = 255;
            input.id = 'ccr';
            input.onchange = function() {
                CircleValuesBuffer.circleStrokeRed = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('r: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleStrokeGreen;
            input.min = 0;
            input.max = 255;
            input.id = 'ccg';
            input.onchange = function() {
                CircleValuesBuffer.circleStrokeGreen = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('g: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleStrokeBlue;
            input.min = 0;
            input.max = 255;
            input.onchange = function() {
                CircleValuesBuffer.circleStrokeBlue = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('b: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);



            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Circle fill color: ";
            tr.appendChild(td);

            td = document.createElement('td');

            var form;
            var input;

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleFillRed;
            input.min = 0;
            input.max = 255;
            input.id = 'cfr';
            input.onchange = function() {
                CircleValuesBuffer.circleFillRed = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('r: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleFillGreen;
            input.min = 0;
            input.max = 255;
            input.id = 'cfg';
            input.onchange = function() {
                CircleValuesBuffer.circleFillGreen = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('g: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            td = document.createElement('td');

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = CircleValuesBuffer.circleFillBlue;
            input.min = 0;
            input.max = 255;
            input.id = 'cfb';
            input.onchange = function() {
                CircleValuesBuffer.circleFillBlue = parseFloat(this.value);
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
            };

            form.appendChild(document.createTextNode('b: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            DebugGUI.drawDebugGUIAppendCamera(tbody);

            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);

            ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.cameraValuesBuffer);
        }

        public static redrawTracks() {

            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(DebugGUI.cameraValuesBuffer.cameraRotationX / 180 * Math.PI),
                new Geometry.Angle(DebugGUI.cameraValuesBuffer.cameraRotationY / 180 * Math.PI), new Geometry.Angle(DebugGUI.cameraValuesBuffer.cameraRotationZ / 180 * Math.PI));

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([DebugGUI.cameraValuesBuffer.cameraPositionX,
                DebugGUI.cameraValuesBuffer.cameraPositionY, DebugGUI.cameraValuesBuffer.cameraPositionZ]);

            // Camera Horizontal and Vertical Angle Of View.
            var cameraHAOV : Geometry.Angle = new Geometry.Angle(DebugGUI.cameraValuesBuffer.cameraHorizontalAOV / 180 * Math.PI);
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(DebugGUI.cameraValuesBuffer.cameraVerticalAOV / 180 * Math.PI);

            // Camera horizontal and vertical resolution.
            var cameraResolution : Geometry.Vec2 = new Geometry.Vec2(DebugGUI.cameraValuesBuffer.cameraResolutionHorizontal, DebugGUI.cameraValuesBuffer.cameraResolutionVertical);

            var camera : Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            var world : Visualization.World = new Visualization.World(camera);



            var cnormal = new Geometry.Vec3([0, 1, 0]);
            var cfill = null;
            var cstroke = new Format.RGB(128, 255, 0);
            var cstrokewidth = 5;
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

        public static drawDebugGUISteeringWheel() {
            DebugGUI.cameraValuesBuffer.cameraPositionX = 0;
            DebugGUI.cameraValuesBuffer.cameraPositionY = 800;
            DebugGUI.cameraValuesBuffer.cameraPositionZ = 0;

            DebugGUI.cameraValuesBuffer.cameraRotationX = 20;
            DebugGUI.cameraValuesBuffer.cameraRotationY = 0;
            DebugGUI.cameraValuesBuffer.cameraRotationZ = 0;

            DebugGUI.cameraValuesBuffer.cameraResolutionHorizontal = 640;
            DebugGUI.cameraValuesBuffer.cameraResolutionVertical = 480;

            DebugGUI.cameraValuesBuffer.cameraHorizontalAOV = 106;
            DebugGUI.cameraValuesBuffer.cameraVerticalAOV = 90;

            DebugGUI.mode = DebugGUIMode.tracks;

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

            tr = document.createElement('tr');
            td = document.createElement('td');

            td.innerHTML = "Steering Wheel Rotation (degrees, CW): ";
            tr.appendChild(td);

            td = document.createElement('td');

            var form;
            var input;

            form = document.createElement('form');
            input = document.createElement('input');
            input.type = 'number';
            input.style.height = "16px";
            input.style.fontSize = "12px";
            input.style.width = "60px";
            input.value = '0';
            input.id = 'swRotation';
            input.min = -540;
            input.max = +540;
            input.onchange = function() {
                CarParameters.steeringWheelAngle = this.value;
                DebugGUI.redrawTracks();
            };

            form.appendChild(document.createTextNode('rot.: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            DebugGUI.drawDebugGUIAppendCamera(tbody);

            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);

            DebugGUI.redrawTracks();
        }
    }

    export class Starter {
        static start() {
            Debug.DebugGUI.drawCommonDebugGUI();
            ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg, DebugGUI.getCameraValuesBuffer());
            myisvg.refresh();
        }
    }


}
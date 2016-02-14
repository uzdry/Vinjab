/**
 * @author David G.
 */


///<reference path="ARFactory.ts"/>
///<reference path="Geometry.ts"/>

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
        public static cameraPositionX : number = 0;
        public static cameraPositionY : number = 16;
        public static cameraPositionZ : number = 0;

        public static cameraRotationX : number = 90;
        public static cameraRotationY : number = 0;
        public static cameraRotationZ : number = 0;

        public static cameraResolutionHorizontal : number = 640;
        public static cameraResolutionVertical : number = 480;

        public static cameraHorizontalAOV : number = 106;
        public static cameraVerticalAOV : number = 90;
    }

    export class CarParameters {
        public static wheelBase : number = 4000;
        public static track : number = 1400;
        public static steeringRatio : number = 20;
        public static steeringWheelAngle : number = 0;
    }


    enum DebugGUIMode {
        simpleCircle, tracks, kitLogo
    }
    export class DebugGUI {

        private static mode : DebugGUIMode;

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
                DebugGUI.drawDebugGUIlogoKIT();
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
            input.value = CameraValuesBuffer.cameraPositionX;
            input.id = 'kpx';
            input.onchange = function() {
                CameraValuesBuffer.cameraPositionX = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraPositionY;
            input.onchange = function() {
                CameraValuesBuffer.cameraPositionY = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraPositionZ;
            input.onchange = function() {
                CameraValuesBuffer.cameraPositionZ = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraRotationX;
            input.onchange = function() {
                CameraValuesBuffer.cameraRotationX = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraRotationY;
            input.onchange = function() {
                CameraValuesBuffer.cameraRotationY = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraRotationZ;
            input.onchange = function() {
                CameraValuesBuffer.cameraRotationZ = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraResolutionHorizontal;
            input.min = '1';
            input.id = 'kresh';
            input.onchange = function() {
                CameraValuesBuffer.cameraResolutionHorizontal = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraResolutionVertical;
            input.min = '1';
            input.id = 'kresv';
            input.onchange = function() {
                CameraValuesBuffer.cameraResolutionVertical = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraHorizontalAOV;
            input.min = '1';
            input.max = '160';
            input.id = 'khaov';
            input.onchange = function() {
                CameraValuesBuffer.cameraHorizontalAOV = parseFloat(this.value);
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
            input.value = CameraValuesBuffer.cameraVerticalAOV;
            input.min = '1';
            input.max = '160';
            input.id = 'kvaov';
            input.onchange = function() {
                CameraValuesBuffer.cameraVerticalAOV = parseFloat(this.value);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
            } else if (DebugGUI.mode == DebugGUIMode.tracks) {
                DebugGUI.redrawTracks();
            } else if (DebugGUI.mode == DebugGUIMode.kitLogo) {
                DebugGUI.redrawKITlogo();
            }
        }

        public static redrawKITlogo() {

            var kitGreen = new Format.FormatContainer(
                new Format.RGB(50,161,137), new Format.RGB(50,161,137), 1);
            var kitBlack = new Format.FormatContainer(
                new Format.RGB(0,0,0), new Format.RGB(0,0,0), 1);

            var kit_1_segments : Geometry.Vec3[] = [];
            kit_1_segments[0] = new Geometry.Vec3([36.320902, -37.421138, 0]);
            kit_1_segments[1] = new Geometry.Vec3([27.844822,-3.5619063,0]);
            kit_1_segments[2] = new Geometry.Vec3([36.35697,-2.5700246 ,0]);

            var  kit_1 : Primitive.Polygon = new Primitive.Polygon(kit_1_segments, kitBlack);


            var kit_2_segments : Geometry.Vec3[] = [];
            kit_2_segments[0] = new Geometry.Vec3([36.314923,-37.430792, 0]);
            kit_2_segments[1] = new Geometry.Vec3([14.120324,-10.276527, 0]);
            kit_2_segments[2] = new Geometry.Vec3([21.42355,-5.766655 ,0]);

            var  kit_2 : Primitive.Polygon = new Primitive.Polygon(kit_2_segments, kitGreen);

            var kit_3_segments : Geometry.Vec3[] = [];
            kit_3_segments[0] = new Geometry.Vec3([36.324394, -37.429604, 0]);
            kit_3_segments[1] = new Geometry.Vec3([4.4456058, -22.569009, 0]);
            kit_3_segments[2] = new Geometry.Vec3([9.0469268, -15.31754, 0]);

            var  kit_3 : Primitive.Polygon = new Primitive.Polygon(kit_3_segments, kitGreen);


            var kit_4_segments : Geometry.Vec3[] = [];
            kit_4_segments[0] = new Geometry.Vec3([36.314351, -37.428701, 0]);
            kit_4_segments[1] = new Geometry.Vec3([1.0168564, -37.420501, 0]);
            kit_4_segments[2] = new Geometry.Vec3([2.1321184, -28.908428, 0]);

            var  kit_4 : Primitive.Polygon = new Primitive.Polygon(kit_4_segments, kitGreen);

            //<path d="L  , , ,  , " />


            var kit_k_segments : Geometry.Vec3[] = [];
            kit_k_segments[0] = new Geometry.Vec3([61.920062, -37.4234901, 0]);
            kit_k_segments[1] = new Geometry.Vec3([51.272677, -37.4234901, 0]);
            kit_k_segments[2] = new Geometry.Vec3([38.617696, -23.8364281, 0]);
            kit_k_segments[3] = new Geometry.Vec3([38.617696, -16.0570031, 0]);
            kit_k_segments[4] = new Geometry.Vec3([50.878321, -2.5057291, 0]);
            kit_k_segments[5] = new Geometry.Vec3([61.848387, -2.5057291, 0]);
            kit_k_segments[6] = new Geometry.Vec3([47.723551, -20.0721941, 0]);
            kit_k_segments[7] = new Geometry.Vec3([61.920062, -37.4234901, 0]);

            var  kit_k : Primitive.Polygon = new Primitive.Polygon(kit_k_segments, kitBlack);


            var kit_i_segments : Geometry.Vec3[] = [];
            kit_i_segments[0] = new Geometry.Vec3([73.105221, -37.4234901, 0]);
            kit_i_segments[1] = new Geometry.Vec3([63.533302, -37.4234901, 0]);
            kit_i_segments[2] = new Geometry.Vec3([63.533302, -2.5415961, 0]);
            kit_i_segments[3] = new Geometry.Vec3([73.105221, -2.5415961, 0]);
            kit_i_segments[4] = new Geometry.Vec3([73.105221, -37.4234901, 0]);

            var  kit_i : Primitive.Polygon = new Primitive.Polygon(kit_i_segments, kitBlack);

            // <path d="M , , , , , , , "/>

            var kit_t_segments : Geometry.Vec3[] = [];
            kit_t_segments[0] = new Geometry.Vec3([98.45105, -2.5415961, 0]);
            kit_t_segments[1] = new Geometry.Vec3([75.399628, -2.5415961, 0]);
            kit_t_segments[2] = new Geometry.Vec3([75.399628, -10.39274, 0]);
            kit_t_segments[3] = new Geometry.Vec3([82.139409, -10.39274, 0]);
            kit_t_segments[4] = new Geometry.Vec3([82.139409, -37.459355, 0]);
            kit_t_segments[5] = new Geometry.Vec3([91.711302, -37.459355, 0]);
            kit_t_segments[6] = new Geometry.Vec3([91.711302, -10.39274, 0]);
            kit_t_segments[7] = new Geometry.Vec3([98.45105, -10.39274, 0]);
            kit_t_segments[8] = new Geometry.Vec3([98.45105, -2.5415961, 0]);

            var  kit_t : Primitive.Polygon = new Primitive.Polygon(kit_t_segments, kitBlack);


            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(CameraValuesBuffer.cameraRotationX / 180 * Math.PI),
                new Geometry.Angle(CameraValuesBuffer.cameraRotationY / 180 * Math.PI), new Geometry.Angle(CameraValuesBuffer.cameraRotationZ / 180 * Math.PI));

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([CameraValuesBuffer.cameraPositionX,
                CameraValuesBuffer.cameraPositionY, CameraValuesBuffer.cameraPositionZ]);

            // Camera Horizontal and Vertical Angle Of View.
            var cameraHAOV : Geometry.Angle = new Geometry.Angle(CameraValuesBuffer.cameraHorizontalAOV / 180 * Math.PI);
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(CameraValuesBuffer.cameraVerticalAOV / 180 * Math.PI);

            // Camera horizontal and vertical resolution.
            var cameraResolution : Geometry.Vec2 = new Geometry.Vec2(CameraValuesBuffer.cameraResolutionHorizontal, CameraValuesBuffer.cameraResolutionVertical);

            var camera : Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            var world : Visualization.World = new Visualization.World(camera);


            world.addPolygon(kit_1);
            world.addPolygon(kit_2);
            world.addPolygon(kit_3);
            world.addPolygon(kit_4);
            world.addPolygon(kit_k);
            world.addPolygon(kit_i);
            world.addPolygon(kit_t);

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

            DebugGUI.drawDebugGUIAppendCamera(tbody);
            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);

            myisvg.clear();
            camera.toImage(myisvg);
            myisvg.refresh();
        }
        public static drawDebugGUIlogoKIT() {
            CameraValuesBuffer.cameraPositionX = 50;
            CameraValuesBuffer.cameraPositionY = 0;
            CameraValuesBuffer.cameraPositionZ = -200;

            CameraValuesBuffer.cameraRotationX = 25;
            CameraValuesBuffer.cameraRotationY = 15;
            CameraValuesBuffer.cameraRotationZ = 0;

            CameraValuesBuffer.cameraResolutionHorizontal = 640;
            CameraValuesBuffer.cameraResolutionVertical = 480;

            CameraValuesBuffer.cameraHorizontalAOV = 106;
            CameraValuesBuffer.cameraVerticalAOV = 90;

            DebugGUI.mode = DebugGUIMode.kitLogo;

            DebugGUI.redrawKITlogo();
        }
        public static drawDebugGUISimpleCircle() {

            CameraValuesBuffer.cameraPositionX = 0;
            CameraValuesBuffer.cameraPositionY = 16;
            CameraValuesBuffer.cameraPositionZ = 0;

            CameraValuesBuffer.cameraRotationX = 90;
            CameraValuesBuffer.cameraRotationY = 0;
            CameraValuesBuffer.cameraRotationZ = 0;

            CameraValuesBuffer.cameraResolutionHorizontal = 640;
            CameraValuesBuffer.cameraResolutionVertical = 480;

            CameraValuesBuffer.cameraHorizontalAOV = 106;
            CameraValuesBuffer.cameraVerticalAOV = 90;

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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
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
                ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
            };

            form.appendChild(document.createTextNode('b: '));
            form.appendChild(input);
            td.appendChild(form);
            tr.appendChild(td);

            tbody.appendChild(tr);

            DebugGUI.drawDebugGUIAppendCamera(tbody);

            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);

            ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
        }

        public static redrawTracks() {

            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(CameraValuesBuffer.cameraRotationX / 180 * Math.PI),
                new Geometry.Angle(CameraValuesBuffer.cameraRotationY / 180 * Math.PI), new Geometry.Angle(CameraValuesBuffer.cameraRotationZ / 180 * Math.PI));

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([CameraValuesBuffer.cameraPositionX,
                CameraValuesBuffer.cameraPositionY, CameraValuesBuffer.cameraPositionZ]);

            // Camera Horizontal and Vertical Angle Of View.
            var cameraHAOV : Geometry.Angle = new Geometry.Angle(CameraValuesBuffer.cameraHorizontalAOV / 180 * Math.PI);
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(CameraValuesBuffer.cameraVerticalAOV / 180 * Math.PI);

            // Camera horizontal and vertical resolution.
            var cameraResolution : Geometry.Vec2 = new Geometry.Vec2(CameraValuesBuffer.cameraResolutionHorizontal, CameraValuesBuffer.cameraResolutionVertical);

            var camera : Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            var world : Visualization.World = new Visualization.World(camera);



            var cnormal = new Geometry.Vec3([0, 1, 0]);
            var cfill = null;
            var cstroke = new Format.RGB(128, 255, 0);
            var cstrokewidth = 5;
            var cformat = new Format.FormatContainer(cfill, cstroke, cstrokewidth);

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
            CameraValuesBuffer.cameraPositionX = 0;
            CameraValuesBuffer.cameraPositionY = 800;
            CameraValuesBuffer.cameraPositionZ = 0;

            CameraValuesBuffer.cameraRotationX = 20;
            CameraValuesBuffer.cameraRotationY = 0;
            CameraValuesBuffer.cameraRotationZ = 0;

            CameraValuesBuffer.cameraResolutionHorizontal = 640;
            CameraValuesBuffer.cameraResolutionVertical = 480;

            CameraValuesBuffer.cameraHorizontalAOV = 106;
            CameraValuesBuffer.cameraVerticalAOV = 90;

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
            ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);
            myisvg.refresh();
        }
    }


    var kvb = new Debug.CameraValuesBuffer();
    var cvb = new Debug.CircleValuesBuffer();

    var mydomsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    var mydiv = document.getElementById("divParkingSVG");

    var myisvg = ARFactory.Drawer.createEmptySVG(mydomsvg);
}

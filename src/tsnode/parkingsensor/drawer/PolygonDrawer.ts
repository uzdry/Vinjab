/**
 * @author David G.
 */


///<reference path="./../ARFactory.ts"/>
///<reference path="./../Geometry.ts"/>
///<reference path="./../XMLParser.ts"/>

module Drawer {
    export class PolygonDrawer implements XMLParser.XMLParserCallBack {
        private mydomsvg;
        private myisvg;

        constructor(mydomsvg, myisvg) {
            this.mydomsvg = mydomsvg;
            this.myisvg = myisvg;
        }

        public onPolygonsFound(polygons:Primitive.Polygon[]) {

            var cameraValuesBuffer = Debug.DebugGUI.getCameraValuesBuffer();
            var cameraRotation:Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(cameraValuesBuffer.cameraRotationX / 180 * Math.PI),
                new Geometry.Angle(cameraValuesBuffer.cameraRotationY / 180 * Math.PI), new Geometry.Angle(cameraValuesBuffer.cameraRotationZ / 180 * Math.PI));

            var cameraPosition:Geometry.Vec3 = new Geometry.Vec3([cameraValuesBuffer.cameraPositionX,
                cameraValuesBuffer.cameraPositionY, cameraValuesBuffer.cameraPositionZ]);

            // Camera Horizontal and Vertical Angle Of View.
            var cameraHAOV:Geometry.Angle = new Geometry.Angle(cameraValuesBuffer.cameraHorizontalAOV / 180 * Math.PI);
            var cameraVAOV:Geometry.Angle = new Geometry.Angle(cameraValuesBuffer.cameraVerticalAOV / 180 * Math.PI);

            // Camera horizontal and vertical resolution.
            var cameraResolution:Geometry.Vec2 = new Geometry.Vec2(cameraValuesBuffer.cameraResolutionHorizontal, cameraValuesBuffer.cameraResolutionVertical);

            var camera:Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            var world:Visualization.World = new Visualization.World(camera);


            for (var i = 0; i < polygons.length; i++) {
                world.addPolygon(polygons[i]);
            }

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

            Debug.DebugGUI.drawDebugGUIAppendCamera(tbody);
            table.appendChild(tbody);
            document.getElementById("divPS").appendChild(table);

            this.myisvg.clear();
            camera.toImage(this.myisvg);
            this.myisvg.refresh();
        }

        public redrawKITlogo() {

            XMLParser.XMLParser.parseXML("/src/tsnode/parkingsensor/kit.xml", this);
        }

        public drawDebugGUIlogoKIT() {
            var cameraValuesBuffer = Debug.DebugGUI.getCameraValuesBuffer();

            cameraValuesBuffer.cameraPositionX = 50;
            cameraValuesBuffer.cameraPositionY = 0;
            cameraValuesBuffer.cameraPositionZ = -200;

            cameraValuesBuffer.cameraRotationX = 25;
            cameraValuesBuffer.cameraRotationY = 15;
            cameraValuesBuffer.cameraRotationZ = 0;

            cameraValuesBuffer.cameraResolutionHorizontal = 640;
            cameraValuesBuffer.cameraResolutionVertical = 480;

            cameraValuesBuffer.cameraHorizontalAOV = 106;
            cameraValuesBuffer.cameraVerticalAOV = 90;

            Debug.DebugGUI.setMode(Debug.DebugGUIMode.kitLogo);

            this.redrawKITlogo();
        }
    }
}

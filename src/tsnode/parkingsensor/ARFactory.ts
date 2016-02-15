/**
 * @author David G.
 */

///<reference path="Format.ts"/>
///<reference path="Primitive.ts"/>
///<reference path="Visualization.ts"/>
///<reference path="Debug.ts"/>

module ARFactory {
    export class Drawer {

        public static createEmptySVG(svg : Node) : Visualization.ISVG {
            return new Visualization.DOMSVG(svg);
        }

        public static drawSimpleCircleAutoClear(image : Visualization.ISVG, cameraValuesBuffer : Debug.CameraValuesBuffer) : void {
            image.clear();
            Drawer.drawSimpleCircle(image, cameraValuesBuffer);
            image.refresh();
        }

        public static drawSimpleCircle(image : Visualization.ISVG, cameraValuesBuffer : Debug.CameraValuesBuffer) : void {

            // ALL the parameters (all the hard coded numbers) will be replaced by input parameters, they are now only used for debug.

            // The center of the circle
            var vx : number = Debug.CircleValuesBuffer.cx;
            var vy : number = Debug.CircleValuesBuffer.cy;
            var vz : number = Debug.CircleValuesBuffer.cz;

            // The normal vector of the circle, must not be the zero vector!
            var nx : number = Debug.CircleValuesBuffer.cnx;
            var ny : number = Debug.CircleValuesBuffer.cny;
            var nz : number = Debug.CircleValuesBuffer.cnz;

            // The radius of the circle
            var cr : number = Debug.CircleValuesBuffer.radius;

            var fillRGB;
            if (Debug.CircleValuesBuffer.cfill == true) {
                fillRGB = new Format.RGB(Debug.CircleValuesBuffer.circleFillRed, Debug.CircleValuesBuffer.circleFillGreen, Debug.CircleValuesBuffer.circleFillBlue);
            } else {
                fillRGB = null;
            }
            var circleFormat : Format.FormatContainer = new Format.FormatContainer(fillRGB,
                new Format.RGB(Debug.CircleValuesBuffer.circleStrokeRed, Debug.CircleValuesBuffer.circleStrokeGreen, Debug.CircleValuesBuffer.circleStrokeBlue),
                Debug.CircleValuesBuffer.circleStrokeWidth, "circleFormat");

            var circlePosition : Geometry.Vec3 = new Geometry.Vec3([vx, vy, vz]);
            var circleNormal : Geometry.Vec3 = new Geometry.Vec3([nx, ny, nz]).normalize();

            var circle : Primitive.Circle = new Primitive.Circle(circlePosition, circleNormal, cr, circleFormat);

            // The segment count of the polygon the circle should be converted to.
            var polygonSegmentCount : number = Debug.CircleValuesBuffer.polygonSegmentCount;
            var polygon : Primitive.Polygon = circle.toPolygon(polygonSegmentCount);

            // The camera rotation values in degrees.
            var krx : number = cameraValuesBuffer.cameraRotationX;
            var kry : number = cameraValuesBuffer.cameraRotationY;
            var krz : number = cameraValuesBuffer.cameraRotationZ;

            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(Drawer.deg2rad(krx)),
                new Geometry.Angle(Drawer.deg2rad(kry)), new Geometry.Angle(Drawer.deg2rad(krz)));

            var rotationMatrix : Geometry.Mat3x3 = cameraRotation.getRotationMatrix();

            var rotationMatrixInverse : Geometry.Mat3x3 = rotationMatrix.transpose();

            // Camera position.
            var kpx : number = cameraValuesBuffer.cameraPositionX;
            var kpy : number = cameraValuesBuffer.cameraPositionY;
            var kpz : number = cameraValuesBuffer.cameraPositionZ;

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([kpx, kpy, kpz]);
            var transformationMatrix : Geometry.Mat4x4 = new Geometry.Mat4x4(rotationMatrixInverse,
                rotationMatrixInverse.multiplyFromRightByVector(cameraPosition).scale(-1.0));

            // Camera Horizontal and Vertical Angle Of View.
            var khaov : number = cameraValuesBuffer.cameraHorizontalAOV;
            var kvaov : number = cameraValuesBuffer.cameraVerticalAOV;

            var cameraHAOV : Geometry.Angle = new Geometry.Angle(Drawer.deg2rad(khaov));
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(Drawer.deg2rad(kvaov));

            // Camera horizontal and vertical resolution.
            var khres : number = cameraValuesBuffer.cameraResolutionHorizontal;
            var kvres : number = cameraValuesBuffer.cameraResolutionVertical;

            var cameraResolution : Geometry.Vec2 = new Geometry.Vec2(khres, kvres);
            var camera : Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            // The 3D world where all the objects and the camera are located.
            var world : Visualization.World = new Visualization.World(camera);

            //////////

            world.addPolygon(polygon);

            //////////


            camera.toImage(image);

            //document.getElementById("divPS").appendChild(image);
        }


        private static deg2rad(degValue : number) : number {
            return degValue * Math.PI / 180.0;
        }
    }
}

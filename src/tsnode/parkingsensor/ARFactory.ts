/**
 * @author David G.
 */

///<reference path="Format.ts"/>
///<reference path="Primitive.ts"/>
///<reference path="Visualization.ts"/>

module ARFactory {
    export class Drawer {

        public static createEmptySVG(svg : Node) : Visualization.ISVG {
            return new Visualization.DOMSVG(svg);
        }

        public static drawSimpleCircle(image : Visualization.ISVG) : void {

            // ALL the parameters (all the hard coded numbers) will be replaced by input parameters, they are now only used for debug.

            // The center of the circle
            var vx = 0.0;
            var vy = 0.0;
            var vz = 0.0;

            // The normal vector of the circle, must not be the zero vector!
            var nx = 0.0;
            var ny = 1.0;
            var nz = 0.0;

            // The radius of the circle
            var cr = 4.0;

            var circleFormat : Format.FormatContainer = new Format.FormatContainer(
                new Format.RGB(255, 255, 0), new Format.RGB(128, 0, 0), 6);

            var circlePosition : Geometry.Vec3 = new Geometry.Vec3([vx, vy, vz]);
            var circleNormal : Geometry.Vec3 = new Geometry.Vec3([nx, ny, nz]).normalize();

            var circle : Primitive.Circle = new Primitive.Circle(circlePosition, circleNormal, cr, circleFormat);

            // The segment count of the polygon the circle should be converted to.
            var polygonSegmentCount : number = 64;
            var polygon : Primitive.Polygon = circle.toPolygon(polygonSegmentCount);

            // The camera rotation values in degrees.
            var krx : number = 90.0;
            var kry : number = 0.0;
            var krz : number = 0.0;

            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(Drawer.deg2rad(krx)),
                new Geometry.Angle(Drawer.deg2rad(kry)), new Geometry.Angle(Drawer.deg2rad(krz)));

            var rotationMatrix : Geometry.Mat3x3 = cameraRotation.getRotationMatrix();

            var rotationMatrixInverse : Geometry.Mat3x3 = rotationMatrix.transpose();

            // Camera position.
            var kpx : number = 0.0;
            var kpy : number = 16.0;
            var kpz : number = 0.0;

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([kpx, kpy, kpz]);
            var transformationMatrix : Geometry.Mat4x4 = new Geometry.Mat4x4(rotationMatrixInverse,
                    rotationMatrixInverse.multiplyFromRightByVector(cameraPosition).scale(-1.0));

            // Camera Horizontal and Vertical Angle Of View.
            var khaov : number = 106.26;
            var kvaov : number = 90;

            var cameraHAOV : Geometry.Angle = new Geometry.Angle(Drawer.deg2rad(khaov));
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(Drawer.deg2rad(kvaov));

            // Camera horizontal and vertical resolution.
            var khres : number = 640;
            var kvres : number = 480;

            var cameraResolution : Geometry.Vec2 = new Geometry.Vec2(khres, kvres);
            var camera : Visualization.Camera = new Visualization.Camera(cameraRotation, cameraPosition,
                cameraHAOV, cameraVAOV, cameraResolution);

            // The 3D world where all the objects and the camera are located.
            var world : Visualization.World = new Visualization.World(camera);

            //////////

            world.addPolygon(polygon);

            //////////


            camera.toImage(image);

            //document.body.appendChild(image);

        }


        private static deg2rad(degValue : number) : number {
            return degValue * Math.PI / 180.0;
        }
    }
}

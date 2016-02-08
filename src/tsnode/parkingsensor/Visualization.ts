/**
 * @author David G.
 */

///<reference path="Geometry.ts"/>
///<reference path="Primitive.ts"/>

module Visualization {

    export interface ISVG {
        setResolution(resolution : Geometry.Vec2) : void;

        addPolygon(polygon : Primitive.Polygon) : void;

        refresh() : void;

        clear() : void;
    }

    export class DOMSVG implements ISVG {
        private resolution : Geometry.Vec2;
        private polygons : Primitive.Polygon[] = [];
        private svg : any;
        constructor (svg : any) {
            this.svg = svg;
        }

        public clear() {
            this.polygons = [];
            while (this.svg.children.length != 0) {
                this.svg.removeChild(this.svg.children[0]);
            }
        }

        public setResolution(resolution : Geometry.Vec2) : void {
            this.resolution = resolution;
        }

        public addPolygon(polygon : Primitive.Polygon) : void {
            if (polygon == null)
            {
                // throw new Exception("Polygon must not be null!");
            }
            this.polygons.push(polygon);
        }

        public refresh() : void {
            this.svg.setAttribute('id', "augsvg");
            this.svg.setAttribute('width', "" + this.resolution.getX());
            this.svg.setAttribute('height', "" + this.resolution.getY());
            var svgNS = this.svg.namespaceURI;

            var strbuf;
            for (var i = 0; i < this.polygons.length; i++) {
                var path = document.createElementNS(svgNS, 'path');
                var sc : number = this.polygons[i].getSegmentCount();
                strbuf = "";
                for (var j = 0; j < sc; j++) {
                    if (j == 0) {
                        strbuf += "M ";
                    } else if (j == 1) {
                        strbuf += "L ";
                    }
                    strbuf += "" + this.polygons[i].getSegment(j).getX() + "," + this.polygons[i].getSegment(j).getY() + " ";
                }
                strbuf += "Z";
                path.setAttribute('d', strbuf);
                path.setAttribute('stroke', this.polygons[i].getFormat().getStroke().toHEXString());
                path.setAttribute('stroke-width', "" + this.polygons[i].getFormat().getStrokeWidth());
                if (this.polygons[i].getFormat().getFill() == null) {
                    path.setAttribute('fill', 'none');
                } else {
                    path.setAttribute('fill', this.polygons[i].getFormat().getFill().toHEXString());
                }
                this.svg.appendChild(path);
            }

            this.svg.setAttribute('z-index', '200');
        }
    }

    export class CScreen {
        private resolution : Geometry.Vec2;
        private width : number;
        private height : number;

        private bottomLeft : Geometry.Vec3;
        private invertX : boolean = false;
        private invertY : boolean = true;

        // All the calculations are in the camera coordinate system.
        // The screen is in the z == 1 plane.
        // The position of the camera is [0, 0, 0].
        //  In other words: The camera looks into the z+ direction.
        //  The 'up' vector equals y+.

        constructor(resolution : Geometry.Vec2, width : number, height : number) {
            this.resolution = resolution;
            this.width = width;
            this.height = height;

            this.bottomLeft = new Geometry.Vec3([-width / 2, -height / 2, 1.0]);
        }


        public projectPointToScreen(point : Geometry.Vec3) : Geometry.Vec2 {
            var screenPoint : Geometry.Vec3 = this.projectPointToScreenPoint(point);
            if (screenPoint == null) {
                return null;
            }
            var pp : Geometry.Vec2 = this.projectScreenPointToPixel(screenPoint);

            if (pp == null) {
                return null;
            }
            return pp;
        }

        private projectScreenPointToPixel(screenPoint : Geometry.Vec3) : Geometry.Vec2 {
            //if (!CMMath.Math.NumericEngine.compareEquals(screenPoint.getElement(2), 1.0)) {
            // throw new Exception("Z of the screenPoint must be 1.0!");
            //}
            var x : number = screenPoint.getElement(0) - this.bottomLeft.getElement(0);
            var y : number = screenPoint.getElement(1) - this.bottomLeft.getElement(1);

            x /= this.width;
            y /= this.height;

            x *= this.resolution.getX();
            y *= this.resolution.getY();

            if (this.invertX) {
                x = this.resolution.getX() - x;
            }
            if (this.invertY) {
                y = this.resolution.getY() - y;
            }

            var pp : Geometry.Vec2 = new Geometry.Vec2(x, y);

            return pp;
        }


        private projectPointToScreenPoint(point : Geometry.Vec3) : Geometry.Vec3 {
            if (point.getElement(2) < 0) {
                // Point behind the camera.
                return null;
            }
            if (point.getElement(2) == 0) {
                // Ray from the camera to the point is parallel with the screen plane. No intersection.
                return null;
            }

            // Ray: [0, 0, 0] + t * point.
            // CScreen is in the z == 1 plane.
            // Projected point: [x, y, z] -> [x/z, y/z, 1].
            var z : number= point.getElement(2);
            var res : Geometry.Vec3 = new Geometry.Vec3([point.getElement(0) / z,
                point.getElement(1) / z, 1.0]);
            return res;
        }
    }

    export class Camera {
        private world : World;
        private worldToCameraTransformation : Geometry.Mat4x4;
        private horizontalAOV : Geometry.Angle;
        private verticalAOV : Geometry.Angle;
        private resolution : Geometry.Vec2;

        private cscreen : Visualization.CScreen;


        constructor(rotation : Geometry.Rot3, position : Geometry.Vec3,
                    horizontalAngleOfView : Geometry.Angle, verticalAngleOfView : Geometry.Angle, resolution : Geometry.Vec2) {
            if (rotation == null) {
                // throw new Exception("Rotation must not be null!");
            }
            if (position == null) {
                // throw new Exception("Position must not be null!");
            }
            if (horizontalAngleOfView == null) {
                // throw new System.Exception("Horizontal AOV must not be null!");
            }
            if (verticalAngleOfView == null) {
                // throw new System.Exception("Vertical AOV must not be null!");
            }
            if (resolution.getX() < 1) {
                // throw new System.Exception("Horizontal resolution must be >1!");
            }
            if (resolution.getY() < 1) {
                // throw new System.Exception("Vertical resolution must be >1!");
            }

            var rotationMatrix : Geometry.Mat3x3 = rotation.getRotationMatrix();


            var rotationMatrixInverse : Geometry.Mat3x3 = rotationMatrix.transpose();

            var worldToCameraTransformation : Geometry.Mat4x4 =
                new Geometry.Mat4x4(rotationMatrixInverse,
                    rotationMatrixInverse.multiplyFromRightByVector(position).scale(-1.0));

            this.worldToCameraTransformation = worldToCameraTransformation;
            this.horizontalAOV = horizontalAngleOfView;
            this.verticalAOV = verticalAngleOfView;
            this.resolution = resolution;

            this.cscreen = new Visualization.CScreen(resolution,
                Math.tan(this.horizontalAOV.getValueRad() / 2.0),
                Math.tan(this.verticalAOV.getValueRad() / 2.0));
        }

        public setWorld(world : World) : void {
            this.world = world;
        }

        public getPixelPosition(pointInWorldCoordinates : Geometry.Vec3) : Geometry.Vec2 {
            var pointWorld4 : Geometry.Vec4 = pointInWorldCoordinates.toHomogenousPoint();
            var pointCamera4 : Geometry.Vec4 = this.worldToCameraTransformation.multiplyFromRightByVector(pointWorld4);

            var res : Geometry.Vec2 = this.cscreen.projectPointToScreen(new Geometry.Vec3(
                [pointCamera4.getElement(0), pointCamera4.getElement(1), pointCamera4.getElement(2)]));

            return res;
        }


        private projectPolygon(polygon : Primitive.Polygon) : Primitive.Polygon {
            var count : number = polygon.getSegmentCount();
            var array : Geometry.Vec3[] = [];

            var buf : Geometry.Vec2;
            var ptr : number = 0;
            for (var i = 0; i < count; i++) {
                buf = this.getPixelPosition(polygon.getSegment(i));
                if (buf != null) {
                    array[ptr++] = new Geometry.Vec3([buf.getX(), buf.getY(), 1.0]);
                }
            }
            // Just for testing!
            if (ptr < 2) {
                return null;
            }
            var array2 : Geometry.Vec3[] = [];
            for (var i = 0; i < ptr; i++) {
                array2[i] = array[i];
            }
            return new Primitive.Polygon(array2, polygon.getFormat());
        }

        public toImage(image : Visualization.ISVG) : void {
            if (this.world == null)
            {
                // throw new Exception("World must not be null!");
            }
            if (image == null)
            {
                // throw new Exception("Image must not be null!");
            }
            image.setResolution(this.resolution);
            var polygons : Primitive.Polygon[] = this.world.getPolygons();
            var buf : Primitive.Polygon;
            for (var i = 0; i < polygons.length; i++)
            {
                buf = this.projectPolygon(polygons[i]);
                if (buf != null)
                {
                    image.addPolygon(buf);
                }
            }
        }


        public getResolution() : Geometry.Vec2 {
            return this.resolution;
        }
    }

    export class World {
        private camera : Camera;
        private polygons : Primitive.Polygon[] = [];

        constructor(camera : Camera) {
            this.camera = camera;
            camera.setWorld(this);
        }


        public addPolygon(polygon : Primitive.Polygon) : void {
            if (polygon == null)
            {
                // throw new Exception("Polygon must not be null!");
            }
            this.polygons.push(polygon);
        }

        public getPolygons() : Primitive.Polygon[] {
            return this.polygons;
        }
    }

}

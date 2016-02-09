/**
 * Created by Ray on 07.02.2016.
 */

module Format {
    export class RGB {
        private red : number;
        private green : number;
        private blue : number;

        constructor(red : number, green : number, blue : number)
        {
            this.red = red;
            this.green = green;
            this.blue = blue;
        }

        public toString() : String {
            return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        }

        public toHEXString() : string {
            return "#" + RGB.nibbleToHEX(this.red >> 4) + RGB.nibbleToHEX(this.red & 15) + RGB.nibbleToHEX(this.green >> 4)
                + RGB.nibbleToHEX(this.green & 15) + RGB.nibbleToHEX(this.blue >> 4) + RGB.nibbleToHEX(this.blue & 15);
        }

        private static nibbleToHEX(nibble : number) : String {
            if (nibble < 0 || nibble > 15) {
                // throw new Exception("Nibble must be in [0, 15]!");
                return "";
            }
            if (nibble < 10) {
                return "" + nibble;
            }
            switch (nibble) {
                case 10:
                    return "A";
                case 11:
                    return "B";
                case 12:
                    return "C";
                case 13:
                    return "D";
                case 14:
                    return "E";
                case 15:
                    return "F";
                default:
                    return "";
            }
        }
    }

    export class FormatContainer {
        private fill : RGB;
        private stroke : RGB;
        private strokeWidth : number;

        constructor(fill : RGB, stroke : RGB, strokeWidth : number) {
            // Fill can be null : fill="none"
            if (stroke == null) {
                // throw new Exception("Stroke must not be null!");
            }
            if (strokeWidth <= 0) {
                // throw new Exception("Stroke-width must be >0!");
            }
            this.fill = fill;
            this.stroke = stroke;
            this.strokeWidth = strokeWidth;
        }

        public getFill() : RGB {
            return this.fill;
        }

        public getStroke() : RGB {
            return this.stroke;
        }

        public getStrokeWidth() : number {
            return this.strokeWidth;
        }

        public toString() : String {
            var strfill : String;
            if (this.fill == null)
            {
                strfill = "none";
            }
            else
            {
                strfill = this.fill.toString();
            }
            return "fill=\"" + strfill + "\" stroke=\"" + this.stroke.toString()
                + "\" stroke-width=\"" + this.strokeWidth + "\"";
        }
    }
}

module Geometry {
    export class Angle {
        private radValue:number;

        public constructor(radValue:number) {
            this.radValue = radValue % (2 * Math.PI);
            if (this.radValue > Math.PI) {
                this.radValue -= 2 * Math.PI;
            }
            else if (this.radValue <= -Math.PI) {
                this.radValue += 2 * Math.PI;
            }
        }

        public  getValueRad():number {
            return this.radValue;
        }
    }

    enum Axis {
        x, y, z
    }

    export class Vec4 {
        private values:number[];

        public constructor(values:number[]) {
            if (values == null) {
                // throw new Exception("Values must not be null!");
            }
            if (values.length != 4) {
                // throw new Exception("The length of values must be 4!");
            }
            this.values = values;
        }


        public getElement(index:number):number {
            return this.values[index];
        }
    }

    export class Vec2 {
        private x:number;
        private y:number;

        constructor(x:number, y:number) {
            this.x = x;
            this.y = y;
        }

        public getX():number {
            return this.x;
        }

        public getY():number {
            return this.y;
        }
    }

    export class Vec3 {
        private values:number[];

        constructor(values:number[]) {
            this.values = values;
        }

        public getElement(index:number):number {
            return this.values[index];
        }

        public scale(factor:number) {
            var scaledValues = [];
            scaledValues[0] = factor * this.values[0];
            scaledValues[1] = factor * this.values[1];
            scaledValues[2] = factor * this.values[2];

            return new Vec3(scaledValues);
        }

        public getScalarProduct(otherVector:Vec3) {
            var buf = 0;
            for (var i = 0; i < 3; i++) {
                buf += this.getElement(i) * otherVector.getElement(i);
            }
            return Math.sqrt(buf);
        }

        public add(otherVector:Vec3):Vec3 {
            var res = new Vec3([this.values[0] + otherVector.values[0], this.values[1] + otherVector.values[1],
                this.values[2] + otherVector.values[2]]);

            return res;
        }

        public getCrossProduct(rightSide:Vec3):Vec3 {
            var res = new Vec3(
                [this.getElement(1) * rightSide.getElement(2) - this.getElement(2) * rightSide.getElement(1),
                    this.getElement(2) * rightSide.getElement(0) - this.getElement(0) * rightSide.getElement(2),
                    this.getElement(0) * rightSide.getElement(1) - this.getElement(1) * rightSide.getElement(0)]);
            return res;
        }

        public getLength():number {
            return Math.sqrt(this.getElement(0) * this.getElement(0) + this.getElement(1)
                * this.getElement(1) + this.getElement(2) * this.getElement(2));
        }

        public normalize():Vec3 {
            var factor = 1.0 / this.getLength();
            var res = new Vec3([factor * this.getElement(0), factor * this.getElement(1),
                factor * this.getElement(2)]);
            return res;
        }

        public toHomogenousVector():Vec4 {
            var vec4 = new Vec4([this.getX(), this.getY(), this.getZ(), 0.0]);
            return vec4;
        }

        public toHomogenousPoint():Vec4 {
            var point4 = new Vec4([this.getX(), this.getY(), this.getZ(), 1.0]);
            return point4;
        }

        public getX():number {
            return this.getElement(0);
        }

        public getY():number {
            return this.getElement(1);
        }

        public getZ():number {
            return this.getElement(2);
        }

        public getPerpendicularVector():Vec3 {
            //if (CMMath.Math.NumericEngine.compareEquals(this.getLength(), 0.0)) {
            // throw new Exception("Null vector support has not been implemented yet!");
            //}

            var res = this.getCrossProduct(new Vec3([1, 0, 0]));
            if (res.getLength() > 0) {
                return res.normalize();
            }
            else {
                res = this.getCrossProduct(new Vec3([0, 1, 0]));
                return res.normalize();
            }
        }
    }

    export class Mat3x3 {
        private values:number[];

        constructor(values:number[]) {
            this.values = values;
        }

        public static getSingleAxisRotationMatrix(rotation:Angle, axis:Axis):Mat3x3 {
            if (rotation == null) {
                // throw new Exception("Rotation must not be null!");
            }

            var cos = Math.cos(rotation.getValueRad());
            var sin = Math.sin(rotation.getValueRad());

            var values = [];
            for (var k = 0; k < 9; k++) {
                values.push(0);
            }

            if (axis == Axis.x) {
                Mat3x3.setElementOfArray(values, 0, 0, 1);
                Mat3x3.setElementOfArray(values, 1, 1, cos);
                Mat3x3.setElementOfArray(values, 2, 2, cos);
                Mat3x3.setElementOfArray(values, 2, 1, sin);
                Mat3x3.setElementOfArray(values, 1, 2, -sin);
            }
            else if (axis == Axis.y) {
                Mat3x3.setElementOfArray(values, 1, 1, 1);
                Mat3x3.setElementOfArray(values, 0, 0, cos);
                Mat3x3.setElementOfArray(values, 2, 2, cos);
                Mat3x3.setElementOfArray(values, 0, 2, sin);
                Mat3x3.setElementOfArray(values, 2, 0, -sin);
            }
            else if (axis == Axis.z) {
                Mat3x3.setElementOfArray(values, 2, 2, 1);
                Mat3x3.setElementOfArray(values, 0, 0, cos);
                Mat3x3.setElementOfArray(values, 1, 1, cos);
                Mat3x3.setElementOfArray(values, 1, 0, sin);
                Mat3x3.setElementOfArray(values, 0, 1, -sin);
            }
            else {
                // throw new Exception("Axis must be x, y or z!");
            }

            return new Mat3x3(values);
        }

        public static getMultiAxisRotationMatrix(rotX:Angle, rotY:Angle, rotZ:Angle) {
            var values = [];
            var res =
                Mat3x3.getSingleAxisRotationMatrix(rotZ, Axis.z).multiplyFromRight(
                    Mat3x3.getSingleAxisRotationMatrix(rotY, Axis.y).multiplyFromRight(
                        Mat3x3.getSingleAxisRotationMatrix(rotX, Axis.x)));

            return res;
        }

        private static setElementOfArray(array:number[], i:number, j:number, value:number):void {
            array[3 * i + j] = value;
        }

        private static getElementOfArray(array:number[], i:number, j:number):number {
            return array[3 * i + j];
        }

        public getElement(i:number, j:number):number {
            return this.values[3 * i + j];
        }

        public multiplyFromRight(otherMatrix:Mat3x3):Mat3x3 {
            var buf = [];

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    Mat3x3.setElementOfArray(buf, i, j, 0.0);
                    for (var k = 0; k < 3; k++) {
                        Mat3x3.setElementOfArray(buf, i, j,
                            Mat3x3.getElementOfArray(buf, i, j) + this.getElement(i, k) * otherMatrix.getElement(k, j));
                    }
                }
            }
            return new Mat3x3(buf);
        }

        public multiplyFromRightByVector(vector:Geometry.Vec3) {
            var buf = [];

            for (var i = 0; i < 3; i++) {
                buf[i] = 0.0;
                for (var j = 0; j < 3; j++) {
                    buf[i] += this.getElement(i, j) * vector.getElement(j);
                }
            }

            return new Geometry.Vec3(buf);
        }


        public transpose():Mat3x3 {
            var res:number[] = [];
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    res[3 * i + j] = this.getElement(j, i);
                }
            }
            return new Mat3x3(res);
        }
    }

    export class Rot3 {
        private rotationX:Angle;
        private rotationY:Angle;
        private rotationZ:Angle;

        private rotationMatrix:Mat3x3;

        constructor(rotationX:Angle, rotationY:Angle, rotationZ:Angle) {
            this.rotationX = rotationX;
            this.rotationY = rotationY;
            this.rotationZ = rotationZ;

            this.refreshRotationMatrix();
        }

        public getRotationX():Angle {
            return this.rotationX;
        }

        public getRotationY():Angle {
            return this.rotationY;
        }

        public getRotationZ():Angle {
            return this.rotationZ;
        }

        public getRotationMatrix():Mat3x3 {
            return this.rotationMatrix;
        }


        private refreshRotationMatrix():void {
            var rotX = Mat3x3.getSingleAxisRotationMatrix(this.rotationX, Axis.x);
            var rotY = Mat3x3.getSingleAxisRotationMatrix(this.rotationY, Axis.y);
            var rotZ = Mat3x3.getSingleAxisRotationMatrix(this.rotationZ, Axis.z);

            this.rotationMatrix = rotZ.multiplyFromRight(rotY.multiplyFromRight(rotX));
        }
    }

    export class Mat4x4 {

        private values:number[];

        constructor(rotation:Mat3x3, translation:Vec3) {
            if (rotation == null) {
                // throw new Exception("Rotation must not be null!");
            }
            if (translation == null) {
                // throw new Exception("Translation must not be null!");
            }

            this.values = [];

            for (var k = 0; k < 16; k++) {
                this.values.push(0);
            }

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var buf:number = rotation.getElement(i, j);
                    this.values[4 * i + j] = buf;
                }
            }

            for (var k = 0; k < 3; k++) {
                this.values[4 * k + 3] = translation.getElement(k);
            }

            this.values[4 * 3 + 3] = 1;
        }


        public getElement(i:number, j:number):number {
            return this.values[4 * i + j];
        }


        public multiplyFromRightByVector(vector:Vec4):Vec4 {
            var buf = [];

            for (var i = 0; i < 4; i++) {
                buf[i] = 0;
                for (var j = 0; j < 4; j++) {
                    buf[i] += this.getElement(i, j) * vector.getElement(j);
                }
            }
            return new Vec4(buf);
        }
    }
}

module Primitive {
    export class Polygon {
        private segments : Geometry.Vec3[];
        private format : Format.FormatContainer;

        constructor(segments : Geometry.Vec3[], format : Format.FormatContainer) {
            if (format == null) {
                // throw new Exception("Format must not be null!");
            }
            if (segments == null) {
                // throw new Exception("Segments must not be null!");
            }
            if (segments.length < 2) {
                // throw new Exception("Length of segments must be >2!");
            }
            this.format = format;
            this.segments = segments;
        }

        public getSegmentCount() : number {
            return this.segments.length;
        }

        public getSegment(index : number) : Geometry.Vec3 {
            if (index < 0 || index >= this.getSegmentCount())
            {
                // throw new Exception("Index must be in [0, length - 1]!");
            }
            return this.segments[index];
        }

        public getFormat() : Format.FormatContainer {
            return this.format;
        }
    }

    export class Circle {
        private position : Geometry.Vec3;
        private normal : Geometry.Vec3;
        private u : Geometry.Vec3;
        private radius : number;
        private format : Format.FormatContainer;

        constructor(position : Geometry.Vec3, normal : Geometry.Vec3, radius : number, format : Format.FormatContainer) {
            if (format == null)
            {
                // throw new Exception("Format must not be null!");
            }
            if (position == null)
            {
                // throw new Exception("Position must not be null!");
            }
            if (normal == null)
            {
                // throw new Exception("Normal must not be null!");
            }
            this.format = format;
            this.position = position;
            this.normal = normal;
            this.radius = radius;
            this.u = this.normal.getPerpendicularVector();
        }

        public getPoint(parameter : Geometry.Angle) : Geometry.Vec3 {
            // r*cos(t)*u + r*sin(t)*nxu + C
            var vec1 = this.u.scale(this.radius * Math.cos(parameter.getValueRad()));
            var vec2 = (this.normal.getCrossProduct(this.u)).scale(this.radius * Math.sin(parameter.getValueRad()));
            var result = (vec1.add(vec2)).add(this.position);

            return result;
        }

        public getFormat() : Format.FormatContainer {
            return this.format;
        }

        public toPolygon(n : number) : Polygon {
            if (n <= 2 || n > 1800)
            {
                // throw new Exception("N must be in [3, 1800]!");
            }
            var array = [];

            var parameter : number;
            for (var i = 0; i < n; i++)
            {
                parameter = (i / n) * 2 * Math.PI;
                var angle = new Geometry.Angle(parameter);
                array[i] = this.getPoint(angle);
            }

            return new Polygon(array, this.format);
        }
    }
}

module Visualization {

    export interface ISVG {
        setResolution(resolution:Geometry.Vec2) : void;

        addPolygon(polygon:Primitive.Polygon) : void;

        refresh() : void;

        clear() : void;
    }

    export class DOMSVG implements ISVG {
        private resolution:Geometry.Vec2;
        private polygons:Primitive.Polygon[] = [];
        private svg:any;

        constructor(svg:any) {
            this.svg = svg;
        }

        public clear() {
            this.polygons = [];
            while (this.svg.children.length != 0) {
                this.svg.removeChild(this.svg.children[0]);
            }
        }

        public setResolution(resolution:Geometry.Vec2):void {
            this.resolution = resolution;
        }

        public addPolygon(polygon:Primitive.Polygon):void {
            if (polygon == null) {
                // throw new Exception("Polygon must not be null!");
            }
            this.polygons.push(polygon);
        }

        public refresh():void {
            this.svg.setAttribute('id', "augsvg");
            this.svg.setAttribute('width', "" + this.resolution.getX());
            this.svg.setAttribute('height', "" + this.resolution.getY());
            var svgNS = this.svg.namespaceURI;

            var strbuf;
            for (var i = 0; i < this.polygons.length; i++) {
                var path = document.createElementNS(svgNS, 'path');
                var sc:number = this.polygons[i].getSegmentCount();
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
        private resolution:Geometry.Vec2;
        private width:number;
        private height:number;

        private bottomLeft:Geometry.Vec3;
        private invertX:boolean = false;
        private invertY:boolean = true;

        // All the calculations are in the camera coordinate system.
        // The screen is in the z == 1 plane.
        // The position of the camera is [0, 0, 0].
        //  In other words: The camera looks into the z+ direction.
        //  The 'up' vector equals y+.

        constructor(resolution:Geometry.Vec2, width:number, height:number) {
            this.resolution = resolution;
            this.width = width;
            this.height = height;

            this.bottomLeft = new Geometry.Vec3([-width / 2, -height / 2, 1.0]);
        }


        public projectPointToScreen(point:Geometry.Vec3):Geometry.Vec2 {
            var screenPoint:Geometry.Vec3 = this.projectPointToScreenPoint(point);
            if (screenPoint == null) {
                return null;
            }
            var pp:Geometry.Vec2 = this.projectScreenPointToPixel(screenPoint);

            if (pp == null) {
                return null;
            }
            return pp;
        }

        private projectScreenPointToPixel(screenPoint:Geometry.Vec3):Geometry.Vec2 {
            //if (!CMMath.Math.NumericEngine.compareEquals(screenPoint.getElement(2), 1.0)) {
            // throw new Exception("Z of the screenPoint must be 1.0!");
            //}
            var x:number = screenPoint.getElement(0) - this.bottomLeft.getElement(0);
            var y:number = screenPoint.getElement(1) - this.bottomLeft.getElement(1);

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

            var pp:Geometry.Vec2 = new Geometry.Vec2(x, y);

            return pp;
        }


        private projectPointToScreenPoint(point:Geometry.Vec3):Geometry.Vec3 {
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
            var z:number = point.getElement(2);
            var res:Geometry.Vec3 = new Geometry.Vec3([point.getElement(0) / z,
                point.getElement(1) / z, 1.0]);
            return res;
        }
    }

    export class Camera {
        private world:World;
        private worldToCameraTransformation:Geometry.Mat4x4;
        private horizontalAOV:Geometry.Angle;
        private verticalAOV:Geometry.Angle;
        private resolution:Geometry.Vec2;

        private cscreen:Visualization.CScreen;


        constructor(rotation:Geometry.Rot3, position:Geometry.Vec3,
                    horizontalAngleOfView:Geometry.Angle, verticalAngleOfView:Geometry.Angle, resolution:Geometry.Vec2) {
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

            var rotationMatrix:Geometry.Mat3x3 = rotation.getRotationMatrix();


            var rotationMatrixInverse:Geometry.Mat3x3 = rotationMatrix.transpose();

            var worldToCameraTransformation:Geometry.Mat4x4 =
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

        public setWorld(world:World):void {
            this.world = world;
        }

        public getPixelPosition(pointInWorldCoordinates:Geometry.Vec3):Geometry.Vec2 {
            var pointWorld4:Geometry.Vec4 = pointInWorldCoordinates.toHomogenousPoint();
            var pointCamera4:Geometry.Vec4 = this.worldToCameraTransformation.multiplyFromRightByVector(pointWorld4);

            var res:Geometry.Vec2 = this.cscreen.projectPointToScreen(new Geometry.Vec3(
                [pointCamera4.getElement(0), pointCamera4.getElement(1), pointCamera4.getElement(2)]));

            return res;
        }


        private projectPolygon(polygon:Primitive.Polygon):Primitive.Polygon {
            var count:number = polygon.getSegmentCount();
            var array:Geometry.Vec3[] = [];

            var buf:Geometry.Vec2;
            var ptr:number = 0;
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
            var array2:Geometry.Vec3[] = [];
            for (var i = 0; i < ptr; i++) {
                array2[i] = array[i];
            }
            return new Primitive.Polygon(array2, polygon.getFormat());
        }

        public toImage(image:Visualization.ISVG):void {
            if (this.world == null) {
                // throw new Exception("World must not be null!");
            }
            if (image == null) {
                // throw new Exception("Image must not be null!");
            }
            image.setResolution(this.resolution);
            var polygons:Primitive.Polygon[] = this.world.getPolygons();
            var buf:Primitive.Polygon;
            for (var i = 0; i < polygons.length; i++) {
                buf = this.projectPolygon(polygons[i]);
                if (buf != null) {
                    image.addPolygon(buf);
                }
            }
        }


        public getResolution():Geometry.Vec2 {
            return this.resolution;
        }
    }

    export class World {
        private camera:Camera;
        private polygons:Primitive.Polygon[] = [];

        constructor(camera:Camera) {
            this.camera = camera;
            camera.setWorld(this);
        }


        public addPolygon(polygon:Primitive.Polygon):void {
            if (polygon == null) {
                // throw new Exception("Polygon must not be null!");
            }
            this.polygons.push(polygon);
        }

        public getPolygons():Primitive.Polygon[] {
            return this.polygons;
        }
    }

}
module ARFactory {
    export class Drawer {

        public static createEmptySVG(svg : Node) : Visualization.ISVG {
            return new Visualization.DOMSVG(svg);
        }

        public static drawSimpleCircleAutoClear(image : Visualization.ISVG) : void {
            image.clear();
            Drawer.drawSimpleCircle(image);
            image.refresh();
        }

        public static drawSimpleCircle(image : Visualization.ISVG) : void {

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
                Debug.CircleValuesBuffer.circleStrokeWidth);

            var circlePosition : Geometry.Vec3 = new Geometry.Vec3([vx, vy, vz]);
            var circleNormal : Geometry.Vec3 = new Geometry.Vec3([nx, ny, nz]).normalize();

            var circle : Primitive.Circle = new Primitive.Circle(circlePosition, circleNormal, cr, circleFormat);

            // The segment count of the polygon the circle should be converted to.
            var polygonSegmentCount : number = Debug.CircleValuesBuffer.polygonSegmentCount;
            var polygon : Primitive.Polygon = circle.toPolygon(polygonSegmentCount);

            // The camera rotation values in degrees.
            var krx : number = Debug.CameraValuesBuffer.cameraRotationX;
            var kry : number = Debug.CameraValuesBuffer.cameraRotationY;
            var krz : number = Debug.CameraValuesBuffer.cameraRotationZ;

            var cameraRotation : Geometry.Rot3 = new Geometry.Rot3(new Geometry.Angle(Drawer.deg2rad(krx)),
                new Geometry.Angle(Drawer.deg2rad(kry)), new Geometry.Angle(Drawer.deg2rad(krz)));

            var rotationMatrix : Geometry.Mat3x3 = cameraRotation.getRotationMatrix();

            var rotationMatrixInverse : Geometry.Mat3x3 = rotationMatrix.transpose();

            // Camera position.
            var kpx : number = Debug.CameraValuesBuffer.cameraPositionX;
            var kpy : number = Debug.CameraValuesBuffer.cameraPositionY;
            var kpz : number = Debug.CameraValuesBuffer.cameraPositionZ;

            var cameraPosition : Geometry.Vec3 = new Geometry.Vec3([kpx, kpy, kpz]);
            var transformationMatrix : Geometry.Mat4x4 = new Geometry.Mat4x4(rotationMatrixInverse,
                rotationMatrixInverse.multiplyFromRightByVector(cameraPosition).scale(-1.0));

            // Camera Horizontal and Vertical Angle Of View.
            var khaov : number = Debug.CameraValuesBuffer.cameraHorizontalAOV;
            var kvaov : number = Debug.CameraValuesBuffer.cameraVerticalAOV;

            var cameraHAOV : Geometry.Angle = new Geometry.Angle(Drawer.deg2rad(khaov));
            var cameraVAOV : Geometry.Angle = new Geometry.Angle(Drawer.deg2rad(kvaov));

            // Camera horizontal and vertical resolution.
            var khres : number = Debug.CameraValuesBuffer.cameraResolutionHorizontal;
            var kvres : number = Debug.CameraValuesBuffer.cameraResolutionVertical;

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

    var kvb = new CameraValuesBuffer();
    var cvb = new CircleValuesBuffer();

    var mydomsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    var mydiv = document.getElementById("divParkingSVG");

    var myisvg = ARFactory.Drawer.createEmptySVG(mydomsvg);

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

    Debug.DebugGUI.drawCommonDebugGUI();

    ARFactory.Drawer.drawSimpleCircleAutoClear(myisvg);

    myisvg.refresh();
}

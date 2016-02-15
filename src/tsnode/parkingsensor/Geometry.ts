/**
 * @author David G.
 */

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

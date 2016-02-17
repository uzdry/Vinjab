/**
 * @author David G.
 */

///<reference path="./../../src/tsnode/parkingsensor/Geometry.ts"/>
///<reference path="../typings/jasmine/jasmine.d.ts"/>

describe("Geometry", function () {
    it("ArrayNormalizer - Tests the Array Normalizer constructor", function () {
        var arrayNormalizer = new Geometry.ArrayNormalizer();
        expect(arrayNormalizer.constructor.toString()).toEqual(new Geometry.ArrayNormalizer().constructor.toString());
    });

    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = [0, 1, 2];
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, 2);
        expect(res.length).toEqual(2);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(1);
    });

    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = [0, 1, 2];
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, 4);
        expect(res.length).toEqual(4);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(1);
        expect(res[2]).toEqual(2);
        expect(res[3]).toEqual(0);
    });

    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = [0, 1, 2];
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, 3);
        expect(res.length).toEqual(3);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(1);
        expect(res[2]).toEqual(2);
    });

    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = [];
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, 0);
        expect(res.length).toEqual(0);
    });


    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = null;
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, 0);
        expect(res.length).toEqual(0);
    });

    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = null;
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, -7);
        expect(res.length).toEqual(0);
    });

    it("ArrayNormalizer - Tests the Array Normalizer static function", function () {
        var array = [0, 1, 2];
        var res : number[] = Geometry.ArrayNormalizer.normalize(array, -3);
        expect(res.length).toEqual(0);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var angle = new Geometry.Angle(0.0);
        expect(angle.getValueRad()).toBeCloseTo(0.0, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = 2.0;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(buf, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = -1.5;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(buf, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = 3 * Math.PI;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(Math.PI, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = Math.PI + 1.0;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(-Math.PI + 1.0, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = 15.0;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(buf - 4 * Math.PI, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = -5.0;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(buf + 2 * Math.PI, 6);
    });

    it("Angle - Tests the constructor of Angle", function () {
        var buf:number = -10.0;
        var angle = new Geometry.Angle(buf);
        expect(angle.getValueRad()).toBeCloseTo(buf + 4 * Math.PI, 6);
    });

    it("Vec4 - Tests the constructor of Vec4", function () {
        var vec4 = new Geometry.Vec4(null);
        expect(vec4.getElement(0)).toEqual(0);
        expect(vec4.getElement(1)).toEqual(0);
        expect(vec4.getElement(2)).toEqual(0);
        expect(vec4.getElement(3)).toEqual(0);
    });

    it("Vec4 - Tests the constructor of Vec4", function () {
        var vec4 = new Geometry.Vec4([1, 2, 3]);
        expect(vec4.getElement(0)).toEqual(1);
        expect(vec4.getElement(1)).toEqual(2);
        expect(vec4.getElement(2)).toEqual(3);
        expect(vec4.getElement(3)).toEqual(0);
    });

    it("Vec4 - Tests the constructor of Vec4", function () {
        var vec4 = new Geometry.Vec4([1, 2, 3, 4]);
        expect(vec4.getElement(0)).toEqual(1);
        expect(vec4.getElement(1)).toEqual(2);
        expect(vec4.getElement(2)).toEqual(3);
        expect(vec4.getElement(3)).toEqual(4);
    });

    it("Vec4 - Tests the constructor of Vec4", function () {
        var vec4 = new Geometry.Vec4([1, 2, 3, 4, 5]);
        expect(vec4.getElement(0)).toEqual(1);
        expect(vec4.getElement(1)).toEqual(2);
        expect(vec4.getElement(2)).toEqual(3);
        expect(vec4.getElement(3)).toEqual(4);
    });

    it("Vec2 - Tests the constructor of Vec2", function () {
        var vec2 = new Geometry.Vec2(2, 3);
        expect(vec2.getX()).toEqual(2);
        expect(vec2.getY()).toEqual(3);
    });

    it("Vec3 - Tests the constructor of Vec3", function () {
        var vec3 = new Geometry.Vec3([1, 2, 3]);
        expect(vec3.getElement(0)).toEqual(1);
        expect(vec3.getElement(1)).toEqual(2);
        expect(vec3.getElement(2)).toEqual(3);
    });

    it("Vec3 - Tests the constructor of Vec3", function () {
        var vec3 = new Geometry.Vec3([1, 2]);
        expect(vec3.getElement(0)).toEqual(1);
        expect(vec3.getElement(1)).toEqual(2);
        expect(vec3.getElement(2)).toEqual(0);
    });

    it("Vec3 - Tests the constructor of Vec3", function () {
        var vec3 = new Geometry.Vec3([1, 2, 3, 4]);
        expect(vec3.getElement(0)).toEqual(1);
        expect(vec3.getElement(1)).toEqual(2);
        expect(vec3.getElement(2)).toEqual(3);
    });

    it("Vec3 - Tests the constructor of Vec3", function () {
        var vec3 = new Geometry.Vec3(null);
        expect(vec3.getElement(0)).toEqual(0);
        expect(vec3.getElement(1)).toEqual(0);
        expect(vec3.getElement(2)).toEqual(0);
    });

    it("Vec3 - Tests the scale function of Vec3", function () {
        var vec3 = new Geometry.Vec3([1, 2, 3]);
        var scaledVector = vec3.scale(-3.5);
        expect(vec3.getElement(0)).toEqual(1);
        expect(vec3.getElement(1)).toEqual(2);
        expect(vec3.getElement(2)).toEqual(3);
        expect(scaledVector.getElement(0)).toBeCloseTo(-3.5, 6);
        expect(scaledVector.getElement(1)).toBeCloseTo(-7, 6);
        expect(scaledVector.getElement(2)).toBeCloseTo(-10.5, 6);
    });

    it("Vec3 - Tests the scale function of Vec3", function () {
        var vec3 = new Geometry.Vec3([7, -3, 5]);
        var scaledVector = vec3.scale(2.0);

        expect(vec3.getElement(0)).toEqual(7);
        expect(vec3.getElement(1)).toEqual(-3);
        expect(vec3.getElement(2)).toEqual(5);

        expect(scaledVector.getElement(0)).toBeCloseTo(14, 6);
        expect(scaledVector.getElement(1)).toBeCloseTo(-6, 6);
        expect(scaledVector.getElement(2)).toBeCloseTo(10, 6);
    });

    it("Vec3 - Tests the scalar product function of Vec3", function () {
        var vec3a = new Geometry.Vec3([7, -3, 5]);
        var vec3b = new Geometry.Vec3([1, 2, 4]);
        expect(vec3a.getScalarProduct(vec3b)).toBeCloseTo(vec3b.getScalarProduct(vec3a), 6);
        expect(vec3a.getScalarProduct(vec3b)).toBeCloseTo(Math.sqrt(7 * 1 + (-3) * 2 + 5 * 4), 6);
    });

    it("Vec3 - Tests the add function of Vec3", function () {
        var vec3a = new Geometry.Vec3([7, -3, 5]);
        var vec3b = new Geometry.Vec3([1, 2, 4]);
        expect(vec3a.add(vec3b).getElement(0)).toBeCloseTo(vec3b.add(vec3a).getElement(0), 6);
        expect(vec3a.add(vec3b).getElement(1)).toBeCloseTo(vec3b.add(vec3a).getElement(1), 6);
        expect(vec3a.add(vec3b).getElement(2)).toBeCloseTo(vec3b.add(vec3a).getElement(2), 6);
        expect(vec3a.add(vec3b).getElement(0)).toBeCloseTo(8, 6);
        expect(vec3a.add(vec3b).getElement(1)).toBeCloseTo(-1, 6);
        expect(vec3a.add(vec3b).getElement(2)).toBeCloseTo(9, 6);
    });

    it("Vec3 - Tests the cross product function of Vec3", function () {
        var vec3a = new Geometry.Vec3([3, -3, 1]);
        var vec3b = new Geometry.Vec3([4, 9, 2]);
        expect(vec3a.getCrossProduct(vec3b).getElement(0)).toBeCloseTo(-1.0 * vec3b.getCrossProduct(vec3a).getElement(0), 6);
        expect(vec3a.getCrossProduct(vec3b).getElement(1)).toBeCloseTo(-1.0 * vec3b.getCrossProduct(vec3a).getElement(1), 6);
        expect(vec3a.getCrossProduct(vec3b).getElement(2)).toBeCloseTo(-1.0 * vec3b.getCrossProduct(vec3a).getElement(2), 6);
        expect(vec3a.getCrossProduct(vec3b).getElement(0)).toBeCloseTo(-15, 6);
        expect(vec3a.getCrossProduct(vec3b).getElement(1)).toBeCloseTo(-2, 6);
        expect(vec3a.getCrossProduct(vec3b).getElement(2)).toBeCloseTo(39, 6);
    });

    it("Vec3 - Tests the length function of Vec3", function () {
        var vec3a = new Geometry.Vec3([3, -7, 1]);
        expect(vec3a.getLength()).toBeCloseTo(Math.sqrt(3 * 3 + (-7) * (-7) + 1 * 1), 6);
    });

    it("Vec3 - Tests the normalize function of Vec3", function () {
        var vec3a = new Geometry.Vec3([3, 0, 0]);
        var vec3b = vec3a.normalize();
        expect(vec3b.getLength()).toBeCloseTo(1.0, 6);
        expect(vec3b.getCrossProduct(vec3a).getLength()).toBeCloseTo(0.0, 6);
        expect(vec3a.getCrossProduct(vec3b).getLength()).toBeCloseTo(0.0, 6);
        expect(vec3b.getElement(0)).toBeCloseTo(1.0, 6);
        expect(vec3b.getElement(1)).toBeCloseTo(0.0, 6);
        expect(vec3b.getElement(2)).toBeCloseTo(0.0, 6);
        expect(vec3a.getElement(0)).toEqual(3.0);
        expect(vec3a.getElement(1)).toEqual(0.0);
        expect(vec3a.getElement(2)).toEqual(0.0);
    });

    it("Vec3 - Tests the normalize function of Vec3", function () {
        var vec3a = new Geometry.Vec3([3, -7, 1]);
        var vec3b = vec3a.normalize();
        expect(vec3b.getLength()).toBeCloseTo(1.0, 6);
        expect(vec3b.getCrossProduct(vec3a).getLength()).toBeCloseTo(0.0, 6);
        expect(vec3a.getCrossProduct(vec3b).getLength()).toBeCloseTo(0.0, 6);
        expect(vec3a.getElement(0)).toEqual(3.0);
        expect(vec3a.getElement(1)).toEqual(-7.0);
        expect(vec3a.getElement(2)).toEqual(1.0);
    });

    it("Vec3 - Tests the length function of Vec3", function () {
        var vec3a = new Geometry.Vec3([3, -7, 1]);
        expect(vec3a.getLength()).toBeCloseTo(Math.sqrt(3 * 3 + (-7) * (-7) + 1 * 1), 6);
    });

    it("Vec3 - Tests the To Homogenous Vector converter function of Vec3", function () {
        var vec3a = new Geometry.Vec3([6, 9, -3]);
        var vec4a = vec3a.toHomogenousVector();
        expect(vec4a.getElement(0)).toBeCloseTo(vec3a.getElement(0), 6);
        expect(vec4a.getElement(1)).toBeCloseTo(vec3a.getElement(1), 6);
        expect(vec4a.getElement(2)).toBeCloseTo(vec3a.getElement(2), 6);
        expect(vec4a.getElement(3)).toBeCloseTo(0.0, 6);
    });

    it("Vec3 - Tests the To Homogenous Point converter function of Vec3", function () {
        var vec3a = new Geometry.Vec3([13, -9, 5]);
        var vec4a = vec3a.toHomogenousPoint();
        expect(vec4a.getElement(0)).toBeCloseTo(vec3a.getElement(0), 6);
        expect(vec4a.getElement(1)).toBeCloseTo(vec3a.getElement(1), 6);
        expect(vec4a.getElement(2)).toBeCloseTo(vec3a.getElement(2), 6);
        expect(vec4a.getElement(3)).toBeCloseTo(1.0, 6);
    });

    it("Vec3 - Tests the Get X/Y/Z functions of Vec3", function () {
        var vec3a = new Geometry.Vec3([6, 9, -3]);
        expect(vec3a.getElement(0)).toEqual(vec3a.getX());
        expect(vec3a.getElement(1)).toEqual(vec3a.getY());
        expect(vec3a.getElement(2)).toEqual(vec3a.getZ());
    });

    it("Vec3 - Tests the Get X/Y/Z functions of Vec3", function () {
        var vec3a = new Geometry.Vec3(null);
        expect(vec3a.getElement(0)).toEqual(vec3a.getX());
        expect(vec3a.getElement(1)).toEqual(vec3a.getY());
        expect(vec3a.getElement(2)).toEqual(vec3a.getZ());
    });

    it("Vec3 - Tests the Get X/Y/Z functions of Vec3", function () {
        var vec3a = new Geometry.Vec3([0, 0, -1]);
        expect(vec3a.getElement(0)).toEqual(vec3a.getX());
        expect(vec3a.getElement(1)).toEqual(vec3a.getY());
        expect(vec3a.getElement(2)).toEqual(vec3a.getZ());
    });

    it("Vec3 - Tests the Get Perpendicular Vector functions of Vec3", function () {
        var vec3a = new Geometry.Vec3([1.0, 0, 0]);
        var vec3b = vec3a.getPerpendicularVector();

        expect(vec3a.getScalarProduct(vec3b) / (vec3a.getLength() * vec3b.getLength())).toBeCloseTo(0.0, 6);
        expect(vec3b.getScalarProduct(vec3a) / (vec3a.getLength() * vec3b.getLength())).toBeCloseTo(0.0, 6);
    });

    it("Vec3 - Tests the Get Perpendicular Vector functions of Vec3", function () {
        var vec3a = new Geometry.Vec3([1.0, 3.0, -2.0]);
        var vec3b = vec3a.getPerpendicularVector();

        expect(vec3a.getScalarProduct(vec3b) / (vec3a.getLength() * vec3b.getLength())).toBeCloseTo(0.0, 6);
        expect(vec3b.getScalarProduct(vec3a) / (vec3a.getLength() * vec3b.getLength())).toBeCloseTo(0.0, 6);
    });

    it("Mat3x3 - Tests the constructor of Mat3x3", function () {
        var mat3x3a = new Geometry.Mat3x3(null);

        expect(mat3x3a.getElement(0, 0)).toEqual(0.0);
        expect(mat3x3a.getElement(0, 1)).toEqual(0.0);
        expect(mat3x3a.getElement(0, 2)).toEqual(0.0);
        expect(mat3x3a.getElement(1, 0)).toEqual(0.0);
        expect(mat3x3a.getElement(1, 1)).toEqual(0.0);
        expect(mat3x3a.getElement(1, 2)).toEqual(0.0);
        expect(mat3x3a.getElement(2, 0)).toEqual(0.0);
        expect(mat3x3a.getElement(2, 1)).toEqual(0.0);
        expect(mat3x3a.getElement(2, 2)).toEqual(0.0);
    });


    it("Mat3x3 - Tests the constructor of Mat3x3", function () {
        var mat3x3a = new Geometry.Mat3x3([1, 2, 3, 4, 5, 6]);

        expect(mat3x3a.getElement(0, 0)).toEqual(1.0);
        expect(mat3x3a.getElement(0, 1)).toEqual(2.0);
        expect(mat3x3a.getElement(0, 2)).toEqual(3.0);
        expect(mat3x3a.getElement(1, 0)).toEqual(4.0);
        expect(mat3x3a.getElement(1, 1)).toEqual(5.0);
        expect(mat3x3a.getElement(1, 2)).toEqual(6.0);
        expect(mat3x3a.getElement(2, 0)).toEqual(0.0);
        expect(mat3x3a.getElement(2, 1)).toEqual(0.0);
        expect(mat3x3a.getElement(2, 2)).toEqual(0.0);
    });


    it("Mat3x3 - Tests the single axis rotation matrix constructor of Mat3x3", function () {
        var angle = new Geometry.Angle(60 * Math.PI / 180);
        var axis = Geometry.Axis.x;
        var mat3x3a = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, axis);
        expect(mat3x3a.getElement(0, 0)).toBeCloseTo(1.0, 6);
        expect(mat3x3a.getElement(0, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(0, 2)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 1)).toBeCloseTo(0.5, 6);
        expect(mat3x3a.getElement(1, 2)).toBeCloseTo(-Math.sqrt(3) / 2, 6);
        expect(mat3x3a.getElement(2, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 1)).toBeCloseTo(Math.sqrt(3) / 2, 6);
        expect(mat3x3a.getElement(2, 2)).toBeCloseTo(0.5, 6);
    });

    it("Mat3x3 - Tests the constructor of Mat3x3", function () {
        var angle = new Geometry.Angle(60 * Math.PI / 180);
        var axis = Geometry.Axis.y;
        var mat3x3a = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, axis)
        expect(mat3x3a.getElement(0, 0)).toBeCloseTo(0.5, 6);
        expect(mat3x3a.getElement(0, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(0, 2)).toBeCloseTo(Math.sqrt(3) / 2, 6);
        expect(mat3x3a.getElement(1, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 1)).toBeCloseTo(1.0, 6);
        expect(mat3x3a.getElement(1, 2)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 0)).toBeCloseTo(-Math.sqrt(3) / 2, 6);
        expect(mat3x3a.getElement(2, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 2)).toBeCloseTo(0.5, 6);
    });

    it("Mat3x3 - Tests the single axis rotation matrix constructor of Mat3x3", function () {
        var angle = new Geometry.Angle(0.0);
        var axis = Geometry.Axis.z;
        var mat3x3a = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, axis);
        expect(mat3x3a.getElement(0, 0)).toBeCloseTo(1.0, 6);
        expect(mat3x3a.getElement(0, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(0, 2)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 1)).toBeCloseTo(1.0, 6);
        expect(mat3x3a.getElement(1, 2)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 2)).toBeCloseTo(1.0, 6);
    });

    it("Mat3x3 - Tests the single axis rotation matrix constructor of Mat3x3 if the Angle is null", function () {
        var axis = Geometry.Axis.y;
        var mat3x3a = Geometry.Mat3x3.getSingleAxisRotationMatrix(null, axis);
        expect(mat3x3a.getElement(0, 0)).toBeCloseTo(1.0, 6);
        expect(mat3x3a.getElement(0, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(0, 2)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(1, 1)).toBeCloseTo(1.0, 6);
        expect(mat3x3a.getElement(1, 2)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 0)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 1)).toBeCloseTo(0.0, 6);
        expect(mat3x3a.getElement(2, 2)).toBeCloseTo(1.0, 6);
    });

    it("Mat3x3 - Tests the multi-axis rotation matrix constructor of Mat3x3", function () {
        var angle = new Geometry.Angle(90.0 * Math.PI / 180.0);
        var mat3x3a = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, Geometry.Axis.x);
        var mat3x3b = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, Geometry.Axis.y);
        var mat3x3c = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, Geometry.Axis.z);

        var matres = mat3x3c.multiplyFromRight(mat3x3b.multiplyFromRight(mat3x3a));
        var mat3rot = Geometry.Mat3x3.getMultiAxisRotationMatrix(angle, angle, angle);
        expect(matres.getElement(0, 0)).toBeCloseTo(mat3rot.getElement(0, 0), 6);
        expect(matres.getElement(0, 1)).toBeCloseTo(mat3rot.getElement(0, 1), 6);
        expect(matres.getElement(0, 2)).toBeCloseTo(mat3rot.getElement(0, 2), 6);
        expect(matres.getElement(1, 0)).toBeCloseTo(mat3rot.getElement(1, 0), 6);
        expect(matres.getElement(1, 1)).toBeCloseTo(mat3rot.getElement(1, 1), 6);
        expect(matres.getElement(1, 2)).toBeCloseTo(mat3rot.getElement(1, 2), 6);
        expect(matres.getElement(2, 0)).toBeCloseTo(mat3rot.getElement(2, 0), 6);
        expect(matres.getElement(2, 1)).toBeCloseTo(mat3rot.getElement(2, 1), 6);
        expect(matres.getElement(2, 2)).toBeCloseTo(mat3rot.getElement(2, 2), 6);
    });

    it("Mat3x3 - Tests the multiply by vector function of Mat3x3", function () {
        var angle = new Geometry.Angle(90.0 * Math.PI / 180.0);
        var mat3x3a = Geometry.Mat3x3.getSingleAxisRotationMatrix(angle, Geometry.Axis.x);
        var vector = new Geometry.Vec3([1, 2, 3]);

        var vecres = mat3x3a.multiplyFromRightByVector(vector);
        expect(vecres.getElement(0)).toBeCloseTo(1, 6);
        expect(vecres.getElement(1)).toBeCloseTo(-3, 6);
        expect(vecres.getElement(2)).toBeCloseTo(2, 6);
    });

    it("Mat3x3 - Tests the multiply by vector function of Mat3x3", function () {
        var mat3x3a = new Geometry.Mat3x3([4, 5, 6, 7, 8, 9, 10, 11, 12]);
        var vector = new Geometry.Vec3([-1, 2, 3]);

        var vecres = mat3x3a.multiplyFromRightByVector(vector);
        expect(vecres.getElement(0)).toBeCloseTo(24, 6);
        expect(vecres.getElement(1)).toBeCloseTo(36, 6);
        expect(vecres.getElement(2)).toBeCloseTo(48, 6);
    });

    it("Mat3x3 - Tests the transpose function of Mat3x3", function () {
        var mat3x3a = new Geometry.Mat3x3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        var mat3x3t = mat3x3a.transpose();

        expect(mat3x3a.getElement(0, 0)).toBeCloseTo(mat3x3t.getElement(0, 0), 6);
        expect(mat3x3a.getElement(0, 1)).toBeCloseTo(mat3x3t.getElement(1, 0), 6);
        expect(mat3x3a.getElement(0, 2)).toBeCloseTo(mat3x3t.getElement(2, 0), 6);
        expect(mat3x3a.getElement(1, 0)).toBeCloseTo(mat3x3t.getElement(0, 1), 6);
        expect(mat3x3a.getElement(1, 1)).toBeCloseTo(mat3x3t.getElement(1, 1), 6);
        expect(mat3x3a.getElement(1, 2)).toBeCloseTo(mat3x3t.getElement(2, 1), 6);
        expect(mat3x3a.getElement(2, 0)).toBeCloseTo(mat3x3t.getElement(0, 2), 6);
        expect(mat3x3a.getElement(2, 1)).toBeCloseTo(mat3x3t.getElement(1, 2), 6);
        expect(mat3x3a.getElement(2, 2)).toBeCloseTo(mat3x3t.getElement(2, 2), 6);
    });

    it("Rot3 - Tests the constructor and the get functions of Rot3", function () {
        var angleXr = new Geometry.Angle(0.5);
        var angleYr = new Geometry.Angle(-0.42);
        var angleZr = new Geometry.Angle(0.78);
        var angleXc = new Geometry.Angle(0.5);
        var angleYc = new Geometry.Angle(-0.42);
        var angleZc = new Geometry.Angle(0.78);
        var rot3 = new Geometry.Rot3(angleXr, angleYr, angleZr);

        expect(rot3.getRotationX().getValueRad()).toBeCloseTo(angleXc.getValueRad(), 6);
        expect(rot3.getRotationY().getValueRad()).toBeCloseTo(angleYc.getValueRad(), 6);
        expect(rot3.getRotationZ().getValueRad()).toBeCloseTo(angleZc.getValueRad(), 6);
    });

    it("Rot3 - Tests the rotation matrix creator function of Rot3", function () {
        var angleXr = new Geometry.Angle(0.5);
        var angleYr = new Geometry.Angle(-0.42);
        var angleZr = new Geometry.Angle(0.78);
        var angleXc = new Geometry.Angle(0.5);
        var angleYc = new Geometry.Angle(-0.42);
        var angleZc = new Geometry.Angle(0.78);
        var rot3 = new Geometry.Rot3(angleXr, angleYr, angleZr);
        var mat3 = Geometry.Mat3x3.getMultiAxisRotationMatrix(angleXc, angleYc, angleZc);

        expect(rot3.getRotationMatrix().getElement(0, 0)).toBeCloseTo(mat3.getElement(0, 0), 6);
        expect(rot3.getRotationMatrix().getElement(0, 1)).toBeCloseTo(mat3.getElement(0, 1), 6);
        expect(rot3.getRotationMatrix().getElement(0, 2)).toBeCloseTo(mat3.getElement(0, 2), 6);
        expect(rot3.getRotationMatrix().getElement(1, 0)).toBeCloseTo(mat3.getElement(1, 0), 6);
        expect(rot3.getRotationMatrix().getElement(1, 1)).toBeCloseTo(mat3.getElement(1, 1), 6);
        expect(rot3.getRotationMatrix().getElement(1, 2)).toBeCloseTo(mat3.getElement(1, 2), 6);
        expect(rot3.getRotationMatrix().getElement(2, 0)).toBeCloseTo(mat3.getElement(2, 0), 6);
        expect(rot3.getRotationMatrix().getElement(2, 1)).toBeCloseTo(mat3.getElement(2, 1), 6);
        expect(rot3.getRotationMatrix().getElement(2, 2)).toBeCloseTo(mat3.getElement(2, 2), 6);
    });

    it("Mat4x4 - Tests the constructor and the get functions of Mat4x4 if both parameters are not null", function () {
        var angleXr = new Geometry.Angle(0.7);
        var angleYr = new Geometry.Angle(-0.21);
        var angleZr = new Geometry.Angle(1.2);
        var rot3 = new Geometry.Rot3(angleXr, angleYr, angleZr);
        var rotMat3 = rot3.getRotationMatrix();

        var translationVector = new Geometry.Vec3([5, 9, 11]);
        var mat4 = new Geometry.Mat4x4(rotMat3, translationVector);

        expect(mat4.getElement(0, 0)).toBeCloseTo(rotMat3.getElement(0, 0), 6);
        expect(mat4.getElement(0, 1)).toBeCloseTo(rotMat3.getElement(0, 1), 6);
        expect(mat4.getElement(0, 2)).toBeCloseTo(rotMat3.getElement(0, 2), 6);
        expect(mat4.getElement(1, 0)).toBeCloseTo(rotMat3.getElement(1, 0), 6);
        expect(mat4.getElement(1, 1)).toBeCloseTo(rotMat3.getElement(1, 1), 6);
        expect(mat4.getElement(1, 2)).toBeCloseTo(rotMat3.getElement(1, 2), 6);
        expect(mat4.getElement(2, 0)).toBeCloseTo(rotMat3.getElement(2, 0), 6);
        expect(mat4.getElement(2, 1)).toBeCloseTo(rotMat3.getElement(2, 1), 6);
        expect(mat4.getElement(2, 2)).toBeCloseTo(rotMat3.getElement(2, 2), 6);

        expect(mat4.getElement(0, 3)).toBeCloseTo(translationVector.getElement(0), 6);
        expect(mat4.getElement(1, 3)).toBeCloseTo(translationVector.getElement(1), 6);
        expect(mat4.getElement(2, 3)).toBeCloseTo(translationVector.getElement(2), 6);

        expect(mat4.getElement(3, 0)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 1)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 2)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 3)).toBeCloseTo(1.0, 6);
    });

    it("Mat4x4 - Tests the constructor and the get functions of Mat4x4 if the translation vector is null", function () {
        var angleXr = new Geometry.Angle(0.7);
        var angleYr = new Geometry.Angle(-0.21);
        var angleZr = new Geometry.Angle(1.2);
        var rot3 = new Geometry.Rot3(angleXr, angleYr, angleZr);
        var rotMat3 = rot3.getRotationMatrix();

        var translationVector = null;
        var mat4 = new Geometry.Mat4x4(rotMat3, translationVector);

        expect(mat4.getElement(0, 0)).toBeCloseTo(rotMat3.getElement(0, 0), 6);
        expect(mat4.getElement(0, 1)).toBeCloseTo(rotMat3.getElement(0, 1), 6);
        expect(mat4.getElement(0, 2)).toBeCloseTo(rotMat3.getElement(0, 2), 6);
        expect(mat4.getElement(1, 0)).toBeCloseTo(rotMat3.getElement(1, 0), 6);
        expect(mat4.getElement(1, 1)).toBeCloseTo(rotMat3.getElement(1, 1), 6);
        expect(mat4.getElement(1, 2)).toBeCloseTo(rotMat3.getElement(1, 2), 6);
        expect(mat4.getElement(2, 0)).toBeCloseTo(rotMat3.getElement(2, 0), 6);
        expect(mat4.getElement(2, 1)).toBeCloseTo(rotMat3.getElement(2, 1), 6);
        expect(mat4.getElement(2, 2)).toBeCloseTo(rotMat3.getElement(2, 2), 6);

        expect(mat4.getElement(0, 3)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(1, 3)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(2, 3)).toBeCloseTo(0.0, 6);

        expect(mat4.getElement(3, 0)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 1)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 2)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 3)).toBeCloseTo(1.0, 6);
    });


    it("Mat4x4 - Tests the constructor and the get functions of Mat4x4 if the rotation matrix is null", function () {

        var rotMat3 : Geometry.Mat3x3 = null;

        var translationVector = new Geometry.Vec3([5, 9, 11]);
        var mat4 = new Geometry.Mat4x4(rotMat3, translationVector);

        expect(mat4.getElement(0, 0)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(0, 1)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(0, 2)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(1, 0)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(1, 1)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(1, 2)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(2, 0)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(2, 1)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(2, 2)).toBeCloseTo(0.0, 6);

        expect(mat4.getElement(0, 3)).toBeCloseTo(translationVector.getElement(0), 6);
        expect(mat4.getElement(1, 3)).toBeCloseTo(translationVector.getElement(1), 6);
        expect(mat4.getElement(2, 3)).toBeCloseTo(translationVector.getElement(2), 6);

        expect(mat4.getElement(3, 0)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 1)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 2)).toBeCloseTo(0.0, 6);
        expect(mat4.getElement(3, 3)).toBeCloseTo(1.0, 6);
    });

    it("Mat4x4 - Tests the multiply from right by vector function of Mat4x4 if the vector is not null", function () {
        var vec4 : Geometry.Vec4 = new Geometry.Vec4([1, 2, 3, 4]);
        var mat4 : Geometry.Mat4x4 = new Geometry.Mat4x4(new Geometry.Mat3x3([0, 1, 2, 3, 4, 5, 6, 7, 8]), new Geometry.Vec3([9, 10, 11]));

        var res4 : Geometry.Vec4 = mat4.multiplyFromRightByVector(vec4);

        expect(res4.getElement(0)).toBeCloseTo(44.0, 6);
        expect(res4.getElement(1)).toBeCloseTo(66.0, 6);
        expect(res4.getElement(2)).toBeCloseTo(88.0, 6);
        expect(res4.getElement(3)).toBeCloseTo(4.0, 6);
    });

    it("Mat4x4 - Tests the multiply from right by vector function of Mat4x4 if the vector is null", function () {
        var vec4 : Geometry.Vec4 = new Geometry.Vec4([1, 2, 3, 4]);
        var mat4 : Geometry.Mat4x4 = new Geometry.Mat4x4(new Geometry.Mat3x3([0, 1, 2, 3, 4, 5, 6, 7, 8]), new Geometry.Vec3([9, 10, 11]));

        var res4 : Geometry.Vec4 = mat4.multiplyFromRightByVector(null);

        expect(res4.getElement(0)).toBeCloseTo(0.0, 6);
        expect(res4.getElement(1)).toBeCloseTo(0.0, 6);
        expect(res4.getElement(2)).toBeCloseTo(0.0, 6);
        expect(res4.getElement(3)).toBeCloseTo(0.0, 6);
    });
});

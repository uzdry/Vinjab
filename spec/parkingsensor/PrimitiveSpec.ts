/**
 * @author David G.
 */

///<reference path="./../../src/tsnode/parkingsensor/Primitive.ts"/>

describe("Primitive", function () {
    it("Polygon - Tests the Polygon constructor and the get functions on non-null input", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var segments : Geometry.Vec3[] = [new Geometry.Vec3([1, 2, 3]), new Geometry.Vec3([4, 5, 6]), new Geometry.Vec3([7, 8, 9])];
        var polygon = new Primitive.Polygon(segments, format);

        expect(polygon.getFormat()).toEqual(format);
        expect(polygon.getSegmentCount()).toEqual(segments.length);
        expect(polygon.getSegment(0).getX()).toEqual(segments[0].getX());
        expect(polygon.getSegment(0).getY()).toEqual(segments[0].getY());
        expect(polygon.getSegment(0).getZ()).toEqual(segments[0].getZ());
        expect(polygon.getSegment(1).getX()).toEqual(segments[1].getX());
        expect(polygon.getSegment(1).getY()).toEqual(segments[1].getY());
        expect(polygon.getSegment(1).getZ()).toEqual(segments[1].getZ());
        expect(polygon.getSegment(2).getX()).toEqual(segments[2].getX());
        expect(polygon.getSegment(2).getY()).toEqual(segments[2].getY());
        expect(polygon.getSegment(2).getZ()).toEqual(segments[2].getZ());
    });

    it("Polygon - Tests the Polygon constructor and the get functions on format == null input", function () {
        var format : Format.FormatContainer = null;
        var segments : Geometry.Vec3[] = [new Geometry.Vec3([1, 2, 3]), new Geometry.Vec3([4, 5, 6]), new Geometry.Vec3([7, 8, 9])];
        var polygon = new Primitive.Polygon(segments, format);

        expect(polygon.getFormat().getFill()).toEqual(new Format.FormatContainer(null, null, 0, null).getFill());
        expect(polygon.getFormat().getStroke()).toEqual(new Format.FormatContainer(null, null, 0, null).getStroke());
        expect(polygon.getFormat().getStrokeWidth()).toEqual(new Format.FormatContainer(null, null, 0, null).getStrokeWidth());
        expect(polygon.getFormat().getName()).toEqual(new Format.FormatContainer(null, null, 0, null).getName());
    });

    it("Polygon - Tests the Polygon constructor and the get functions on segments == null input", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var segments : Geometry.Vec3[] = null;
        var polygon = new Primitive.Polygon(segments, format);

        expect(polygon.getSegment(0).getX()).toEqual(0.0);
        expect(polygon.getSegment(0).getY()).toEqual(0.0);
        expect(polygon.getSegment(0).getZ()).toEqual(0.0);
        expect(polygon.getSegment(1).getX()).toEqual(0.0);
        expect(polygon.getSegment(1).getY()).toEqual(0.0);
        expect(polygon.getSegment(1).getZ()).toEqual(0.0);
    });

    it("Polygon - Tests the Polygon get functions", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var segments : Geometry.Vec3[] = [new Geometry.Vec3([1, 2, 3]), new Geometry.Vec3([4, 5, 6]), new Geometry.Vec3([7, 8, 9])];
        var polygon = new Primitive.Polygon(segments, format);

        expect(polygon.getFormat()).toEqual(format);
        expect(polygon.getSegmentCount()).toEqual(segments.length);
        expect(polygon.getSegment(-1).getX()).toEqual(segments[0].getX());
        expect(polygon.getSegment(-1).getY()).toEqual(segments[0].getY());
        expect(polygon.getSegment(-1).getZ()).toEqual(segments[0].getZ());
        expect(polygon.getSegment(3).getX()).toEqual(segments[2].getX());
        expect(polygon.getSegment(3).getY()).toEqual(segments[2].getY());
        expect(polygon.getSegment(3).getZ()).toEqual(segments[2].getZ());
    });

    it("Circle - Tests the Circle constructor and get functions", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var position : Geometry.Vec3 = new Geometry.Vec3([1, 2, 3]);
        var normal : Geometry.Vec3 = new Geometry.Vec3([1, 0, 0]);
        var radius : number = 5;

        var circle = new Primitive.Circle(position, normal, radius, format);
        expect(circle.getFormat()).toEqual(format);
        expect(circle.getNormal().getX()).toEqual(normal.getX());
        expect(circle.getNormal().getY()).toEqual(normal.getY());
        expect(circle.getNormal().getZ()).toEqual(normal.getZ());
        expect(circle.getRadius()).toEqual(radius);
        expect(circle.getPosition()).toEqual(position);
    });

    it("Circle - Tests the Circle to Points converter of the Circle", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var position : Geometry.Vec3 = new Geometry.Vec3([1, 2, 3]);
        var normal : Geometry.Vec3 = new Geometry.Vec3([1, 0, 0]);
        var radius : number = 4;

        var circle : Primitive.Circle = new Primitive.Circle(position, normal, radius, format);
        expect(circle.getPoint(new Geometry.Angle(0)).getX()).toBeCloseTo(1.0, 6);
        expect(circle.getPoint(new Geometry.Angle(0)).getY()).toBeCloseTo(2.0, 6);
        expect(circle.getPoint(new Geometry.Angle(0)).getZ()).toBeCloseTo(7.0, 6);
        expect(circle.getPoint(new Geometry.Angle(90 * Math.PI / 180)).getX()).toBeCloseTo(1.0, 6);
        expect(circle.getPoint(new Geometry.Angle(90 * Math.PI / 180)).getY()).toBeCloseTo(-2.0, 6);
        expect(circle.getPoint(new Geometry.Angle(90 * Math.PI / 180)).getZ()).toBeCloseTo(3.0, 6);
        expect(circle.getPoint(new Geometry.Angle(180 * Math.PI / 180)).getX()).toBeCloseTo(1.0, 6);
        expect(circle.getPoint(new Geometry.Angle(180 * Math.PI / 180)).getY()).toBeCloseTo(2.0, 6);
        expect(circle.getPoint(new Geometry.Angle(180 * Math.PI / 180)).getZ()).toBeCloseTo(-1.0, 6);
        expect(circle.getPoint(new Geometry.Angle(270 * Math.PI / 180)).getX()).toBeCloseTo(1.0, 6);
        expect(circle.getPoint(new Geometry.Angle(270 * Math.PI / 180)).getY()).toBeCloseTo(6.0, 6);
        expect(circle.getPoint(new Geometry.Angle(270 * Math.PI / 180)).getZ()).toBeCloseTo(3.0, 6);
    });

    it("Circle - Tests the Circle to Polygon converter of the Circle", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var position : Geometry.Vec3 = new Geometry.Vec3([1, 2, 3]);
        var normal : Geometry.Vec3 = new Geometry.Vec3([1, 0, 0]);
        var radius : number = 4;

        var circle : Primitive.Circle = new Primitive.Circle(position, normal, radius, format);
        var polygon : Primitive.Polygon = circle.toPolygon(4);

        expect(polygon.getSegment(0).getX()).toBeCloseTo(1.0, 6);
        expect(polygon.getSegment(0).getY()).toBeCloseTo(2.0, 6);
        expect(polygon.getSegment(0).getZ()).toBeCloseTo(7.0, 6);
        expect(polygon.getSegment(1).getX()).toBeCloseTo(1.0, 6);
        expect(polygon.getSegment(1).getY()).toBeCloseTo(-2.0, 6);
        expect(polygon.getSegment(1).getZ()).toBeCloseTo(3.0, 6);
        expect(polygon.getSegment(2).getX()).toBeCloseTo(1.0, 6);
        expect(polygon.getSegment(2).getY()).toBeCloseTo(2.0, 6);
        expect(polygon.getSegment(2).getZ()).toBeCloseTo(-1.0, 6);
        expect(polygon.getSegment(3).getX()).toBeCloseTo(1.0, 6);
        expect(polygon.getSegment(3).getY()).toBeCloseTo(6.0, 6);
        expect(polygon.getSegment(3).getZ()).toBeCloseTo(3.0, 6);
    });

    it("Circle - Tests the limiter of the Circle to Polygon converter of the Circle", function () {
        var format : Format.FormatContainer = new Format.FormatContainer(new Format.RGB(20, 40, 60), new Format.RGB(150, 160, 170), 3, "FormatName");
        var position : Geometry.Vec3 = new Geometry.Vec3([1, 2, 3]);
        var normal : Geometry.Vec3 = new Geometry.Vec3([1, 0, 0]);
        var radius : number = 4;

        var circle : Primitive.Circle = new Primitive.Circle(position, normal, radius, format);
        var polygon2 : Primitive.Polygon = circle.toPolygon(1);
        var polygon3600 : Primitive.Polygon = circle.toPolygon(4800);
        expect(polygon2.getSegmentCount()).toEqual(2);
        expect(polygon3600.getSegmentCount()).toEqual(3600);

    });
});

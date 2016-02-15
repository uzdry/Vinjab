/**
 * @author David G.
 */

///<reference path="Geometry.ts"/>
///<reference path="Format.ts"/>
module Primitive {
    export class Polygon {
        private segments : Geometry.Vec3[];
        private format : Format.FormatContainer;

        constructor(segments : Geometry.Vec3[], format : Format.FormatContainer) {
            if (format == null) {
                this.format = new Format.FormatContainer(null, null, 0, null);
            } else {
                this.format = format;
            }
            if (segments == null || segments.length < 2) {
                // throw new Exception("Segments must not be null!");
                this.segments = [new Geometry.Vec3([0, 0, 0]), new Geometry.Vec3([0, 0, 0])];
            } else {
                this.segments = segments;
            }
        }

        public getSegmentCount() : number {
            return this.segments.length;
        }

        public getSegment(index : number) : Geometry.Vec3 {
            if (index < 0)
            {
                return this.segments[0];
            }
            if (index >= this.getSegmentCount()) {
                return this.segments[this.segments.length - 1];
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

        public getPosition() : Geometry.Vec3 {
            return this.position;
        }

        public getNormal() : Geometry.Vec3 {
            return this.normal;
        }

        public getFormat() : Format.FormatContainer {
            return this.format;
        }

        public getRadius() : number {
            return this.radius;
        }

        public toPolygon(n : number) : Polygon {
            var segmentCount : number = n;
            if (n <= 2)
            {
                segmentCount = 2;
            } else if (n >= 3600) {
                segmentCount = 3600;
            }
            var array = [];

            var parameter : number;
            for (var i = 0; i < segmentCount; i++)
            {
                parameter = (i / segmentCount) * 2 * Math.PI;
                var angle = new Geometry.Angle(parameter);
                array[i] = this.getPoint(angle);
            }

            return new Polygon(array, this.format);
        }
    }
}

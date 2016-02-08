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

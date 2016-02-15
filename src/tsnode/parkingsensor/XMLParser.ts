/**
 * @author David G.
 */

///<reference path="Primitive.ts"/>

module XMLParser {
    export interface XMLParserCallBack {
        onPolygonsFound(polygons : Primitive.Polygon[]);
    }

    export class XMLParser {

        public static parseXML(xmlURL : string, callBack : XMLParserCallBack) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    xhttpIsReady(xhttp);
                }
            };
            xhttp.open("GET", xmlURL, true);
            xhttp.send();

            function xhttpIsReady(xml) {
                var polygons = XMLParser.getAllPolygons(xml.responseXML);
                callBack.onPolygonsFound(polygons);
            }
        }

        private static getAllFormats(xmlDoc) : Format.FormatContainer[] {
            if (xmlDoc.children.length != 1) {
                return null;
            }
            var root = xmlDoc.children[0];
            var formats : Format.FormatContainer[] = [];

            // First pass, get all formats.
            for (var i = 0; i < root.children.length; i++) {
                if (root.children[i].tagName == "Format") {
                    var format = XMLParser.getFormat(root.children[i]);
                    if (format != null) {
                        formats.push(format);
                    }
                }
            }
            return formats;
        }
        private static getAllPolygons(xmlDoc) : Primitive.Polygon[] {
            if (xmlDoc.children.length != 1) {
                return null;
            }
            var root = xmlDoc.children[0];

            var formats : Format.FormatContainer[] = XMLParser.getAllFormats(xmlDoc);
            var polygons : Primitive.Polygon[] = [];
            // Second pass, get all polygons.
            for (var i = 0; i < root.children.length; i++) {
                if (root.children[i].tagName == "Polygon") {
                    var polygon = XMLParser.getPolygon(root.children[i], formats);
                    if (polygon != null) {
                        polygons.push(polygon);
                    }
                }
            }

            return polygons;
        }

        private static getPolygon(node, formats : Format.FormatContainer[]) : Primitive.Polygon {
            var points : Geometry.Vec3[] = [];
            var format : Format.FormatContainer = null;
            for (var i = 0; i < node.children.length; i++) {
                var buf3 = null;
                if (node.children[i].tagName == "Vec3") {
                    buf3 = XMLParser.getVec3(node.children[i]);
                    if (buf3 == null) {
                        return null;
                    }
                    points.push(buf3);
                } else if (node.children[i].tagName == "Format") {
                    var index : number = XMLParser.getIndexOfFormat(node.children[i].innerHTML, formats);
                    if (index == -1 || format != null) {
                        return null;
                    }
                    format = formats[index];
                }
            }
            return new Primitive.Polygon(points, format);
        }

        private static getIndexOfFormat(name : string, formats : Format.FormatContainer[]) : number {
            for (var i = 0; i < formats.length; i++) {
                if (formats[i].getName() == name) {
                    return i;
                }
            }
            return -1;
        }

        private static getVec3(node) : Geometry.Vec3 {
            var x : number[] = null;
            var y : number[] = null;
            var z : number[] = null;

            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i].tagName == "x") {
                    x = [];
                    x[0] = parseFloat(node.children[i].innerHTML);
                } else if (node.children[i].tagName == "y") {
                    y = [];
                    y[0] = parseFloat(node.children[i].innerHTML);
                } else if (node.children[i].tagName == "z") {
                    z = [];
                    z[0] = parseFloat(node.children[i].innerHTML);
                }
            }

            if (x == null || y == null || z == null) {
                return null;
            }
            return new Geometry.Vec3([x[0], y[0], z[0]]);
        }

        private static getFormat(node) : Format.FormatContainer {
            var fillColor : Format.RGB = null;
            var strokeColor : Format.RGB = null;
            var strokeWidth : number = null;
            var name : string = null;

            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i].tagName == "FillColor") {
                    fillColor = Format.RGB.fromHEXString(node.children[i].innerHTML);
                } else if (node.children[i].tagName == "StrokeColor") {
                    strokeColor = Format.RGB.fromHEXString(node.children[i].innerHTML);
                } else if (node.children[i].tagName == "StrokeWidth") {
                    strokeWidth = parseInt(node.children[i].innerHTML);
                } else if (node.children[i].tagName == "Name") {
                    name = node.children[i].innerHTML;
                }
            }
            if (strokeColor == null || strokeWidth == null || name == null) {
                // FillColor may be null.
                return null;
            }
            return new Format.FormatContainer(fillColor, strokeColor, strokeWidth, name);
        }
    }

}

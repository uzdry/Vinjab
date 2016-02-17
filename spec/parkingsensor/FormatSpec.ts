/**
 * @author David G.
 */

///<reference path="./../../src/tsnode/parkingsensor/Format.ts"/>

describe("Format", function () {
    it("Tests the string parser constructor of RGB with a valid input", function () {
        var rgbHEX = Format.RGB.fromHEXString("#123456");
        var rgbDEC = new Format.RGB(18, 52, 86);
        expect(rgbHEX.toHEXString()).toEqual(rgbDEC.toHEXString());
    });

    it("Tests the string parser constructor of RGB with a valid input", function () {
        var rgbHEX = Format.RGB.fromHEXString("#789ABC");
        var rgbDEC = new Format.RGB(120, 154, 188);
        expect(rgbHEX.toHEXString()).toEqual(rgbDEC.toHEXString());
    });

    it("Tests the string parser constructor of RGB with a valid input", function () {
        var rgbHEX = Format.RGB.fromHEXString("#000DEF");
        var rgbDEC = new Format.RGB(0, 13, 239);
        expect(rgbHEX.toHEXString()).toEqual(rgbDEC.toHEXString());
    });

    it("Tests the string parser constructor of RGB with an invalid input", function () {
        var rgb = Format.RGB.fromHEXString("Hello world!");
        expect(rgb).toEqual(null);
    });

    it("Tests the string parser constructor of RGB with an invalid input", function () {
        var rgb = Format.RGB.fromHEXString("#B00BZ6");
        expect(rgb).toEqual(null);
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(256, 11, 3);
        var rgbOK = new Format.RGB(255, 11, 3);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(120, 386, 7);
        var rgbOK = new Format.RGB(120, 255, 7);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(36, 127, 422);
        var rgbOK = new Format.RGB(36, 127, 255);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(-3, 6, 386);
        var rgbOK = new Format.RGB(0, 6, 255);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(5, -17, 83);
        var rgbOK = new Format.RGB(5, 0, 83);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(93, 81, -193);
        var rgbOK = new Format.RGB(93, 81, 0);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(127.7, 193.5, 1.27);
        var rgbOK = new Format.RGB(128, 194, 1);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of RGB", function () {
        var rgbERR = new Format.RGB(127.7, 193.5, 1.27);
        var rgbOK = new Format.RGB(128, 194, 1);
        expect(rgbERR.toHEXString()).toEqual(rgbOK.toHEXString());
    });

    it("Tests the string2 function of RGB", function () {
        var rgb = new Format.RGB(128, 194, 1);
        expect(rgb.toString()).toEqual("rgb(128, 194, 1)");
    });

    it("Tests the name getter of FormatContainer", function () {
        var format = new Format.FormatContainer(new Format.RGB(0, 0, 0), new Format.RGB(0, 0, 0), 1, "NameOfMyFormat");
        expect(format.getName()).toEqual("NameOfMyFormat");
    });

    it("Tests the stroke-width getter of FormatContainer", function () {
        var format = new Format.FormatContainer(new Format.RGB(0, 0, 0), new Format.RGB(0, 0, 0), 4, "NameOfMyFormat");
        expect(format.getStrokeWidth()).toEqual(4);
    });

    it("Tests the stroke-color getter of FormatContainer", function () {
        var rgb1 = new Format.RGB(21, 53, 227);
        var rgb2 = new Format.RGB(21, 53, 227);
        var format = new Format.FormatContainer(new Format.RGB(0, 0, 0), rgb1, 4, "NameOfMyFormat");
        expect(format.getStroke().toHEXString()).toEqual(rgb2.toHEXString());
    });

    it("Tests the fill-color getter of FormatContainer", function () {
        var rgb1 = new Format.RGB(23, 57, 211);
        var rgb2 = new Format.RGB(23, 57, 211);
        var format = new Format.FormatContainer(rgb1, new Format.RGB(0, 0, 0), 4, "NameOfMyFormat");
        expect(format.getFill().toHEXString()).toEqual(rgb2.toHEXString());
    });

    it("Tests the string2 function of FormatContainer with a specified fill container", function () {
        var fill = new Format.RGB(1, 2, 3);
        var stroke = new Format.RGB(4, 5, 6);
        var format = new Format.FormatContainer(fill, stroke, 7, "FormatName");
        expect(format.toString()).toEqual("fill=\"" + fill.toString() + "\" stroke=\"" + stroke.toString() + "\" stroke-width=\"" + 7 + "\"");
    });

    it("Tests the string2 function of FormatContainer with an unspecified fill container (none)", function () {
        var fill = null;
        var stroke = new Format.RGB(1, 2, 3);
        var format = new Format.FormatContainer(fill, stroke, 7, "FormatName");
        expect(format.toString()).toEqual("fill=\"" + "none" + "\" stroke=\"" + stroke.toString() + "\" stroke-width=\"" + 7 + "\"");
    });

    it("Tests the input parameter normalizer of the constructor of FormatContainer - Field: Fill", function () {
        var fill = new Format.RGB(1, 37, 92);
        var stroke = new Format.RGB(128, 194, 1);
        var strokewidth : number = -7;
        var name : string = null;
        var format = new Format.FormatContainer(null, null, strokewidth, null);
        expect(format.getFill()).toEqual(null);
    });

    it("Tests the input parameter normalizer of the constructor of FormatContainer - Field: Stroke", function () {
        var fill = new Format.RGB(1, 37, 92);
        var stroke = new Format.RGB(128, 194, 1);
        var strokewidth : number = -7;
        var name : string = null;
        var format = new Format.FormatContainer(null, null, strokewidth, null);
        expect(format.getStroke().toHEXString()).toEqual(new Format.RGB(0, 0, 0).toHEXString());
    });

    it("Tests the input parameter normalizer of the constructor of FormatContainer - Field: Stroke-width", function () {
        var fill = new Format.RGB(1, 37, 92);
        var stroke = new Format.RGB(128, 194, 1);
        var strokewidth : number = -7;
        var name : string = null;
        var format = new Format.FormatContainer(null, null, strokewidth, null);
        expect(format.getStrokeWidth()).toEqual(1);
    });

    it("Tests the input parameter normalizer of the constructor of FormatContainer - Field: Name", function () {
        var fill = new Format.RGB(1, 37, 92);
        var stroke = new Format.RGB(128, 194, 1);
        var strokewidth : number = -7;
        var name : string = null;
        var format = new Format.FormatContainer(null, null, strokewidth, null);
        expect(format.getName()).toEqual("");
    });
});

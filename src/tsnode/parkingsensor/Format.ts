/**
 * @author David G.
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

            this.red = Math.round(this.red);
            this.green = Math.round(this.green);
            this.blue = Math.round(this.blue);

            this.red = Math.min(255, this.red);
            this.green = Math.min(255, this.green);
            this.blue = Math.min(255, this.blue);

            this.red = Math.max(0, this.red);
            this.green = Math.max(0, this.green);
            this.blue = Math.max(0, this.blue);
        }

        public static fromHEXString(hexString : string) : RGB {
            if (hexString[0] != "#") {
                return null;
            }
            var red : number = 0;
            var green : number = 0;
            var blue : number = 0;

            var buf = [];
            for (var i = 1; i <= 6; i++) {
                buf[i] = RGB.HEXToNibble(hexString, i);
                if (buf[i] == -1) {
                    return null;
                }
            }
            red = buf[1] * 16 + buf[2];
            green = buf[3] * 16 + buf[4];
            blue = buf[5] * 16 + buf[6];

            return new RGB(red, green, blue);
        }

        private static HEXToNibble(hexString : string, index : number) : number {

            switch (hexString[index].toUpperCase()) {
                case "0": return 0;
                case "1": return 1;
                case "2": return 2;
                case "3": return 3;
                case "4": return 4;
                case "5": return 5;
                case "6": return 6;
                case "7": return 7;
                case "8": return 8;
                case "9": return 9;
                case "A": return 10;
                case "B": return 11;
                case "C": return 12;
                case "D": return 13;
                case "E": return 14;
                case "F": return 15;
                default : return -1;
            }
        }

        public toString() : String {
            return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        }

        public toHEXString() : string {
            return "#" + RGB.nibbleToHEX(this.red >> 4) + RGB.nibbleToHEX(this.red & 15) + RGB.nibbleToHEX(this.green >> 4)
                + RGB.nibbleToHEX(this.green & 15) + RGB.nibbleToHEX(this.blue >> 4) + RGB.nibbleToHEX(this.blue & 15);
        }

        private static nibbleToHEX(nibble : number) : String {
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
                default:
                    return "F";
            }
        }
    }

    export class FormatContainer {
        private fill : RGB;
        private stroke : RGB;
        private strokeWidth : number;
        private name : string;
        constructor(fill : RGB, stroke : RGB, strokeWidth : number, name : string) {
            // Fill can be null : fill="none"
            this.fill = fill;
            this.stroke = stroke;
            this.strokeWidth = strokeWidth;
            this.name = name;

            // Normalize garbage input.
            if (stroke == null) {
                this.stroke = new Format.RGB(0, 0, 0);
            }
            if (strokeWidth <= 0) {
                this.strokeWidth = 1;
            }
            if (name == null) {
                this.name = "";
            }
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

        public getName() : string {
            return this.name;
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

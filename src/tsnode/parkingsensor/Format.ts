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

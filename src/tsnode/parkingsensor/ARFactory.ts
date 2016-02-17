/**
 * @author David G.
 */

///<reference path="Format.ts"/>
///<reference path="Primitive.ts"/>
///<reference path="Visualization.ts"/>
///<reference path="Debug.ts"/>

module ARFactory {
    export class Drawer {

        public static createEmptySVG(svg : Node) : Visualization.ISVG {
            return new Visualization.DOMSVG(svg);
        }
    }
}

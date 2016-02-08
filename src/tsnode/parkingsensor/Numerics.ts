/**
 * @author David G.
 */

module Numerics {
    class Engine {
        private static EPSILON : number = 0.0000001;
        public static compareEquals(val1 : number, val2 : number) : boolean {
            if (val1 > val2 + Engine.EPSILON) {
                return false;
            } else if (val1 < val2 - Engine.EPSILON) {
                return false;
            }
            return true;
        }
    }
}

interface JustGage {


    /** tiny helper function to lookup value of a key from two hash tables*/
    kvLookup(key:String, tablea:Object, tableb:DOMStringMap, defval:any, datatype:any, delimiter:any):any;

    /** Refresh gauge level */
    refresh(value:Number, max?:Number);

    /** Generate shadow */
    generateShadow(svg:any, defs:any);

    config: Config;

    constructor(options:Options);

}

interface Config {

    // this is container element id
    id : string;
    // this is container element
    parentNode : any;
    // width : int
    // gauge width
    width : number;
    // gauge height
    height : number;
    // gauge title
    title : string;
    // color of gauge title
    titleFontColor : string;
    // value gauge is showing
    value : number;
    // color of label showing current value
    valueFontColor : string;
    // special symbol to show next to value
    symbol : string;
    // min value
    min : number;
    // max value
    max : number;
    // number of decimal places for our human friendly number to contain
    humanFriendlyDecimal : number;
    // function applied before rendering text
    textRenderer();
    // width of the gauge element
    gaugeWidthScale : number;
    // background color of gauge element
    gaugeColor : string;
    // text to show below value
    label : string;
    // color of label showing label under value
    labelFontColor : string;
    // 0 ~ 1
    shadowOpacity : number;
    // inner shadow size
    shadowSize : number;
    // how much shadow is offset from top
    shadowVerticalOffset : number;
    // colors of indicator, from lower to upper, in RGB format
    levelColors : string[];
    // length of initial animation
    startAnimationTime : number;
    // type of initial animation (linear, >, <,  <>, bounce)
    startAnimationType : string;
    // length of refresh animation
    refreshAnimationTime : number;
    // type of refresh animation (linear, >, <,  <>, bounce)
    refreshAnimationType : string;
    // angle to start from when in donut mode
    donutStartAngle : number;
    // absolute minimum font size for the value
    valueMinFontSize : number;
    // absolute minimum font size for the title
    titleMinFontSize : any;
    // absolute minimum font size for the label
    labelMinFontSize : any;
    // absolute minimum font size for the minimum label
    minLabelMinFontSize : any;
    // absolute minimum font size for the maximum label
    maxLabelMinFontSize : any;
    // hide value text
    hideValue : boolean;
    // hide min and max values
    hideMinMax : boolean;
    // hide inner shadow
    hideInnerShadow : boolean;
    // convert large numbers for min, max, value to human friendly (e.g. 1234567 -> 1.23M)
    humanFriendly : boolean;
    // whether to use gradual color change for value, or sector-based
    noGradient : boolean;
    // show full donut gauge
    donut : boolean;
    // whether gauge size should follow changes in container element size
    relativeGaugeSize : boolean;
    // animate level number change
    counter : boolean;
    // number of digits after floating point
    decimals : number;
    // number of digits after floating point
    customSectors : any[];
    // formats numbers with commas where appropriate
    formatNumber : boolean;
}

interface Options {
    id: String;
    value: Number;
    min?: Number;
    max?: Number;
    title?: String;
}


/** Get color for value */
declare function getColor(val:any, pct:any, col:any, noGradient:any, custSec:any):any;
/** Fix Raphael display:none tspan dy attribute bug */
declare function setDy(elem:any, fontSize:any, txtYpos:any):void;
/** Random integer  */
declare function getRandomInt(min:any, max:any):any;
/**  Cut hex  */
declare function cutHex(str:any):any;
/**  Human friendly number suffix - From: http://stackoverflow.com/questions/2692323/code-golf-friendly-number-abbreviator */
declare function humanFriendlyNumber(n:any, d:any):any;
/** Format numbers with commas - From: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
declare function formatNumber(x:any):any;
/**  Get style  */
declare function getStyle(oElm:any, strCssRule:any):string;
/**  Create Element NS Ready  */
declare function onCreateElementNsReady(func:any):void;
/**  Get IE version  */
declare var ie:any;

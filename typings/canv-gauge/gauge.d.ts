declare class Gauge{

    /** Configuration of the current File */
    config: GaugeConfig;

    /** Constructor */
    constructor(config: GaugeConfig);

    /** Update config */
    updateConfig(config: GaugeConfig);

    /** draws the gauge */
    draw();

    /** immediately sets the gauge value to minimal one and re-draws the gauge */
    clear();

    /** sets a new value to display within the gauge. If animations is enabled - starts an animation. */
    setValue(value: number);

    /** returns the current value on a gauge */
    getValue(): number;
}

interface GaugeConfig{

    /** HTML canvas element ID or element itself.
     *  This identifies the canvas element to which a gauge will be drawn.
     */
    renderTo: string|HTMLCanvasElement|HTMLElement;

    /** canvas width in pixels */
    width?: number;

    /** canvas height in pixels */
    height?: number;

    /** the title which should be drawn on a gauge. By default is false (no title to display) */
    title?: string;

    /** the minimal value which is used on a gauge bar. Default is 0 */
    minValue?: number;

    /** the maximum value which is used on a gauge bar. Default is 100 */
    maxValue?: number;

    /** number of minor ticks to draw between major ticks on a gauge bar. Default is 10.*/
    minorTicks?: number;

    /** array of a major tick marks. By default is ['0', '20', '60', '80', '100'] */
    majorTicks?: number[];

    /** the flag which identifies if the ticks bar should be stroked or not. By default is true. */
    strokeTicks?: boolean;

    /** specify a units name which will be shown on a gauge. By default is false (do not display the units). */
    units?: string;

    /** specify how the value should be displayed. It is possible to specify an integer part of the value
     *  and the decimal part. By default is { int : 3, dec : 2 }
     */
    valueFormat?: any;

    /** indicates if shadow glow should be drawn for gauge plate or not */
    glow?: boolean;

    /** Gauge needle animation config. Handles three options - delay, duration and animate function.*/
    animation?: GaugeAnimation;

    /** an array of highlights colors which could be drawn on a gauge bar.
     *  If specified as an empty array or false will not be drawn.
     *  By default is:
     *  [{ from: 20, to: 60, color: '#eee' }, { from: 60, to: 80, color: '#ccc' }, { from: 80, to: 100, color: '#999' }]
     */
    colors?: any;

    highlights?: any;



}


interface GaugeAnimation{
    /** milliseconds */
    delay?: number;

    /** milliseconds - total number of animation duration */
    duration?: number;

    /**animation function to use. Possible string values are 'linear', 'quad', 'quint', 'cycle', 'bounce', 'elastic'.
     * If requires to implement another animation behavior
     * animation function itself could be provided instead of string value.
     */
    fn?: string|any;

}



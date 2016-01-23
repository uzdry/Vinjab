/// <reference path="../../../../typings/canv-gauge/gauge.d.ts" />
/// <reference path="../widget.ts" />

class PercentGaugeWidgetConfig implements WidgetConfig{

    "type_name" = "PercentGauge";

    "display_name" = "Percentage Gauge";


    newInstance(options):Widget {
        return new PercentGaugeWidget(options);
    }

}

class PercentGaugeWidget extends Widget{

    /** Tag name */
    typeID: string = "percent_gauge";

    /** Main Element of the Gauge */
    gauge: Gauge;

    /** String that is beeing introduced to the grid */
    htmlElement: string;


    /** configuration */
    config:GaugeConfig = {
        renderTo: 'gauge',
        width: 200,
        height: 200,
        glow: true,
        units: '%',
        title: false,
        minValue: 0,
        maxValue: 220,
    };



    constructor(options?){

        super(options);

        //Save the HTMLElements
        this.htmlElement = "<li><canvas id=\""+ this.typeID + "-" + this.model.id + "\"></canvas></li>";

        this.config.renderTo = "" + this.typeID + "-" + this.model.id;

        this.config.title = this.model.get("name");

    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change', this.render);
    }

    /** Gets called after a update of the value */
    render(): PercentGaugeWidget{
        var value:number = this.model.get("value");
        this.gauge.setValue(value);
        return this;
    }

    /** Function to update the Widget */
    updateValue(value: number){
        this.gauge.setValue(value);
    }

    /** Initialise the Gauge */
    init(){
        this.gauge = new Gauge(this.config);
        this.gauge.draw();

        this.htmlElement.on
    }

}


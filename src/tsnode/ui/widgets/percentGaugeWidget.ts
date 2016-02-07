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

    static widgetCounter: number = 0;

    /** Tag name */
    typeID: string = "PercentGauge";

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
        maxValue: 100,
    };



    constructor(options?){

        super(options);

        this.widgetID = this.typeID + "-" + this.model.id + "-" + PercentGaugeWidget.widgetCounter;
        PercentGaugeWidget.widgetCounter++;

        //Save the HTMLElements
        this.htmlElement = "<li><canvas id=\""+ this.widgetID + "\"></canvas></li>";

        this.config.renderTo = this.widgetID;

        this.config.title = this.model.get("name");

    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change:value', this.render);
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

    }

    resize(size_x: number, size_y:number){
        this.config.height = size_y;
        this.config.width = size_x;
        this.gauge.updateConfig(this.config);
    }

}

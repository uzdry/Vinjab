/// <reference path="../../../../typings/canv-gauge/gauge.d.ts" />
/// <reference path="../widget.ts" />



//widgetFactory.addWidget(new SpeedGaugeWidgetConfig());

import EventsHash = Backbone.EventsHash;
class SpeedGaugeWidgetConfig implements WidgetConfig{

    "type_name" = "SpeedGauge";

    "display_name" = "Speed Gauge";

    newInstance(options):Widget {
        return new SpeedGaugeWidget(options);
    }

}

class SpeedGaugeWidget extends Widget{

    static widgetCounter: number = 0;

    /** Tag name */
    typeID: string = "SpeedGauge";

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
        units: 'Km/h',
        title: false,
        minValue: 0,
        maxValue: 220,
        majorTicks: ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180', '200', '220'],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [
            {from: 0, to: 50, color: 'rgba(0,   255, 0, .15)'},
            {from: 50, to: 100, color: 'rgba(255, 255, 0, .15)'},
            {from: 100, to: 150, color: 'rgba(255, 30,  0, .25)'},
            {from: 150, to: 200, color: 'rgba(255, 0,  225, .25)'},
            {from: 200, to: 220, color: 'rgba(0, 0,  255, .25)'}
        ],
        colors: {
            plate: '#222',
            majorTicks: '#f5f5f5',
            minorTicks: '#ddd',
            title: '#fff',
            units: '#ccc',
            numbers: '#eee',
            needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
        }
    };



    constructor(options?){

        super(options);

        this.widgetID = this.typeID + "-" + this.model.id + "-" + SpeedGaugeWidget.widgetCounter;
        SpeedGaugeWidget.widgetCounter++;

        //Save the HTMLElements
        this.htmlElement = "<li><canvas id=\""+ this.widgetID + "\"></canvas></li>";

        this.config.renderTo = this.widgetID;

        this.config.title = this.model.get("name");


    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change', this.render);
    }

    /** Gets called after a update of the value */
    render():SpeedGaugeWidget{
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


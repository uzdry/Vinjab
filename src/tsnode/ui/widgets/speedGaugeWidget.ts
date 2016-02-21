/// <reference path="../../../../typings/canv-gauge/gauge.d.ts" />
/// <reference path="../widget.ts" />



//widgetFactory.addWidget(new SpeedGaugeWidgetConfig());

import EventsHash = Backbone.EventsHash;
class SpeedGaugeWidgetConfig implements WidgetConfig{

    "type_name" = "SpeedGauge";

    "display_name" = "gauge";

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
        majorTicks: [],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [],
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

        this.widgetID = this.typeID + "-" + this.model.get("tagName") + "-" + SpeedGaugeWidget.widgetCounter;
        SpeedGaugeWidget.widgetCounter++;

        //Save the HTMLElements
        this.htmlElement = "<li><canvas id=\""+ this.widgetID + "\"></canvas></li>";

        this.config.renderTo = this.widgetID;

        this.config.title = this.model.get("name");

        this.config.units = this.model.get("unit");

        this.config.maxValue = this.model.get("maxValue");

        if (this.model.get("ticks")) {
            this.config.majorTicks = this.model.get("ticks");
        }
        //console.log(this.model.get("highlights"));

        var high = this.model.get("highlights");


       // this.config.highlights.resize(0);

        for (var i = 0; i < high.length; i++) {
            this.config.highlights.push({from: high[i].start, to: high[i].end, color: 'rgba' + high[i].color});
        }




        /*if (this.config.title == "Drehzahl") {
            this.config.majorTicks = ['0', '1000', '2000', '3000', '4000', '5000', '6000', '7000', '8000'];
            this.config.highlights = [
                {from: 0, to: 5000, color: 'rgba(0,   255, 0, .15)'},
                {from: 5000, to: 8000, color: 'rgba(255, 0, 0, .15)'},
            ];
        }*/


    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change:value', this.render);
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
        this.config.height = size_y*1.1;
        this.config.width = size_x*1.1;
        this.gauge.updateConfig(this.config);
    }

    destroy(){
        super.destroy();
        delete this.gauge;
        delete this;
    }

}


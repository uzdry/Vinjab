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

        var title = this.model.get("name");
        var unit = this.model.get("unit");
        var maxValue = this.model.get("maxValue");
        var minValue = this.model.get("minValue");
        var ticks = this.model.get("ticks");
        var ticksmin = this.model.get("ticksmin");
        var high = this.model.get("highlights");

        this.widgetID = this.typeID + "-" + title + "-" + SpeedGaugeWidget.widgetCounter;
        SpeedGaugeWidget.widgetCounter++;

        //Save the HTMLElements
        this.htmlElement = "<li><canvas id=\""+ this.widgetID + "\"></canvas></li>";

        this.config.renderTo = this.widgetID;

        if(title)    this.config.title = title;
        if(unit)     this.config.units = unit;
        if(maxValue) this.config.maxValue = maxValue;
        if(minValue) this.config.minValue = minValue;
        if(ticks)    this.config.majorTicks = ticks;
        if(ticksmin) this.config.minorTicks = ticksmin;

        for (var i in high) {
            if(! high.hasOwnProperty(i)) continue;
            this.config.highlights.push({from: high[i].start, to: high[i].end, color: 'rgba' + high[i].color});
        }

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

    /** Initialise the Gauge */
    init(){
        this.gauge = new Gauge(this.config);
        this.gauge.draw();

    }

    resize(size_x: number, size_y:number){
        this.config.height = size_y*1.1;
        this.config.width = size_x*1.1;
        this.gauge.updateConfig(this.config);
        this.gauge.setValue(this.model.get("value"));

    }

    destroy(){
        super.destroy();
        delete this;
    }

}


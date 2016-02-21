///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dashboard.ts" />
///<reference path="dataModel.ts" />

import {Dashboard} from "./dashboard";
import {GoogleMapWidgetConfig} from "./Map";

class WidgetFactory{

    /** All available signals */
    private signalsDesc: {[id: string]: SignalDescription;} = {};
    private signalsReady: boolean = false;
    /** All available widgets */
    private widgetConfigurations: {[signal: string]:  { [id: string] : WidgetConfig; };} = {};
    private widgetsReady: boolean = false;

    /** Used DataCollection */
    private dataCollection: DataCollection;

    private dashboard: Dashboard;

    cnt: number = 0;


    /**
     * The Constructor of the widget factory saves some objects
     * for later use and initiates the reading of the signals-xml
     * @param dataCollection The datacollection with the used data
     * @param dashboard the used dashboard object
     */
    constructor(dataCollection: DataCollection, dashboard: Dashboard){
        this.dataCollection = dataCollection;
        this.dashboard = dashboard;
        this.widgetConfigurations["default"] = {};
        this.getSignalsInit();
    }


    /**
     * Creates and returns a widget
     * @param widgetTagName The name of the widget-type
     * @param signal The name of the signal, usually value.something
     * @param options Further options, for example for the BackboneJS.View class
     * @returns {Widget} The created Widget
     */
    createWidget(widgetTagName: string, signal: string, options?): Widget{
        var widgetConfig = this.widgetConfigurations["default"][widgetTagName];
        var signalConfig = this.signalsDesc[signal];
        var model: Model = this.dataCollection.getOrCreate(signalConfig);

        model.set({name: signalConfig.name, description: signalConfig.description,
            maxValue: signalConfig.maxValue, minValue: signalConfig.minValue, ticks:signalConfig.ticks});

        if(widgetConfig != null){
            var widget: Widget = widgetConfig.newInstance({model: model});
            return widget;
        }

        return null;
    }

    /**
     * Doesn't add a widget perse, but the option of a widget,
     * to be used by several values
     * @param widgetConfig The config thats to be used
     */
    addWidget(signal: string, widgetConfig: WidgetConfig){
        console.log(widgetConfig.type_name);

        if (!this.widgetConfigurations[signal]) {
            this.widgetConfigurations[signal] = {};
        }

        this.widgetConfigurations[signal][widgetConfig.type_name] = widgetConfig;
    }

    /**
     * Return all the available widget options
     * @returns {{}} A map of the options
     */
    getOptions(signal: string):{ [id: string] : WidgetConfig;}{
        return this.widgetConfigurations[signal];
    }

    /**
     * Returns all the available signal options
     * @returns {{}} A map of the options
     */
    getSignals():{[id: string]: SignalDescription;}{
        if(!this.signalsReady) return null;
        return this.signalsDesc;
    }

    /**
     * Is used to initiate the decoding of available Signals
     */
    private getSignalsInit() {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.signal(xhttp);
            }
        }.bind(this);

        xhttp.open("GET", "signals.xml", true);
        xhttp.send();

    }

    /**
     * Decodes XML-File
     * @param xhttp the XHTTP-Request
     */
    signal(xhttp: XMLHttpRequest){
        var xmlDoc = xhttp.responseXML;
        var elements = xmlDoc.getElementsByTagName("signal");


        for(var i = 0; i < elements.length; i++){


            var tagName: string = xmlDoc.getElementsByTagName("signal")[i].getAttribute("category");
            var name: string = elements[i].getElementsByTagName("name")[0].textContent;
            var maxValue: number = parseInt(elements[i].getElementsByTagName("maxValue")[0].textContent);
            var minValue: number = parseInt(elements[i].getElementsByTagName("minValue")[0].textContent);
            var desc: string = elements[i].getElementsByTagName("description")[0].textContent;
            var unit: string = elements[i].getElementsByTagName("unit")[0].textContent;
            var tickse = elements[i].getElementsByTagName("ticks");
            var ticks = new Array<string>(); //ticks as string values

            var highlightse = elements[i].getElementsByTagName("highlight");
            var highlightsv;
            var highlights: Array<{}> = new Array<{}>();

            var widgetse = elements[i].getElementsByTagName("widget");
            var widgets: Array<{}> = new Array<{}>();


            console.log(tickse[0].textContent);
            if (tickse[0]) {
                var n = parseInt(tickse[0].textContent);
                var step = (maxValue - minValue) / (n- 1);
                for (var j = 0; j < n; j++) {
                    ticks.push((minValue + j * step) + "");
                }

            }



            for (var j = 0; j < highlightse.length; j++) {
              /*  var h: string = highlightse[j].textContent;
                var sepI: number = h.indexOf(";");
                var sepC : number = h.indexOf(":");
                highlights[j] = {start: parseInt(h.substring(0, sepI)), end: parseInt(h.substring(sepI + 1, sepC)), color: h.substring(sepC + 1, h.length).split(' ').join('')}*/

                var h = highlightse[j];

                var startValue = parseInt(h.getElementsByTagName("start")[0].textContent);
                var endValue = parseInt(h.getElementsByTagName("end")[0].textContent);
                var colorRGB = h.getElementsByTagName("color")[0].textContent;

                highlights.push({start: startValue, end: endValue, color: colorRGB});
            }

            for (var j = 0; j < widgetse.length; j++) {
                /*  var h: string = highlightse[j].textContent;
                 var sepI: number = h.indexOf(";");
                 var sepC : number = h.indexOf(":");
                 highlights[j] = {start: parseInt(h.substring(0, sepI)), end: parseInt(h.substring(sepI + 1, sepC)), color: h.substring(sepC + 1, h.length).split(' ').join('')}*/

                var h = widgetse[j].textContent;

                switch (h) {
                    case "gauge": this.addWidget(name, new SpeedGaugeWidgetConfig()); break;
                    case "text widget": this.addWidget(name, new TextWidgetConfig()); break;
                    case "percent gauge": this.addWidget(name, new PercentGaugeWidgetConfig()); break;
                    case "line graph": this.addWidget(name, new LineChartWidgetConfig()); break;
                    case "map": this.addWidget(name, new GoogleMapWidgetConfig()); break;
                    default: break;
                }
            }
            this.signalsDesc[tagName] = new SignalDescription(name, tagName, unit, maxValue, minValue, desc, ticks, highlights);
        }
        this.dashboard.updateSignalSelector(this.signalsDesc);
    }


}

/** The description of a Signal
 * Gets used to keep all available signals in a map
 */
class SignalDescription{

    tagName: string;
    name: string;
    unit: string;
    maxValue: number;
    minValue: number;
    description: string;
    ticks: string[];
    highlights: {}[];


    constructor(name:string, tagName: string, unit:string, maxValue:number, minValue:number, description:string, ticks:string[], highlights: {}[]) {
        this.tagName = tagName;
        this.name = name;
        this.unit = unit;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.description = description;
        this.ticks = ticks;
        this.highlights = highlights;

     //   console.log(highlights);

    }
}

export{SignalDescription, WidgetFactory};

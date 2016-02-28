///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dashboard.ts" />
///<reference path="dataModel.ts" />
///<reference path="dashboard.ts" />

class WidgetFactory{

    /** All available signals */
    static signalsDesc: {[id: string]: SignalDescription;} = {};
    private signalsReady: boolean = false;
    /** All available widgets */
    private widgetConfigurations: {[signal: string]:  { [id: string] : WidgetConfig; };} = {};

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
     * @returns {Widget} The created Widget
     */
    createWidget(widgetTagName: string, signal: string): Widget{

        var widgetConfig = this.widgetConfigurations["default"][widgetTagName];
        var signalConfig = WidgetFactory.signalsDesc[signal];
        var model: Model = this.dataCollection.getOrCreate(signalConfig);

        if(!signalConfig){
            console.log("We are sorry but there was no configuration with that signal name found.")
            return null;
        }

        model.set({name: signalConfig.name, description: signalConfig.description,
        maxValue: signalConfig.maxValue, minValue: signalConfig.minValue, ticks:signalConfig.ticks});

        if(widgetConfig != null){
            return widgetConfig.newInstance({model: model});
        }

        return null;
    }

    /**
     * Doesn't add a widget perse, but the option of a widget,
     * to be used by several values
     * @param widgetConfig The config thats to be used
     * @param signal The signal the widget is supposed to be assigned
     */
    addWidget(signal: string, widgetConfig: WidgetConfig){

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
     * But only if all of them have been added to the
     * @returns {{}} A map of the options
     */
    getSignals():{[id: string]: SignalDescription;}{
        if(!this.signalsReady) return null;
        return WidgetFactory.signalsDesc;
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

        xhttp.open("GET", "base/src/tsnode/ui/signals.xml", true);
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
            var tickse = elements[i].getElementsByTagName("major");
            var ticksmine = elements[i].getElementsByTagName("minor");
            var ticks: string[] = []; //ticks as string values
            var ticksmin;

            var highlightse = elements[i].getElementsByTagName("highlight");
            var highlights: Array<{}> = [];

            var widgetse = elements[i].getElementsByTagName("widget");

            if (tickse[0]) {
                var n = parseInt(tickse[0].textContent);
                var step = (maxValue - minValue) / (n - 1);
                for (var j = 0; j < n; j++) {
                    ticks.push((minValue + j * step) + "");
                }
            }

            if (ticksmine[0]) {
                ticksmin = parseInt(ticksmine[0].textContent);
            }




            for (var j = 0; j < highlightse.length; j++) {

                var h = highlightse[j];

                var startValue = parseInt(h.getElementsByTagName("start")[0].textContent);
                var endValue = parseInt(h.getElementsByTagName("end")[0].textContent);
                var colorRGB = h.getElementsByTagName("color")[0].textContent;

                highlights.push({start: startValue, end: endValue, color: colorRGB});
            }

            this.addWidget(name, new TextWidgetConfig());
            for (var j = 0; j < widgetse.length; j++) {

                var h = widgetse[j].textContent;

                switch (h) {
                    case "gauge": this.addWidget(name, new SpeedGaugeWidgetConfig()); break;
                    case "percent gauge": this.addWidget(name, new PercentGaugeWidgetConfig()); break;
                    case "line graph": this.addWidget(name, new LineChartWidgetConfig()); break;
                    case "map": this.addWidget(name, new GoogleMapWidgetConfig()); break;
                    default: break;
                }
            }
            WidgetFactory.signalsDesc[tagName] = new SignalDescription(name, tagName, unit, maxValue, minValue, desc, ticks, ticksmin, highlights);
        }

        this.signalsReady = true;
        if(this.dashboard) this.dashboard.updateSignalSelector(WidgetFactory.signalsDesc);

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
    ticksmin: number;
    highlights: {}[];


    constructor(name:string, tagName: string, unit:string, maxValue:number, minValue:number, description:string, ticks:string[], ticksmin:number, highlights: {}[]) {
        this.tagName = tagName;
        this.name = name;
        this.unit = unit;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.description = description;
        this.ticks = ticks;
        this.ticksmin = ticksmin;
        this.highlights = highlights;

    }
}


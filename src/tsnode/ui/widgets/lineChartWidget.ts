/**
 * Created by soads_000 on 07.02.2016.
 */
///<reference path="../widget.ts" />
/// <reference path="../../../../typings/chartjs/chart.d.ts" />


class LineChartWidgetConfig implements WidgetConfig{

    "type_name" = "LineChartWidget";

    "display_name" = "line graph widget";

    newInstance(options):Widget {
        return new LineChartWidget(options);
    }

}

class LineChartWidget extends Widget{

    static widgetCounter: number = 0;

    /** Name of the Widget Type */
    typeID: string = "LineChartWidget";

    /** HTML-String that is pushed into the HTML-File */
    htmlElement: string;

    /** the number of the current value */
    counter: number = 0;
    factor: number = 20;

    /** HTML Text */
    htmlText: HTMLCanvasElement;

    /** ChartObject */
    chart: LinearInstance;

    startingData: LinearChartData = {
        labels: [],
        datasets: [
            {
                label: "",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: []
            }
        ]
    };


    updateValue() {
        var label = "";
        if(this.counter%this.factor == 0) label = this.counter + "";
        this.chart.addData([this.model.get("value")], label);

        this.counter++;
        if(this.counter >= 200) this.chart.removeData();
    }

    /** Init gets called after the widget has been added to the grid */
    init() {
        this.htmlText = <HTMLCanvasElement> document.getElementById(this.widgetID)

        var value: number = this.model.get("value");
        if(!value) value = 0;

        this.startingData.labels = [""];
        this.counter++;

        this.startingData.datasets[0].data = [value];
        this.chart = new Chart(this.htmlText.getContext("2d")).Line(this.startingData, { pointDot : false});

    }

    constructor(options?){
        super(options);

        /** Chart settings */
        Chart.defaults.global.responsive = true;
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.global.animation = false;
        Chart.defaults.global.showTooltips = false;

        /** Create different IDs */
        this.widgetID = this.typeID + "-" + this.model.get("tagName") + "-" + LineChartWidget.widgetCounter;
        LineChartWidget.widgetCounter++;

        this.htmlElement = "<li><canvas align=\"center\" id=\"" + this.widgetID  + "\" > </canvas></li>";

    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change:value', this.updateValue.bind(this));
    }

    /** The render function that gets called when the value changes */
    render():LineChartWidget{

        if(this.chart == null){
            return this;
        }

        this.chart.addData(this.model.get("time"), this.model.get("value"));

        return this;
    }

    /** Resizes the Widget */
    resize(size_x: number, size_y:number){

        this.htmlText.width = size_x;
        this.htmlText.height = size_y;

        this.counter = 0;

        this.startingData.datasets[0].data = this.chart.datasets[0].points;

        this.chart.destroy();

        this.init();

        this.factor = Math.round(2 * (200 / size_x )) * 10;

    }

    destroy(){
        super.destroy();
        this.chart.destroy();
        delete this;
    }


}


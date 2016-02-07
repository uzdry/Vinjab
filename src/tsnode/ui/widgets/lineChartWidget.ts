/**
 * Created by soads_000 on 07.02.2016.
 */
///<reference path="../widget.ts" />
/// <reference path="../../../../typings/chartjs/chart.d.ts" />


class LineChartWidgetConfig implements WidgetConfig{

    "type_name" = "LineChartWidget";

    "display_name" = "LineChart Widget";

    newInstance(options):Widget {
        return new LineChartWidget(options);
    }

}

class LineChartWidget extends Widget{

    static widgetCounter: number = 0;

    /** Name of the Widget Type */
    typeID: string = "LineChart";

    /** HTML-String that is pushed into the HTML-File */
    htmlElement: string;

    /** the current value of the widget*/
    value: number|boolean;

    /** Id of the document */
    id: string;

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


    updateValue(value:number|boolean) {
        this.value = value;
        this.init();
    }

    /** Init gets called after the widget has been added to the grid */
    init() {
        this.htmlText = <HTMLCanvasElement> document.getElementById(this.widgetID)

        if (this.model.get("data") != null) {
            this.startingData.labels = this.model.get("time");
            this.startingData.datasets[0].data = this.model.get("data");
            this.chart = new Chart(this.htmlText.getContext("2d")).Line(this.model.get("data"));
        }else{
            this.listenToOnce(this.model, "change:data", function(){
                this.startingData.labels = this.model.get("time");
                this.startingData.datasets[0].data = this.model.get("data");
                this.chart = new Chart(this.htmlText.getContext("2d")).Line(this.model.get("data"));
            });
        }
    }

    constructor(options?){
        super(options);

        /** Chart settings */
        Chart.defaults.global.responsive = true;
        Chart.defaults.global.maintainAspectRatio = false;

        /** Create different IDs */
        this.widgetID = this.typeID + "-" + this.model.id + "-" + LineChartWidget.widgetCounter;
        LineChartWidget.widgetCounter++;

        this.htmlElement = "<li><canvas align=\"center\" id=\"" + this.widgetID  + "\" > </canvas></li>";
        this.value = options.value;
        this.id = options.id;

        /** */
    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change:data', this.render);
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
        this.chart.destroy();
        this.chart = new Chart(this.htmlText.getContext("2d")).Line(this.startingData);
        console.log(this.chart);

    }


}


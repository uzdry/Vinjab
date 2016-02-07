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
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [
            {
                label: "",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: [28, 48, 40, 19, 86, 27, 90]
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
        this.chart = new Chart(this.htmlText.getContext("2d")).Line(this.startingData);
        //TODO Initialise the Widget

    }

    constructor(options?){
        super(options);

        Chart.defaults.global.responsive = true;
        Chart.defaults.global.maintainAspectRatio = false;

        this.widgetID = this.typeID + "-" + this.model.id + "-" + LineChartWidget.widgetCounter;
        LineChartWidget.widgetCounter++;

        this.htmlElement = "<li><canvas align=\"center\" id=\"" + this.widgetID  + "\" > </canvas></li>";
        this.value = options.value;
        this.id = options.id;
    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change', this.render);
    }

    /** The render function that gets called when the value changes */
    render():LineChartWidget{

        //TODO

        return this;
    }

    resize(size_x: number, size_y:number){

        this.htmlText.width = size_x;
        this.htmlText.height = size_y;
        this.chart.destroy();
        this.chart = new Chart(this.htmlText.getContext("2d")).Line(this.startingData);
        console.log(this.chart);

    }


}


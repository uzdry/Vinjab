/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts" />
/// <reference path="../../src/tsnode/ui/grid.ts" />
/// <reference path="../../src/tsnode/ui/dashboard.ts" />

describe("Test of Grid class", () => {

    var dashboard = null;

    var dashconfig: string = '[{\"row\":1,\"col\":9,\"size_x\":9,\"size_y\":7,\"name\":' +
        '\"SpeedGauge\",\"valueID\":\"value.speed\"},{\"row\":1,\"col\":1,\"size_x\":8,\"size_y\":7,' +
        '\"name\":\"SpeedGauge\",\"valueID\":\"value.RPM\"},{\"row\":8,\"col\":1,\"size_x\":6,' +
        '\"size_y\":5,\"name\":\"TextWidget\",\"valueID\":\"value.engine runtime\"},{\"row\":8,\"col\":' +
        '7,\"size_x\":5,\"size_y\":5,\"name\":\"PercentGauge\",\"valueID\":\"value.fuel\"},{\"row\":8,' +
        '\"col\":12,\"size_x\":6,\"size_y\":2,\"name\":\"TextWidget\",\"valueID\":' +
        '\"value.aggregated.fuel consumption\"},{\"row\":10,\"col\":12,\"size_x\":6,\"size_y\":2,' +
        '\"name\":\"TextWidget\",\"valueID\":\"value.temperature outside\"}]'

    beforeAll(()=> {

        jasmine.getFixtures().fixturesPath = "base/"
        var f = readFixtures("spec/ui/test.html");
        loadFixtures("spec/ui/test.html");

        dashboard = new Dashboard();
        expect(dashboard).not.toBeNull();

        dashboard.widgetFactory.addWidget("default", new SpeedGaugeWidgetConfig());
        dashboard.widgetFactory.addWidget("default", new TextWidgetConfig());
        dashboard.widgetFactory.addWidget("default", new PercentGaugeWidgetConfig());
        dashboard.widgetFactory.addWidget("default", new LineChartWidgetConfig());
        dashboard.widgetFactory.addWidget("default", new GoogleMapWidgetConfig());

    });

    it("Try to add Widgets by 'using' the ui elements", () => {

        //TODO JQuery.data somehow not defined in this namespace
        //var numOfSignals = sizeOfAssocArray(dashboard.widgetFactory.getSignals());
        //var rndmSigIndex = randomIntFromInterval(0, numOfSignals - 1);
        //
        //$('#dSignals').ddslick('select', {index: rndmSigIndex});
        //
        //var widgetName = $('#dSignals').children("input").attr('value');
        //var numOfWidgets = sizeOfAssocArray(dashboard.widgetFactory.getOptions(widgetName));
        //var rndmWidgIndex = randomIntFromInterval(0, numOfWidgets - 1);
        //
        //$('#dWidgets').ddslick('select', {index: rndmWidgIndex});
        //
        //dashboard.button.click();
        expect(false).toBe(true);

    });

    it("Add Widgets to the Grid by using the fromSerialized function", () => {
        setTimeout(()=>{
            postal.channel("values").publish(Topic.DASHBOARD_ANS_MSG.name, new DashboardRspMessage(dashboard.user, dashconfig));
        }, 100);
    });


    it("update the drives dropdown", () => {
        postal.channel("values").publish(Topic.REPLAY_INFO.name, new ReplayInfoMessage([21504,148836,426733,485968,270479,170778,44903,9538,85714,93586,8683,90553,59805,3071552,17192,10964]));
    });


});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function sizeOfAssocArray(array){
    var size = 0, key;
    for (key in array) {
        if (array.hasOwnProperty(key)) size++;
    }
    return size;
}

/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts" />
/// <reference path="../../src/tsnode/ui/grid.ts" />
/// <reference path="../../src/tsnode/ui/dashboard.ts" />

describe("Test of Grid class", () => {

    var dashboard = null;

    beforeAll(()=> {
        console.log("hi");
        jasmine.getFixtures().fixturesPath = "base/"
        var f = readFixtures("spec/ui/test.html");
        loadFixtures("spec/ui/test.html");

        setTimeout(() => {
            done();
        }, 5000);
        //expect(dashboard).not.toBeNull();
    });

    it("Add some Stuff", () => {
        dashboard = new Dashboard();
        expect(dashboard).not.toBeNull();

        var numOfSignals = sizeOfAssocArray(dashboard.widgetFactory.getSignals());
        var numOfWidgets = sizeOfAssocArray(dashboard.widgetFactory.getOptions("default"));

        var rndmSigIndex = randomIntFromInterval(0, numOfSignals - 1);
        var rndmWidgIndex = randomIntFromInterval(0, numOfWidgets - 1);

        setTimeout(() => {
            $('#dSignals').ddslick('select', {index: rndmSigIndex});
            $('#dWidgets').ddslick('select', {index: rndmWidgIndex});


        }, 500);

    });

    it("Check the results of the previous test", ()=>{
        $('#addButton').trigger('click');

        expect(dashboard.grid.serialize()).not.toBe("[]");
    });

    var conf;
    it("Check the fromSerialized function while using the postal bus", ()=>{
        conf = dashboard.grid.serialize();
        postal.channel("values").publish(Topic.DASHBOARD_ANS_MSG.name, new DashboardRspMessage(dashboard.user, conf));
    });

    it("Check the results of the previous test", () => {
        expect(dashboard.grid.serialize()).toBe(conf);
    });


});

describe("Test UI stuff on the dashboard", () => {

    var dashboard = null;

    beforeAll(()=> {
        jasmine.getFixtures().fixturesPath = "base/"
        var f = readFixtures("spec/ui/test.html");
        loadFixtures("spec/ui/test.html");

        setTimeout(() => {
            done();
        }, 5000);
    });

    it("Add some Stuff", () => {
        dashboard = new Dashboard();
        expect(dashboard).not.toBeNull();

        var numOfSignals = sizeOfAssocArray(dashboard.widgetFactory.getSignals());
        var numOfWidgets = sizeOfAssocArray(dashboard.widgetFactory.getOptions("default"));

        var rndmSigIndex = randomIntFromInterval(0, numOfSignals - 1);
        var rndmWidgIndex = randomIntFromInterval(0, numOfWidgets - 1);

        setTimeout(() => {
            $('#dSignals').ddslick('select', {index: rndmSigIndex});
            $('#dWidgets').ddslick('select', {index: rndmWidgIndex});


        }, 500);

    });

    it("Check the results of the previous test", ()=>{
        $('#addButton').trigger('click');

        expect(dashboard.grid.serialize()).not.toBe("[]");
    });

    var conf;
    it("Check the fromSerialized function while using the postal bus", ()=>{
        conf = dashboard.grid.serialize();
        postal.channel("values").publish(Topic.DASHBOARD_ANS_MSG.name, new DashboardRspMessage(dashboard.user, conf));
    });

    it("Check the results of the previous test", () => {
        expect(dashboard.grid.serialize()).toBe(conf);
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

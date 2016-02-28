/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts" />
/// <reference path="../../src/tsnode/ui/grid.ts" />
/// <reference path="../../src/tsnode/messages.ts" />
/// <reference path="../../src/tsnode/ui/widgetFactory.ts" />


/** ======================================================
 * Tests for general working initialisation of all Widgets
 ========================================================*/
describe("Test the creation of all implemented widgets", () => {

    // Basic fixture of the gridster
    var fixture:string = '<div id="fixture"><div class="gridster"><ul></ul></div></div>';
    // The Basic grid object
    var grid;

    // Initiate a basic grid
    beforeAll(()=>{
        document.body.insertAdjacentHTML('afterbegin', fixture);
        grid = new Grid(null);
    });

    // Destroy the basic grid
    afterAll(()=>{
        grid.destroy();
        document.body.removeChild(document.getElementById('fixture'));
    });

    /**
     * Add a LineChart,
     */
    it("Add LineChart widget", () => {

        var model = new DataModel();
        var widget: Widget = new LineChartWidget({model: model});

        grid.addWidget(widget);

    });

    it("Add Gauge widget", () => {

        var model = new DataModel();
        var widget: Widget = new PercentGaugeWidget({model: model});

        grid.addWidget(widget);

    });

    it("Add SpeedGauge widget", () => {

        var model = new DataModel();
        var widget: Widget = new SpeedGaugeWidget({model: model});

        grid.addWidget(widget);

    });

    it("Add Text widget", () => {

        var model = new DataModel();
        var widget: Widget = new TextWidget({model: model});

        grid.addWidget(widget);

    });


});


/** ======================================================
 * Tests for working valueUpdate of all Widgets
 ========================================================*/
describe("Test some of the datacollection and ", () => {

    // Basic fixture of the gridster
    var fixture:string = '<div id="fixture"><div class="gridster"><ul></ul></div></div>';
    // The Basic grid object
    var grid = null;

    var collection;
    var model;
    var number;

    // Initiate a basic grid
    beforeAll(()=>{
        document.body.insertAdjacentHTML('afterbegin', fixture);

        collection = new DataCollection();
        model = collection.getOrCreate({"tagName": "value.schrott"});

        grid = new Grid(null);

    });

    // Destroy the basic grid
    afterAll(()=>{
        //grid.destroy();
        document.body.removeChild(document.getElementById('fixture'));
    });

    beforeEach(() => {
        for(var i = 0; i < 10; i++) {
            number = Math.random() * i * 10;

            postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
                Value(number, "")));
        }
    });

    afterEach(() => {
        number = Math.random() * 50;

        postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
            Value(number, "")));
    });

    /**
     * Add a LineChart,
     */
    it("Add LineChart widget", () => {
        expect(grid).not.toBeNull();

        var widget: LineChartWidget = new LineChartWidget({model: model});
        grid.addWidget(widget);

        expect(widget.model.get("value")).toBe(number);

    });

    it("Add Gauge widget", () => {

        var widget: PercentGaugeWidget = new PercentGaugeWidget({model: model});
        grid.addWidget(widget);

        expect(widget.gauge.getValue()).toBe(number);

    });

    it("Add SpeedGauge widget", () => {

        var widget: SpeedGaugeWidget = new SpeedGaugeWidget({model: model});
        grid.addWidget(widget);

        expect(widget.gauge.getValue()).toBe(number);

    });

    it("Add Text widget", () => {

        var widget: Widget = new TextWidget({model: model});
        grid.addWidget(widget);

        expect(widget.model.get("value")).toBe(number);

    });

    it("Add Map Widget", ()=>{
        var widget: Widget = new GoogleMapWidget({model: model});
        grid.addWidget(widget);

        expect(widget.model.get("value")).toBe(number);
    });


});


/** ======================================================
 * Tests for errors while resizing the widgets
 * This obviously doesn't take into account, that the UI
 * has some undefined behaviour by itself
 ========================================================*/
describe("Test for errors while resizing widgets ", () => {

    // Basic fixture of the gridster
    var fixture:string = '<div id="fixture"><div class="gridster"><ul></ul></div></div>';
    // The Basic grid object
    var grid;

    var collection;
    var model;

    // Initiate a basic grid
    beforeAll(()=>{
        collection = new DataCollection();
        model = collection.getOrCreate({"tagName": "value.schrott"});
        document.body.insertAdjacentHTML('afterbegin', fixture);
        grid = new Grid(null);
    });

    // Destroy the basic grid
    afterAll(()=>{
        grid.destroy();
        document.body.removeChild(document.getElementById('fixture'));
    });

    /**
     * Add a LineChart,
     */
    it("Add LineChart widget", () => {

        var widget: LineChartWidget = new LineChartWidget({model: model});
        grid.addWidget(widget);

        widget.resize(Math.random() * 100, Math.random() * 200);

    });

    it("Add Gauge widget", () => {

        var widget: PercentGaugeWidget = new PercentGaugeWidget({model: model});
        grid.addWidget(widget);

        widget.resize(Math.random() * 100, Math.random() * 200);

    });

    it("Add SpeedGauge widget", () => {

        var widget: SpeedGaugeWidget = new SpeedGaugeWidget({model: model});
        grid.addWidget(widget);

        widget.resize(Math.random() * 100, Math.random() * 200);


    });

    it("Add Text widget", () => {

        var widget: Widget = new TextWidget({model: model});
        grid.addWidget(widget);

        widget.resize(Math.random() * 100, Math.random() * 200);

    });

    it("Add Map Widget", ()=>{
        var widget: Widget = new GoogleMapWidget({model: model});
        grid.addWidget(widget);

        widget.resize(Math.random() * 100, Math.random() * 200);
    });


});

describe("Test the widgets using a widgetFactory", ()=>{

    var collection;
    var grid;
    var factory;
    var fixture:string = '<div id="fixture"><div class="gridster"><ul></ul></div></div>';

    beforeAll(() => {
        collection = new DataCollection();
        factory = new WidgetFactory(collection, null);
        grid = new Grid(null);

        factory.addWidget("default", new SpeedGaugeWidgetConfig());
        factory.addWidget("default", new TextWidgetConfig());
        factory.addWidget("default", new PercentGaugeWidgetConfig());
        factory.addWidget("default", new LineChartWidgetConfig());
        factory.addWidget("default", new GoogleMapWidgetConfig());

        // Inject necessary code
        document.body.insertAdjacentHTML('afterbegin', fixture);
        jasmine.getFixtures().fixturesPath = "base/"
        var f = readFixtures("src/tsnode/ui/signals.xml");
        expect(f).not.toBeNull();

    });

    it("Add LineChart to Factory and reteive it", () => {
        setTimeout(()=>{
            expect(factory.createWidget("LineChartWidget", "value.speed")).not.toBe(null);
        }, 100);
    });

    it("Add PercentGauge to Factory and reteive it", () => {
        expect(factory.createWidget("PercentGauge", "value.speed")).not.toBe(null);
    });

    it("Add SpeedGaugeWidget to Factory", () => {
        expect(factory.createWidget("SpeedGauge", "value.speed")).not.toBe(null);
    });

    it("Add LineChartWidget to Factory", () => {
        expect(factory.createWidget("TextWidget", "value.speed")).not.toBe(null);
    });

    it("Add MapWidget to Factory", () => {
        expect(factory.createWidget("SurroundingsMap", "value.speed")).not.toBe(null);
    });

});

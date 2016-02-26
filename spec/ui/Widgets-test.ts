/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts" />
/// <reference path="../../src/tsnode/ui/grid.ts" />


import {Grid} from "../../src/tsnode/ui/grid";
import {ValueMessage, Topic, Value} from "../../src/tsnode/messages";
import {WidgetFactory} from "../../src/tsnode/ui/widgetFactory";

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
        //grid.destroy();
        document.body.removeChild(document.getElementById('fixture'));
    });

    /**
     * Add a LineChart,
     */
    it("Add LineChart widget", () => {

        var widget: LineChartWidget = new LineChartWidget({model: model});
        grid.addWidget(widget);

        var number = Math.random() * 10;

        postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
            Value(number, "")));

        expect(widget.model.get("value")).toBe(number);

    });

    it("Add Gauge widget", () => {

        var widget: PercentGaugeWidget = new PercentGaugeWidget({model: model});
        grid.addWidget(widget);

        var number = Math.random() * 10;

        postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
            Value(number, "")));

        expect(widget.gauge.getValue()).toBe(number);

    });

    it("Add SpeedGauge widget", () => {

        var widget: SpeedGaugeWidget = new SpeedGaugeWidget({model: model});
        grid.addWidget(widget);

        var number = Math.random() * 10;

        postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
            Value(number, "")));

        expect(widget.gauge.getValue()).toBe(number);

    });

    it("Add Text widget", () => {

        var widget: Widget = new TextWidget({model: model});
        grid.addWidget(widget);

        var number = Math.random() * 10;

        postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
            Value(number, "")));

        expect(widget.model.get("value")).toBe(number);

    });

    it("Add Map Widget", ()=>{
        var widget: Widget = new GoogleMapWidget({model: model});
        grid.addWidget(widget);

        var number = Math.random() * 10;

        postal.channel("values").publish("value.schrott", new ValueMessage(new Topic("value.schrott"), new
            Value(number, "")));

        expect(widget.model.get("value")).toBe(number);
    });


});


/** ======================================================
 * Tests for errors while resizing the widgets
 * This obviously doesn't take into account, that the UI
 * has some undefined behaviour by itself
 ========================================================*/
describe("Test some of the datacollection and ", () => {

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
        //grid.destroy();
        document.body.removeChild(document.getElementById('fixture'));
    });

    /**
     * Add a LineChart,
     */
    it("Add LineChart widget", () => {

        var widget: LineChartWidget = new LineChartWidget({model: model});
        grid.addWidget(widget);

        var number = Math.random() * 10;

        widget.resize(Math.random() * 100, Math.random() * 200);

        expect(widget.model.get("value")).toBe(number);

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
        document.body.insertAdjacentHTML('afterbegin', fixture);
        grid = new Grid(null);
        collection = new DataCollection();
        factory = new WidgetFactory(collection, null);
    });

    it("Add LineChart to Factory and reteive it", () => {
        factory.addWidget(new LineChartWidgetConfig());
        expect(factory.createWidget("LineChartWidget", "value.random")).not.toBe(null);
    });

    it("Add PercentGauge to Factory and reteive it", () => {
        factory.addWidget(new PercentGaugeWidgetConfig());
        expect(factory.createWidget("PercentGauge", "value.random")).not.toBe(null);
    });

    it("Add SpeedGaugeWidget to Factory", () => {
        factory.addWidget(new SpeedGaugeWidgetConfig());
        expect(factory.createWidget("SpeedGauge", "value.random")).not.toBe(null);
    });

    it("Add LineChartWidget to Factory", () => {
        factory.addWidget(new TextWidgetConfig());
        expect(factory.createWidget("TextWidget", "value.random")).not.toBe(null);
    });

    it("Add MapWidget to Factory", () => {
        factory.addWidget(new GoogleMapWidgetConfig());
        expect(factory.createWidget("SurroundingsMap", "value.random")).not.toBe(null);
    });

});

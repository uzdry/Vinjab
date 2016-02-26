/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts" />
/// <reference path="../../src/tsnode/ui/grid.ts" />

import {Grid} from "../../src/tsnode/ui/grid";
import {WidgetFactory} from "../../src/tsnode/ui/widgetFactory";

describe("Test of Grid class", () => {

    var grid:Grid;
    var fixture = '<div id="fixture"><div class="gridster"><ul></ul></div></div>';

    beforeEach(()=>{
        document.body.insertAdjacentHTML('afterbegin', fixture);
        grid = new Grid(null);
    });

    it("Create grid", () => {
        var grid = new Grid(null);
        expect(grid).not.toBeNull();
    });

    it("Test WidgetFactory", ()=>{
            var factory = new WidgetFactory(new DataCollection(), null);
    });




});

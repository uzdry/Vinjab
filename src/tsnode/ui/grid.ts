/// <reference path="../../../typings/jquery.gridster/gridster.d.ts" />
/// <reference path="../../../typings/canv-gauge/gauge.d.ts" />
/// <reference path="../../../typings/socket.io/socket.io.d.ts" />

class Grid {
    counter : Number;
    gridster : Gridster;
    addButton : JQuery;
    progressBars: {[name: string]: IProgressBar; } = {};

    constructor(){

        this.gridster = $(".gridster ul").gridster({widget_base_dimensions: [100, 55],
            widget_margins: [5, 5]}).data('gridster');
        this.addButton = $('.js-add');

    }

    addWidget(s: string){
        var id: string;
        var bar: ProgressBar;

        if(s.indexOf('=') != -1){
            id = s.charAt(0);
            if(id in this.progressBars){
                bar = this.progressBars[id];
                bar.setProgress(parseInt(s.substr(2)));
            }else{

                //this.gridster.add_widget('<li>' + id + '<div style=\"border: 1px solid black; width:200px; height:20px;\"><div id=\"progress-' + id  +
                //    + '\" style=\"height:20px; width:0px; \"></div></div></li>', 2, 1);
                this.gridster.add_widget('<li>' + id + '<p id="progress-'+id+'"></p>');
                this.progressBars[id] = new ProgressBar(id, parseInt(s.substr(2)));
            }
        }else{
            this.gridster.add_widget('<li>' + s + '</li>');
        }
    }
}

interface IProgressBar{
    progress: number;
    name: string;
    bar: HTMLElement;
    setProgress(progress: Number): void;
}

class ProgressBar implements IProgressBar{
    progress: number = 0;
    name: string;
    bar: HTMLElement;


    constructor(name: string, progress: number){
        this.name = name;
        this.progress = progress;
        this.bar = document.getElementById("progress-"+name);
        this.setProgress(progress);
    }

    setProgress(progress: Number){
        this.bar.innerHTML = "I".repeat(progress);
    }
}

var grid = new Grid();
var button = document.getElementById('js-add');
var options = document.getElementById('js-config');
button.onclick = function (e) {
    grid.addWidget(options.value);
};

String.prototype.repeat = function(n) {
    return new Array(1 + (n || 0)).join(this);
}

var element: HTMLElement = document.getElementById("gauge");

var gauge:Gauge = new Gauge({
    renderTo    : element,
    width       : 400,
    height      : 400,
    glow        : true,
    units       : 'Km/h',
    minValue    : 0,
    maxValue    : 220,
    majorTicks  : ['0','20','40','60','80','100','120','140','160','180','200','220'],
    minorTicks  : 2,
    strokeTicks : false,
    highlights  : [
        { from : 0,   to : 50, color : 'rgba(0,   255, 0, .15)' },
        { from : 50, to : 100, color : 'rgba(255, 255, 0, .15)' },
        { from : 100, to : 150, color : 'rgba(255, 30,  0, .25)' },
        { from : 150, to : 200, color : 'rgba(255, 0,  225, .25)' },
        { from : 200, to : 220, color : 'rgba(0, 0,  255, .25)' }
    ],
    colors      : {
        plate      : '#222',
        majorTicks : '#f5f5f5',
        minorTicks : '#ddd',
        title      : '#fff',
        units      : '#ccc',
        numbers    : '#eee',
        needle     : { start : 'rgba(240, 128, 128, 1)', end : 'rgba(255, 160, 122, .9)' }
    }
});

gauge.setValue(20);


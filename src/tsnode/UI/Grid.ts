/// <reference path="../../../typings/jquery.gridster/gridster.d.ts" />
/// <reference path="../../../typings/justgage/justgage.d.ts" />
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

var gage : JustGage = new JustGage({id:"gage", value:0, min:1, max:20});

var something = setInterval(function(){
    gage.refresh(gage.config.value += 1);
});

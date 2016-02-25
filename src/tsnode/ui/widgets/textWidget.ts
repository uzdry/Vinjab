///<reference path="../widget.ts" />


class TextWidgetConfig implements WidgetConfig{

    "type_name" = "TextWidget";

    "display_name" = "text widget";


    newInstance(options):Widget {
        return new TextWidget(options);
    }

}

class TextWidget extends Widget{

    static widgetCounter: number = 0;

    /** Name of the Widget Type */
    typeID: string = "TextWidget";

    /** HTML-String that is pushed into the HTML-File */
    htmlElement: string;

    /** the current value of the widget*/
    value: number;

    unit: string;

    /** Id of the document */
    id: string;

    /** HTML Text */
    htmlText: HTMLParagraphElement;

    updateValue(value:number) {
        this.value = value;
        this.init();
    }


    init() {
        var unit;

        if(!this.value) {
            this.value = 0;
            unit = "d";
        } else {
            unit = this.model.get("unit");
        }
        this.htmlText = <HTMLParagraphElement>document.getElementById(this.widgetID);
        this.htmlText.innerHTML = "<span id='name" + this.widgetID + "'>" + this.model.get("name") + "</span><br>" +
            "<span id='value"+ this.widgetID + "'>" + this.value.toFixed(2) + " " + unit + "</span>";
    }

    constructor(options?){
        super(options);

        this.widgetID = this.typeID + "-" + this.model.get("tagName") + "-" + TextWidget.widgetCounter;
        TextWidget.widgetCounter++;

        this.htmlElement = "<li><div style='text-align: center; vertical-align: middle; height: 220px; width: 220px; " +
            "display:table-cell; font-size: 100%; line-height: small' id=\"" + this.widgetID  + "\"> </div></li>";
        this.value = options.value;
        this.id = options.id;
    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change:value', this.render);
    }

    /** The render function that gets called when the value changes */
    render():TextWidget {
        this.value = this.model.get("value");
        this.unit = this.model.get("unit");

        if (this.value) {

            this.htmlText.innerHTML = "<span id='name" + this.widgetID + "'>" + this.model.get("name") + "</span><br>" +
            "<span id='value"+ this.widgetID + "'>" + this.value.toFixed(2) + " " + this.unit + "</span>";
        }
        return this;
    }

    resize(size_x: number, size_y:number){
        var name = document.getElementById("name" + this.widgetID);
        var value = document.getElementById("value" + this.widgetID);

        var width, height, factor, curSize, newSize : number;

        if(name.offsetWidth > value.offsetWidth) width = name.offsetWidth;
        else width = value.offsetWidth;

        if(name.offsetHeight > value.offsetHeight) height = 3 * name.offsetHeight;
        else height = 3 * value.offsetHeight;

        if(size_x/width > size_y/height) factor = size_y/height;
        else factor = size_x/width;

        curSize = parseInt(this.htmlText.style.getPropertyValue("font-size").split("%")[0], 10);

        newSize = factor * curSize;

        this.htmlText.style.setProperty("width", (size_x * 1.1) + "px");
        this.htmlText.style.setProperty("height", (size_y * 1.1) + "px");
        this.htmlText.style.setProperty("font-size", newSize.toFixed(2) + "%");
        this.htmlText.style.setProperty("line-height", (0.8 * newSize).toFixed(0) + "%");
    }

    destroy(){
        super.destroy();
        delete this;
    }


}


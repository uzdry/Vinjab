///<reference path="../widget.ts" />


class TextWidgetConfig implements WidgetConfig{

    "type_name" = "TextWidget";

    "display_name" = "Text Widget";


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

    /** Id of the document */
    id: string;

    /** HTML Text */
    htmlText: HTMLParagraphElement;

    updateValue(value:number) {
        this.value = value;
        this.init();
    }


    init() {
        if(!this.value) this.value = 0;
        this.htmlText = <HTMLParagraphElement>document.getElementById(this.widgetID);
        this.htmlText.innerHTML = this.model.get("name") + "<br >" +
            "<br >" + this.value.toFixed(2) + " " + this.model.get("unit");
    }

    constructor(options?){
        super(options);

        this.widgetID = this.typeID + "-" + this.model.get("tagName") + "-" + TextWidget.widgetCounter;
        TextWidget.widgetCounter++;

        this.htmlElement = "<li><div style='text-align: center; vertical-align: middle; height: 220px; width: 220px; box-sizing: border-box;" +
            "display:table-cell;' id=\"" + this.widgetID  + "\"> </div></li>";
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

        if (this.value) {

        this.htmlText.innerHTML = this.model.get("name") + "<br >" +
            "<br >" + this.value.toFixed(2) + " " + this.model.get("unit") ;
        }
        return this;
    }

    resize(size_x: number, size_y:number){
        var resizer = $(""+this.widgetID);
        var size;

        resizer.css("font-size", "10px");

        var factor_x = resizer.width() / size_x;
        var factor_y = resizer.height() / size_y;

        if(factor_x < factor_y){
            resizer.css("font_size", (10 * factor_x).toFixed(1) + "px");
        }else{
            resizer.css("font_size", (10 * factor_y).toFixed(1) + "px")
        }

        this.htmlText.style.setProperty("width", (size_x * 1.1) + "px");
        this.htmlText.style.setProperty("height", (size_y * 1.1) + "px");
    }

    destroy(){
        super.destroy();
        delete this;
    }


}


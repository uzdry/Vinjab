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
        this.htmlText = <HTMLParagraphElement>document.getElementById(this.widgetID);
        this.htmlText.innerHTML = "<div >"+ this.model.get("name") + "<br >" + this.value;
    }

    constructor(options?){
        super(options);

        this.widgetID = this.typeID + "-" + this.model.get("tagName") + "-" + TextWidget.widgetCounter;
        TextWidget.widgetCounter++;

        this.htmlElement = "<li><div id=\"" + this.widgetID  + "\"> </div></li>";
        this.value = options.value;
        this.id = options.id;
    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change:value', this.render);
    }

    /** The render function that gets called when the value changes */
    render():TextWidget{
        this.value = this.model.get("value");

        this.htmlText.innerHTML = "<span style='text-align: center; vertical-align: middle;'>" + this.model.get("name") +
            "<br >" + this.value.toFixed(2) + "</span>";

        return this;
    }

    resize(size_x: number, size_y:number){

    }

    destroy(){
        super.destroy();
        delete this;
    }


}


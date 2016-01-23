///<reference path="../widget.ts" />


class TextWidgetConfig implements WidgetConfig{

    "type_name" = "TextWidget";

    "display_name" = "Text Widget";


    newInstance(options):Widget {
        return new TextWidget(options);
    }

}

class TextWidget extends Widget{

    /** Name of the Widget Type */
    typeID: string = "text";

    /** HTML-String that is pushed into the HTML-File */
    htmlElement: string;

    /** the current value of the widget*/
    value: number|boolean;

    /** Id of the document */
    id: string;

    /** HTML Text */
    htmlText: HTMLParagraphElement;

    updateValue(value:number|boolean) {
        this.value = value;
        this.init();
    }


    init() {
        this.htmlText = <HTMLParagraphElement>document.getElementById("" + this.typeID + "-" + this.model.id);
        this.htmlText.innerHTML = "<br ><br ><br ><br ><br >"+ this.model.get("name") + "<br >" + this.value;
    }

    constructor(options?){
        super(options);
        this.htmlElement = "<li><p align=\"center\" id=\"" + this.typeID + "-" + this.model.id  + "\"> </p></li>";
        this.value = options.value;
        this.id = options.id;
    }

    /** Gets called shortly after the constructor */
    initialize(){
        this.listenTo(this.model, 'change', this.render);
    }

    /** The render function that gets called when the value changes */
    render():TextWidget{
        this.value = this.model.get("value");

        this.htmlText.innerHTML = "<br ><br ><br ><br ><br >"+ this.model.get("name") + "<br >" + this.value;

        return this;
    }


}


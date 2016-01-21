///<reference path="../widget.ts" />


class TextWidget extends Widget{

    /** Name of the Widget Type */
    typeID: string = "text";

    /** HTML-String that is pushed into the HTML-File */
    htmlElement: string;

    /** the current value of the widget*/
    value: number|boolean;

    /** Id of the document */
    id: string;

    updateValue(value:number|boolean) {
        this.value = value;
        this.init();
    }


    init() {
        var e: HTMLElement = document.getElementById(this.id);
        e.innerHTML = "" + this.value;
    }

    constructor(options?){
        super(options);
        this.htmlElement = "<p id=\"" + options.id + "\"> </p>";
        this.value = options.value;
        this.id = options.id;
    }

}


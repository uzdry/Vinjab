///<reference path="dataCollection.ts" />
///<reference path="widgetFactory.ts" />
///<reference path="grid.ts" />
///<reference path="widgets/gaugeWidget.ts" />


/** MVC Stuff */
var dataCollection = new DataCollection();
var dataModel = new DataModel({id: 12});
dataCollection.add(dataModel);

/** Widget Stuff */
var widgetFactory = new WidgetFactory();
var grid = new Grid();
widgetFactory.addWidget(new GaugeWidgetConfig());


var widget = widgetFactory.createWidget("GaugeWidget", dataCollection.get(12));
grid.addWidget(widget);

dataModel.set("value", 12);

/** Test Code */
/*
/var widget = widgetFactory.createWidget("GaugeWidget", "123");
grid.addWidget(widget);

var secondWidget = widgetFactory.createWidget("GaugeWidget", "456");
grid.addWidget(secondWidget);

var cnt: number = 0;
setInterval(function(){widget.updateValue(cnt++)}, 500);
*/

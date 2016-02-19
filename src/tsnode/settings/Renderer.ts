/**
 * @author David G.
 */

/// <reference path="./TextDebugger.ts"/>
/// <reference path="./TSettings.ts"/>

class StyleConstants {
    // Table
    public tableRowHeight : string = "100px";
    public tableWidth : string = "100%";
    public tableHeight : string = "auto";

    // Back button
    public backButtonId : string = "settings_backButton";
    public backButtonWidth : string = "50px";
    public backButtonEnabledColor : string = "GreenYellow";
    public backButtonDisabledColor : string = "Gray";
    public backButtonImgSrc : string = "../../img/settings/leftarrow.png";
    public backButtonImgHeight : string = "50px";
    public backButtonImgWidth : string = "50px";

    // Image column
    public imageColumnWidth : string = "50px";
    public imageWidth : string = "100px";
    public imageHeight : string = "100px";

    // Folders
    public nonEmptyFolderTextColumnBgColor : string = "LightSkyBlue";
    public emptyFolderTextColumnBgColor : string = "PaleVioletRed";

    public nonEmptyFolderInputColumnBgColor : string = "DeepSkyBlue";
    public emptyFolderInputColumnBgColor : string = "MediumVioletRed";

    // Values
    public valueTextColumnBgColor : string = "LightGray";
    public valueInputColumnBgColor : string = "Gray";
    public valueInputColumnWidth : string = "320px";

    public valueNumericUpDownHeight : string = "80px";
    public valueNumericUpDownFontSize : string = "50px";
    public valueNumericUpDownWidth : string = "300px";

    // OK button
    public OKButtonPosition : string = "relative";
    public OKButtonWidth : string = "60%";
    public OKButtonMarginLeft = '20%';
    public OKButtonHeight = '60%';
    public OKButtonFontSize = '18px';
    public OKButtonRowHeight = '60px';
    public OKButtonCellAlign = 'center';
    public OKButtonCellBgColor = 'Orange';
}

/**
 * Creates the main HTML table for the settings GUI.
 */
class TableFactory {

    private valueChangeListener : ValueChangeListener;
    private table : HTMLTableElement;
    private tableBody : HTMLElement;

    private container : Node;
    private actualSettingsNode : SettingsNode;

    private backButton : HTMLTableCellElement;
    private styleConstants : StyleConstants = new StyleConstants;

    /**
     * Creates a new TableFactory.
     * @param container The HTML DOM object that should contain the table (not yet implemented).
     * @param valueChangeListener The object that logs the changes to be written back to the database (to be removed soon...).
     */
    constructor (container : Node, valueChangeListener : ValueChangeListener) {
        this.container = container;
        this.valueChangeListener = valueChangeListener;
    }

    /**
     * Adds a new row to the table that contains a folder or a parameter.
     * The information source is the actualSettingsNode and the amount of the rows already present.
     * Therefore there are no parameters needed.
     */
    appendRow() {
        var rowId = this.tableBody.children.length;
        var actualRowNode = this.actualSettingsNode.getElements()[rowId];
        var name = actualRowNode.getName();
        var description = actualRowNode.getDescription();
        var actualDir = this.actualSettingsNode;

        var tr = document.createElement('tr');
        tr.style.height = this.styleConstants.tableRowHeight;

        var valueChangeListener = this.valueChangeListener;

        if (rowId == 0) {
            this.backButton = document.createElement('td');
            this.backButton.id = this.styleConstants.backButtonId;
            this.backButton.style.width = this.styleConstants.backButtonWidth;
            if (actualDir.getParent() != actualDir) {
                this.backButton.style.backgroundColor = this.styleConstants.backButtonEnabledColor;
                var container = this.container;
                this.backButton.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualDir.getParent());
                };
            } else {
                this.backButton.style.backgroundColor = this.styleConstants.backButtonDisabledColor;
            }
            var img = document.createElement('img');
            img.src = this.styleConstants.backButtonImgSrc;
            img.style.width = this.styleConstants.backButtonImgWidth;
            img.style.height = this.styleConstants.backButtonImgHeight;
            this.backButton.appendChild(img);
            tr.appendChild(this.backButton);
        } else {
            this.backButton.rowSpan = this.backButton.rowSpan + 1;
        }

        var td = document.createElement('td');
        td.style.width = this.styleConstants.imageColumnWidth;
        var img = document.createElement('img');
        img.src = actualRowNode.getImageURL();
        img.style.width = this.styleConstants.imageWidth;
        img.style.height = this.styleConstants.imageHeight;
        td.appendChild(img);
        tr.appendChild(td);

        td = document.createElement('td');
        // Create new table

        var innerTable = document.createElement('table');
        var innerTBody = document.createElement('tbody');
        var innerTR = document.createElement('tr');
        var innerTD = document.createElement('td');
        innerTD.innerHTML = name;
        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);
        innerTR = document.createElement('tr');
        innerTD = document.createElement('td');
        innerTD.innerHTML = description;
        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);

        innerTR = document.createElement('tr');
        innerTD = document.createElement('td');

        var ending = "";
        if (actualRowNode.isDirectory()) {
            ending = ".*";
        }
        //innerTD.innerHTML = "Debug | Topic Name → " + actualRowNode.getFullUid() + ending;

        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);

        innerTable.appendChild(innerTBody);

        td.appendChild(innerTable);

        if (actualRowNode.isDirectory()) {
            if (actualRowNode.getElements().length > 0) {
                td.style.backgroundColor = this.styleConstants.nonEmptyFolderTextColumnBgColor;
                var container = this.container;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualRowNode);
                };

            } else {
                td.style.backgroundColor = this.styleConstants.emptyFolderTextColumnBgColor;
            }
        }
        else {
            td.style.backgroundColor = this.styleConstants.valueTextColumnBgColor;
        }

        tr.appendChild(td);

        td = document.createElement('td');

        var fullUid = actualRowNode.getFullUid();

        if (actualRowNode.isDirectory()) {
            if (actualRowNode.getElements().length > 0) {
                td.style.backgroundColor = this.styleConstants.nonEmptyFolderInputColumnBgColor;
                var container = this.container;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualRowNode);
                };
            } else {
                td.style.backgroundColor = this.styleConstants.emptyFolderInputColumnBgColor;
            }

        }
        else {
            td.style.backgroundColor = this.styleConstants.valueInputColumnBgColor;
            var form = document.createElement('form');
            var input = document.createElement('input');
            input.type = 'number';
            input.style.height = this.styleConstants.valueNumericUpDownHeight;
            input.style.fontSize = this.styleConstants.valueNumericUpDownFontSize;
            input.style.width = this.styleConstants.valueNumericUpDownWidth;
            input.value = '' + actualRowNode.getActualValue();
            input.onchange = function() {
                actualRowNode.setActualValue(this.value);
                //changeListener.valueChanged(fullUid, this.value, actualRowNode.getValue());
            };
            form.appendChild(input);
            td.appendChild(form);
        }
        td.style.width = this.styleConstants.valueInputColumnWidth;
        tr.appendChild(td);

        this.tableBody.appendChild(tr);
    }

    /**
     * Creates a whole HTML table with the specified node as the parent (all the children will be displayed).
     * @param actualSettingsNode The parent node, all of its children should be displayed in the table.
     */
    createTable(actualSettingsNode : SettingsNode) {
        while (true) {
            var oldTable = document.getElementById('settings_table');
            if (oldTable == undefined || oldTable == null) {
                break;
            }
            this.container.removeChild(oldTable);
        }
        this.table = document.createElement('table');
        this.table.id = 'settings_table';
        this.table.style.width = this.styleConstants.tableWidth;
        this.table.style.height = this.styleConstants.tableHeight;
        this.table.setAttribute('border', '1');

        this.tableBody = document.createElement('tbody');

        this.actualSettingsNode = actualSettingsNode;
        var elementList = this.actualSettingsNode.getElements();
        var listLength = elementList.length;

        for (var i = 0; i < listLength; i++) {
            this.appendRow();
        }

        // Add ok button //
        var okbutton : HTMLButtonElement;
        okbutton = document.createElement('button');
        okbutton.style.position = this.styleConstants.OKButtonPosition;
        okbutton.style.width = this.styleConstants.OKButtonWidth;
        okbutton.style.marginLeft = this.styleConstants.OKButtonMarginLeft;
        okbutton.style.height = this.styleConstants.OKButtonHeight;
        okbutton.style.fontSize = this.styleConstants.OKButtonFontSize;
        okbutton.appendChild(document.createTextNode('Save configuration!'));

        var root = actualSettingsNode;
        while (true) {
            if (root == root.getParent()) {
                break;
            }
            root = root.getParent();
        }

        var valueChangeListener = this.valueChangeListener;

        var container = this.container;
        okbutton.onclick = function () {
            var postal_message = valueChangeListener.postal_getSettingsWriteMessages();
            root.actualValueStored();
            var pch = postal.channel(TSConstants.st2dbChannel);
            for (var i = 0; i < postal_message.length; i++) {
                pch.publish(TSConstants.st2dbTopic, postal_message[i]);
            }
            TextDebugger.refreshData(null, container);
        };

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 4;
        td.height = this.styleConstants.OKButtonRowHeight;
        td.appendChild(okbutton);
        tr.appendChild(td);
        td.style.alignItems = this.styleConstants.OKButtonCellAlign;
        td.style.backgroundColor = this.styleConstants.OKButtonCellBgColor;
        this.tableBody.appendChild(tr);


        this.table.appendChild(this.tableBody);
        this.table.style.paddingBottom = "0px";
        this.container.appendChild(this.table);
    }

    /**
     * Deletes the whole table from the GUI.
     */
    removeTable() {
        this.container.removeChild(this.table);
    }
}

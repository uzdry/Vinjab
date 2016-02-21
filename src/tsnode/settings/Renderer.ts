/**
 * @author David G.
 */

/// <reference path="./TSettings.ts"/>

class StyleConstants {
    // Table
    public tableRowHeight : string = "100px";
    public tableWidth : string = "100%";
    public tableHeight : string = "auto";

    // Back button
    public backButtonId : string = "settings_backButton";
    public backButtonWidth : string = "50px";
    public backButtonEnabledColor : string = "White";
    public backButtonDisabledColor : string = "White";
    public backButtonImgSrc : string = "../../img/settings/leftarrow.png";
    public backButtonImgHeight : string = "50px";
    public backButtonImgWidth : string = "50px";

    // Image column
    public imageColumnWidth : string = "50px";
    public imageWidth : string = "100px";
    public imageHeight : string = "100px";

    // Folders
    public nonEmptyFolderTextColumnBgColor : string = "White";
    public emptyFolderTextColumnBgColor : string = "White";

    public nonEmptyFolderInputColumnBgColor : string = "White";
    public emptyFolderInputColumnBgColor : string = "White";

    // Values
    public valueTextColumnBgColor : string = "White";
    public valueInputColumnBgColor : string = "White";
    public valueInputColumnWidth : string = "320px";

    public valueNumericUpDownHeight : string = "100%";
    public valueNumericUpDownFontSize : string = "50px";
    public valueNumericUpDownWidth : string = "100%";

    // OK button
    public OKButtonPosition : string = "relative";
    public OKButtonWidth : string = "100%";
    public OKButtonMarginLeft = '0px';
    public OKButtonHeight = '100%';
    public OKButtonFontSize = '18px';
    public OKButtonRowHeight = '60px';
    public OKButtonCellAlign = 'center';
    public OKButtonCellBgColor = 'White';

    public hoverONColor = "LightGray";
    public hoverOFFColor = "White";
}

/**
 * Creates the main HTML table for the settings GUI.
 */
class TableFactory {

    private tableAlreadyCreated = false;
    private table : HTMLTableElement;
    private tableBody : HTMLElement;

    private container : Node;
    private actualSettingsNode : SettingsNode;

    private backButton : HTMLTableCellElement;
    private styleConstants : StyleConstants = new StyleConstants;

    private clientSideBuffer : TSettings.ClientSideBuffer;
    /**
     * Creates a new TableFactory.
     * @param container The HTML DOM object that should contain the table (not yet implemented).
     * @param valueChangeListener The object that logs the changes to be written back to the database (to be removed soon...).
     */
    constructor (container : Node, clientSideBuffer : TSettings.ClientSideBuffer) {
        this.container = container;
        this.clientSideBuffer = clientSideBuffer;
    }

    setHoverColors(td : HTMLTableCellElement) : void {
        var styleConstants = this.styleConstants;
        td.style.cursor = "pointer";
        if (td.id != "settings_backButton") {
            td.onmouseover = function () {
                var tr = td.parentElement;

                for (var i = 0; i < tr.children.length; i++) {
                    if (tr.children[i].id != "settings_backButton") {
                        (<HTMLTableCellElement>tr.children[i]).style.backgroundColor = styleConstants.hoverONColor;
                    }
                }
            };
            td.onmouseleave = function () {
                var tr = td.parentElement;
                for (var i = 0; i < tr.children.length; i++) {
                    if (tr.children[i].id != "settings_backButton") {
                        (<HTMLTableCellElement>tr.children[i]).style.backgroundColor = styleConstants.hoverOFFColor;
                    }
                }
            };
        }
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

        if (rowId == 0) {
            this.backButton = null;
            if (actualDir.getParent() != actualDir) {
                this.backButton = document.createElement('td');
                this.backButton.style.cursor = "pointer";
                this.backButton.id = "settings_backButton";
                var styleConstants = this.styleConstants;
                var backButton = this.backButton;
                this.backButton.onmouseover = function() {
                    backButton.style.backgroundColor = styleConstants.hoverONColor;
                };

                this.backButton.onmouseleave = function() {
                    backButton.style.backgroundColor = styleConstants.hoverOFFColor;
                };
                this.backButton.id = this.styleConstants.backButtonId;
                this.backButton.style.width = this.styleConstants.backButtonWidth;
                this.backButton.style.backgroundColor = this.styleConstants.backButtonEnabledColor;
                var container = this.container;

                var tf = this;
                this.backButton.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, tf.clientSideBuffer);
                    t.createTable(actualDir.getParent());
                };
                var img = document.createElement('img');
                img.src = this.styleConstants.backButtonImgSrc;
                img.style.width = this.styleConstants.backButtonImgWidth;
                img.style.height = this.styleConstants.backButtonImgHeight;
                this.backButton.appendChild(img);
                tr.appendChild(this.backButton);
            }
        } else {
            if (this.backButton != null) {
                this.backButton.rowSpan = this.backButton.rowSpan + 1;
            }
        }

        var td = document.createElement('td');

        td.style.width = this.styleConstants.imageColumnWidth;
        var img = document.createElement('img');
        img.src = actualRowNode.getImageURL();
        img.style.width = this.styleConstants.imageWidth;
        img.style.height = this.styleConstants.imageHeight;
        td.appendChild(img);

        if (actualRowNode.isDirectory() && actualRowNode.getElements().length > 0) {
            var tf = this;
            td.onclick = function () {
                var table = document.getElementById('settings_table');
                container.removeChild(table);
                var t = new TableFactory(container, tf.clientSideBuffer);
                t.createTable(actualRowNode);
            };
        }

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
                var tf = this;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, tf.clientSideBuffer);
                    t.createTable(actualRowNode);
                };

            } else {
                td.style.backgroundColor = this.styleConstants.emptyFolderTextColumnBgColor;
            }
            td.colSpan = 3;
        }
        else {
            td.style.backgroundColor = this.styleConstants.valueTextColumnBgColor;
        }

        tr.appendChild(td);

        td = document.createElement('td');

        var fullUid = actualRowNode.getFullUid();

        if (actualRowNode.isDirectory()) {
            /*if (actualRowNode.getElements().length > 0) {
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
            }*/
        }
        else {
            td.style.backgroundColor = this.styleConstants.valueInputColumnBgColor;
            var form = document.createElement('form');
            var input = document.createElement('input');
            input.type = 'number';
            input.style.height = this.styleConstants.valueNumericUpDownHeight;
            input.style.fontSize = this.styleConstants.valueNumericUpDownFontSize;
            input.style.width = this.styleConstants.valueNumericUpDownWidth;
            input.value = '' + actualRowNode.getValue();
            (<SettingsParameter>actualRowNode).setView(input);
            input.onchange = function() {
                actualRowNode.setValue(this.value);
                //changeListener.valueChanged(fullUid, this.value, actualRowNode.getValue());
            };
            form.appendChild(input);
            td.appendChild(form);
            td.style.width = this.styleConstants.valueInputColumnWidth;
            tr.appendChild(td);
        }

        for (var i = 0; i < tr.children.length; i++) {
            if (tr.children[i].id != "settings_backButton") {
                this.setHoverColors(<HTMLTableCellElement>tr.children[i]);
            }
        }

        this.tableBody.appendChild(tr);
    }

    /**
     * Creates a whole HTML table with the specified node as the parent (all the children will be displayed).
     * @param actualSettingsNode The parent node, all of its children should be displayed in the table.
     */
    createTable(actualSettingsNode : SettingsNode) {
        while (true) {
            var oldTable = document.getElementById('settings_table');
            try {
                this.container.removeChild(oldTable);
            } catch (e) {
                break;
            }
        }
        this.tableAlreadyCreated = true;
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
        okbutton.style.cursor = "pointer";

        var root = actualSettingsNode;
        while (true) {
            if (root == root.getParent()) {
                break;
            }
            root = root.getParent();
        }


        var container = this.container;
        var csb = this.clientSideBuffer;
        okbutton.onclick = function () {
            csb.onSend();
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


        // Add load button //
        var loadbutton : HTMLButtonElement;
        loadbutton = document.createElement('button');
        loadbutton.style.position = this.styleConstants.OKButtonPosition;
        loadbutton.style.width = this.styleConstants.OKButtonWidth;
        loadbutton.style.marginLeft = this.styleConstants.OKButtonMarginLeft;
        loadbutton.style.height = this.styleConstants.OKButtonHeight;
        loadbutton.style.fontSize = this.styleConstants.OKButtonFontSize;
        loadbutton.appendChild(document.createTextNode('Load configuration!'));
        loadbutton.style.cursor = "pointer";

        var root = actualSettingsNode;
        while (true) {
            if (root == root.getParent()) {
                break;
            }
            root = root.getParent();
        }


        var container = this.container;
        var csb = this.clientSideBuffer;
        loadbutton.onclick = function () {
            csb.forcePoll();
        };

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 4;
        td.height = this.styleConstants.OKButtonRowHeight;
        td.appendChild(loadbutton);
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

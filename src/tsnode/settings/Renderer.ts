/**
 * Created by Ray on 14.02.2016.
 */

/// <reference path="./Auxiliary.ts"/>
/// <reference path="./TextDebugger.ts"/>
/// <reference path="./TSettings.ts"/>
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
        tr.style.height = "100px";

        var valueChangeListener = this.valueChangeListener;

        if (rowId == 0) {
            this.backButton = document.createElement('td');
            this.backButton.style.width = "50px";
            if (actualDir.getParent() != actualDir) {
                this.backButton.style.backgroundColor = "GreenYellow";
                var container = this.container;
                this.backButton.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualDir.getParent());
                };
            } else {
                this.backButton.style.backgroundColor = "Gray";
            }
            var img = document.createElement('img');
            img.src = "../../img/settings/leftarrow.png";
            img.style.width = "50px";
            img.style.height = "50px";
            this.backButton.appendChild(img);
            tr.appendChild(this.backButton);
        } else {
            this.backButton.rowSpan = this.backButton.rowSpan + 1;
        }

        var td = document.createElement('td');
        td.style.width = "100px";
        var img = document.createElement('img');
        img.src = actualRowNode.getImageURL();
        img.style.width = "100%";
        img.style.height = "100%";
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
        innerTD.innerHTML = actualRowNode.getFullUid() + '   ← [Debug Only] Resource unique identifier string';
        innerTR.appendChild(innerTD);
        innerTBody.appendChild(innerTR);

        innerTable.appendChild(innerTBody);

        td.appendChild(innerTable);

        if (actualRowNode.isDirectory()) {
            if (actualRowNode.getElements().length > 0) {
                td.style.backgroundColor = "LightSkyBlue";
                var container = this.container;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualRowNode);
                };

            } else {
                td.style.backgroundColor = "PaleVioletRed";
            }
        }
        else {
            td.style.backgroundColor = "LightGray";
        }

        tr.appendChild(td);

        td = document.createElement('td');

        var fullUid = actualRowNode.getFullUid();

        if (actualRowNode.isDirectory()) {
            if (actualRowNode.getElements().length > 0) {
                td.style.backgroundColor = "DeepSkyBlue";
                var container = this.container;
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    container.removeChild(table);
                    var t = new TableFactory(container, valueChangeListener);
                    t.createTable(actualRowNode);
                };
            } else {
                td.style.backgroundColor = "MediumVioletRed";
            }

        }
        else {
            td.style.backgroundColor = "Gray";
            var form = document.createElement('form');
            var input = document.createElement('input');
            input.type = 'number';
            input.style.height = "80px";
            input.style.fontSize = "50px";
            input.style.width = "300px";
            input.value = '' + actualRowNode.getActualValue();
            input.onchange = function() {
                actualRowNode.setActualValue(this.value);
                //changeListener.valueChanged(fullUid, this.value, actualRowNode.getValue());
            };
            form.appendChild(input);
            td.appendChild(form);
        }
        td.style.width = "320px";
        tr.appendChild(td);

        this.tableBody.appendChild(tr);
    }

    /**
     * Creates a whole HTML table with the specified node as the parent (all the children will be displayed).
     * @param actualSettingsNode The parent node, all of its children should be displayed in the table.
     */
    createTable(actualSettingsNode : SettingsNode) {
        this.table = document.createElement('table');
        this.table.id = 'settings_table';
        this.table.style.width = '100%';
        this.table.style.height = '100%';
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
        okbutton.style.position = 'relative';
        okbutton.style.width = '60%';
        okbutton.style.marginLeft = '20%';
        okbutton.style.height = '60%';
        okbutton.style.fontSize = '18px';
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
            var message = valueChangeListener.getSettingsWriteMessage();
            root.actualValueStored();
            Broker.get().handleMessage(message);
            TextDebugger.refreshData(null, container);
        };

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 4;
        td.height = '60px';
        td.appendChild(okbutton);
        tr.appendChild(td);
        td.style.alignItems = 'center';
        td.style.backgroundColor = 'Orange';
        this.tableBody.appendChild(tr);


        this.table.appendChild(this.tableBody);
        this.table.style.height = "auto";
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

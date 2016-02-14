/**
 * Created by Ray on 14.02.2016.
 */

/// <reference path="./Auxiliary.ts"/>

/**
 * The class that provides a debugging console output in the browser.
 */
class TextDebugger {

    /**
     * Refreshes the whole output array consisting of two columns.
     * @param fullUids The list of the Uids of the parameters.
     * @param values The actual values of the parameters.
     */
    public static refreshData(settingsNodes : SettingsNode[], container : Node) {

        var tableDebug = document.getElementById("table_debug");

        if (tableDebug == null) {
            tableDebug = document.createElement('table');
            tableDebug.style.position = 'absolute';
            tableDebug.style.height = 'auto';
            tableDebug.style.width = '450px';
            tableDebug.style.marginLeft = '100px';
            tableDebug.style.marginTop = '450px';
            tableDebug.id = 'table_debug';
            tableDebug.style.border = '1px solid black';
            tableDebug.style.borderCollapse = 'collapse';

            container.appendChild(tableDebug);
        }
        var tdBody = document.createElement("tbody");

        while (tableDebug.children.length > 0) {
            tableDebug.removeChild(tableDebug.children[0]);
        }
        var tr;
        var td;

        tr = document.createElement('tr');
        tr.height = "75px";
        td = document.createElement('td');
        td.colSpan = 3;
        td.innerHTML = "Values to be written to the database:";
        td.bgColor = 'Red';
        tr.appendChild(td);
        tr.style.border = '1px solid black';
        tdBody.appendChild(tr);

        tr = document.createElement('tr');
        tr.height = "75px";
        td = document.createElement('td');
        td.innerHTML = "Full UUID";
        td.width = "150px";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = "Topic ID";
        td.width = "150px";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = "Value to be stored";
        td.width = "150px";
        tr.appendChild(td);
        tr.style.border = '1px solid black';
        tdBody.appendChild(tr);

        if (settingsNodes == null || settingsNodes.length == 0) {
            tr = document.createElement('tr');
            tr.height = "75px";
            td = document.createElement('td');
            td.innerHTML = "empty";
            td.width = "150px";
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = "empty";
            td.width = "150px";
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = "empty";
            td.width = "150px";
            tr.appendChild(td);
            tr.style.border = '1px solid black';
            tdBody.appendChild(tr);
        } else {
            for (var i = 0; i < settingsNodes.length; i++) {
                tr = document.createElement('tr');
                tr.height = "75px";
                td = document.createElement('td');
                td.innerHTML = settingsNodes[i].getFullUid();
                td.width = "150px";
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerHTML = '' + settingsNodes[i].getTopic().getName();
                td.width = "150px";
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerHTML = '' + settingsNodes[i].getActualValue();
                td.width = "150px";
                tr.appendChild(td);
                tr.style.border = '1px solid black';
                tdBody.appendChild(tr);
            }
        }
        tableDebug.appendChild(tdBody);
    }
}

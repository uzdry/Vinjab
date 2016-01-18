var TableFactory = (function () {
    function TableFactory(container, valueChangeListener) {
        this.container = container;
        this.valueChangeListener = valueChangeListener;
    }
    TableFactory.prototype.addRow = function (name, description) {
        var changeListener = this.valueChangeListener;
        var rowId = this.tableBody.children.length;
        var actualRowNode = this.actualSettingsNode.getElements()[rowId];
        var actualDir = this.actualSettingsNode;
        var tr = document.createElement('tr');
        tr.style.height = "100px";
        if (rowId == 0) {
            this.backButton = document.createElement('td');
            this.backButton.style.width = "50px";
            if (actualDir.getParent() != actualDir) {
                this.backButton.style.backgroundColor = "GreenYellow";
                this.backButton.onclick = function () {
                    var table = document.getElementById('settings_table');
                    document.body.removeChild(table);
                    var t = new TableFactory(document.body, changeListener);
                    t.createTable(actualDir.getParent());
                };
            }
            else {
                this.backButton.style.backgroundColor = "Gray";
            }
            tr.appendChild(this.backButton);
        }
        else {
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
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    document.body.removeChild(table);
                    var t = new TableFactory(document.body, changeListener);
                    t.createTable(actualRowNode);
                };
            }
            else {
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
                td.onclick = function () {
                    var table = document.getElementById('settings_table');
                    document.body.removeChild(table);
                    var t = new TableFactory(document.body, changeListener);
                    t.createTable(actualRowNode);
                };
            }
            else {
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
            input.onchange = function () {
                actualRowNode.setActualValue(this.value);
                changeListener.valueChanged(fullUid, this.value, actualRowNode.getValue());
            };
            form.appendChild(input);
            td.appendChild(form);
        }
        td.style.width = "320px";
        tr.appendChild(td);
        this.tableBody.appendChild(tr);
    };
    TableFactory.prototype.createTable = function (actualSettingsNode) {
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
            var actualElement = this.actualSettingsNode.getElements()[i];
            this.addRow(actualElement.getName(), actualElement.getDescription());
        }
        this.table.appendChild(this.tableBody);
        this.container.appendChild(this.table);
    };
    TableFactory.prototype.removeTable = function () {
        this.container.removeChild(this.table);
    };
    return TableFactory;
})();
var SettingsDirectory = (function () {
    function SettingsDirectory(ruid, name, description, elements, imageURL) {
        this.ruid = ruid;
        this.name = name;
        this.description = description;
        this.elements = elements;
        this.parent = this;
        for (var i = 0; i < elements.length; i++) {
            elements[i].setParent(this);
        }
        this.imageURL = imageURL;
    }
    SettingsDirectory.prototype.setActualValue = function (value) {
    };
    SettingsDirectory.prototype.getActualValue = function () {
        return 0;
    };
    SettingsDirectory.prototype.appendChild = function (element) {
        if (this.getElementByRuid(element.getRuid()) == null) {
            this.elements.push(element);
            element.setParent(this);
        }
    };
    SettingsDirectory.prototype.getElementByRuid = function (ruid) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].getRuid() == ruid) {
                return this.elements[i];
            }
        }
        return null;
    };
    SettingsDirectory.prototype.getValue = function () {
        return 0;
    };
    SettingsDirectory.prototype.getImageURL = function () {
        return this.imageURL;
    };
    SettingsDirectory.prototype.getFullUid = function () {
        if (this.parent == this) {
            return this.ruid;
        }
        return this.parent.getFullUid() + '/' + this.ruid;
    };
    SettingsDirectory.prototype.getRuid = function () {
        return this.ruid;
    };
    SettingsDirectory.prototype.getElements = function () {
        return this.elements;
    };
    SettingsDirectory.prototype.getName = function () {
        return this.name;
    };
    SettingsDirectory.prototype.getDescription = function () {
        return this.description;
    };
    SettingsDirectory.prototype.isDirectory = function () {
        return true;
    };
    SettingsDirectory.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    SettingsDirectory.prototype.getParent = function () {
        return this.parent;
    };
    return SettingsDirectory;
})();
var SettingsParameter = (function () {
    function SettingsParameter(ruid, name, description, imageURL, value) {
        this.name = name;
        this.description = description;
        this.ruid = ruid;
        this.imageURL = imageURL;
        this.value = value;
        this.actualValue = value;
    }
    SettingsParameter.prototype.setActualValue = function (value) {
        this.actualValue = value;
    };
    SettingsParameter.prototype.getActualValue = function () {
        return this.actualValue;
    };
    SettingsParameter.prototype.getValue = function () {
        return this.value;
    };
    SettingsParameter.prototype.getImageURL = function () {
        return this.imageURL;
    };
    SettingsParameter.prototype.getFullUid = function () {
        return this.parent.getFullUid() + '/' + this.ruid;
    };
    SettingsParameter.prototype.getRuid = function () {
        return this.ruid;
    };
    SettingsParameter.prototype.getElements = function () {
        return null;
    };
    SettingsParameter.prototype.getName = function () {
        return this.name;
    };
    SettingsParameter.prototype.getDescription = function () {
        return this.description;
    };
    SettingsParameter.prototype.isDirectory = function () {
        return false;
    };
    SettingsParameter.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    SettingsParameter.prototype.getParent = function () {
        return this.parent;
    };
    return SettingsParameter;
})();
var ValueChangeListener = (function () {
    function ValueChangeListener(textDebugger) {
        this.textDebugger = textDebugger;
        this.list_uid = [];
        this.list_value = [];
    }
    ValueChangeListener.prototype.valueChanged = function (fullUid, value, originalValue) {
        var index = this.getIndexOf(fullUid);
        if (index == -1) {
            if (value != originalValue) {
                this.list_uid.push(fullUid);
                this.list_value.push(value);
            }
        }
        else {
            if (value != originalValue) {
                this.list_value[index] = value;
            }
            else {
                this.list_uid.splice(index, 1);
                this.list_value.splice(index, 1);
            }
        }
        this.textDebugger.refreshData(this.list_uid, this.list_value);
    };
    ValueChangeListener.prototype.getIndexOf = function (fullUid) {
        for (var i = 0; i < this.list_uid.length; i++) {
            if (this.list_uid[i] == fullUid) {
                return i;
            }
        }
        return -1;
    };
    return ValueChangeListener;
})();
var SCommunicator = (function () {
    function SCommunicator() {
    }
    /*public sendData(fullUids : string[], values : number[]) {
        // Some code ...
        // Sends data to the server ...
    }*/
    SCommunicator.getElementIndexByRuid = function (directoryBuffer, ruid) {
        for (var i = 0; i < directoryBuffer.length; i++) {
            if (directoryBuffer[i].getRuid() == ruid) {
                return i;
            }
        }
        return -1;
    };
    SCommunicator.receiveData = function (directories) {
        // Some code ...
        var directoryImgBaseDir = '../../img/settings';
        var directoryBuffer;
        directoryBuffer = [];
        var i;
        var ruidList;
        var actualDir;
        for (i = 0; i < directories.length; i++) {
            var dirProperties = directories[i].split('|');
            ruidList = dirProperties[0].split('/');
            var actualRuid = ruidList[ruidList.length - 1];
            actualDir = new SettingsDirectory(actualRuid, dirProperties[1], dirProperties[2], [], directoryImgBaseDir + '/' + dirProperties[3]);
            directoryBuffer.push(actualDir);
        }
        // Until now we have all the directories. Now it's time to build up the relations.
        for (i = 0; i < directories.length; i++) {
            ruidList = directories[i].split('|')[0].split('/');
            var parentDir = null;
            for (var j = 0; j < ruidList.length; j++) {
                var actualDirIndex = SCommunicator.getElementIndexByRuid(directoryBuffer, ruidList[j]);
                if (actualDirIndex == -1) {
                    // Error, should not happen, inconsistent data. A nonexistent folder has been referenced.
                    actualDir = new SettingsDirectory(ruidList[j], 'Database ERROR', 'Database ERROR', [], directoryImgBaseDir + '/directory.png');
                    directoryBuffer.push(actualDir);
                }
                else {
                    actualDir = directoryBuffer[actualDirIndex];
                }
                if (parentDir != null) {
                    parentDir.appendChild(actualDir);
                }
                parentDir = actualDir;
            }
        }
        var index = SCommunicator.getElementIndexByRuid(directoryBuffer, 'root');
        if (index == -1) {
            // error
            return new SettingsDirectory('root', 'Root', 'RootDescription', [], directoryImgBaseDir + '/directory.png');
        }
        return directoryBuffer[index];
    };
    SCommunicator.testDataReceiver = function (directories) {
        var root = SCommunicator.receiveData(directories); //, parameters, parameterValues);
        var textDebugger = new TextDebugger();
        var valueChangeListener = new ValueChangeListener(textDebugger);
        var table = new TableFactory(document.body, valueChangeListener);
        table.createTable(root);
    };
    return SCommunicator;
})();
var TextDebugger = (function () {
    function TextDebugger() {
    }
    TextDebugger.refreshData = function (fullUids, values) {
        var tableDebug = document.getElementById("table_debug");
        var tdBody = document.createElement("tbody");
        while (tableDebug.children.length > 0) {
            tableDebug.removeChild(tableDebug.children[0]);
        }
        var tr;
        var td;
        if (fullUids.length == 0) {
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
            tdBody.appendChild(tr);
        }
        for (var i = 0; i < fullUids.length; i++) {
            tr = document.createElement('tr');
            tr.height = "75px";
            td = document.createElement('td');
            td.innerHTML = fullUids[i];
            td.width = "150px";
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = '' + values[i];
            td.width = "150px";
            tr.appendChild(td);
            tdBody.appendChild(tr);
        }
        tableDebug.appendChild(tdBody);
    };
    return TextDebugger;
})();
var buttonnode = document.createElement('input');
buttonnode.setAttribute('type', 'button');
buttonnode.setAttribute('name', 'bt_communicator_test');
buttonnode.setAttribute('value', 'Communicator Test');
document.body.appendChild(buttonnode);
buttonnode.onclick = function () {
    var oldtable = document.getElementById('settings_table');
    if (oldtable != null) {
        document.body.removeChild(oldtable);
    }
    var communicator = new SCommunicator();
    var rawString = "root|Name:Root|DescRoot|directory.png\\root/dir1|Directory1|Desc1|directory.png\\root/dir2|Directory2|Desc2|directory.png\\root/dir1/dir3|Directory3|Desc3|directory.png";
    communicator.testDataReceiver(rawString.split('\\'), [], []);
};
buttonnode = document.createElement('input');
buttonnode.setAttribute('type', 'button');
buttonnode.setAttribute('name', 'bt_parameter_editor_test');
buttonnode.setAttribute('value', 'Parameter Editor Test');
document.body.appendChild(buttonnode);
buttonnode.onclick = function () {
    var oldtable = document.getElementById('settings_table');
    if (oldtable != null) {
        document.body.removeChild(oldtable);
    }
    var textDebugger = new TextDebugger();
    var valueChangeListener = new ValueChangeListener(textDebugger);
    var table = new TableFactory(document.body, valueChangeListener);
    var par1 = new SettingsParameter('p1', 'My name is Parameter1', 'I am the description of Parameter1', 'res/img/p1.png', 15);
    var par2 = new SettingsParameter('p2', 'My name is Parameter2', 'I am the description of Parameter2', 'res/img/p2.png', 12);
    var parList = [par1, par2];
    var dir1 = new SettingsDirectory('d1', 'My name is Directory1', 'I am the description of Directory1', parList, 'res/img/directory.png');
    var par3 = new SettingsParameter('p3', 'My name is Parameter3', 'I am the description of Parameter3', 'res/img/p3.png', 7);
    var dir2 = new SettingsDirectory('root', 'MyNameIsROOT (I am the ROOT Directory :))', 'IAmTheDescriptionOfROOT', [dir1, par3], 'res/img/directory.png');
    table.createTable(dir2);
};

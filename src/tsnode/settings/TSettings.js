/**
 * Creates the main HTML table for the settings GUI.
 */
var TableFactory = (function () {
    /**
     * Creates a new TableFactory.
     * @param container The HTML DOM object that should contain the table (not yet implemented).
     * @param valueChangeListener The object that logs the changes to be written back to the database (to be removed soon...).
     */
    function TableFactory(container, valueChangeListener) {
        this.container = container;
        this.valueChangeListener = valueChangeListener;
    }
    /**
     * Adds a new row to the table that contains a folder or a parameter.
     * The information source is the actualSettingsNode and the amount of the rows already present.
     * Therefore there are no parameters needed.
     */
    TableFactory.prototype.appendRow = function () {
        var changeListener = this.valueChangeListener;
        var rowId = this.tableBody.children.length;
        var actualRowNode = this.actualSettingsNode.getElements()[rowId];
        var name = actualRowNode.getName();
        var description = actualRowNode.getDescription();
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
    /**
     * Creates a whole HTML table with the specified node as the parent (all the children will be displayed).
     * @param actualSettingsNode The parent node, all of its children should be displayed in the table.
     */
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
            this.appendRow();
        }
        this.table.appendChild(this.tableBody);
        this.container.appendChild(this.table);
    };
    /**
     * Deletes the whole table from the GUI.
     */
    TableFactory.prototype.removeTable = function () {
        this.container.removeChild(this.table);
    };
    return TableFactory;
})();
/**
 * A settings directory that can contain parameters or other directories.
 */
var SettingsDirectory = (function () {
    /**
     * Creates a settings directory.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param elements The children of this directory.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     */
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
    /**
     * Sets the value of the directory. To be ignored.
     * @param value The new value of the directory.
     */
    SettingsDirectory.prototype.setActualValue = function (value) {
    };
    /**
     * Gets the actual value of the directory. To be ignored.
     * @returns {number} The actual value of the directory.
     */
    SettingsDirectory.prototype.getActualValue = function () {
        return 0;
    };
    /**
     * Appends a new child element to this directory.
     * @param element The child node to be appended to this directory.
     */
    SettingsDirectory.prototype.appendChild = function (element) {
        if (this.getElementByRuid(element.getRuid()) == null) {
            this.elements.push(element);
            element.setParent(this);
        }
    };
    /**
     * Gets a child of this directory based on its ruid. No grandchildren will be checked.
     * @param ruid The ruid of the child of this directory you are looking for.
     * @returns {any} The child of this directory with the specified ruid, null if not found.
     */
    SettingsDirectory.prototype.getElementByRuid = function (ruid) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].getRuid() == ruid) {
                return this.elements[i];
            }
        }
        return null;
    };
    /**
     * Gets the original value of this directory. To be ignored.
     * @returns {number} The original value of this directory.
     */
    SettingsDirectory.prototype.getValue = function () {
        return 0;
    };
    /**
     * Gets the URL of the image that is to be displayed as this directory in the GUI.
     * @returns {string} The URL of the image of this directory.
     */
    SettingsDirectory.prototype.getImageURL = function () {
        return this.imageURL;
    };
    /**
     * Gets the full unique ID of this directory.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this directory.
     */
    SettingsDirectory.prototype.getFullUid = function () {
        if (this.parent == this) {
            return this.ruid;
        }
        return this.parent.getFullUid() + '/' + this.ruid;
    };
    /**
     * Gets the relatively unique ID of this directory.
     * @returns {string} The ruid of this directory.
     */
    SettingsDirectory.prototype.getRuid = function () {
        return this.ruid;
    };
    /**
     * Gets all the children of this directory.
     * @returns {SettingsNode[]} The children of this directory.
     */
    SettingsDirectory.prototype.getElements = function () {
        return this.elements;
    };
    /**
     * Gets the name of this directory that is to be displayed in the GUI.
     * @returns {string} The name of this directory.
     */
    SettingsDirectory.prototype.getName = function () {
        return this.name;
    };
    /**
     * Gets the description of this directory that is to be displayed in the GUI.
     * @returns {string} The description of this directory.
     */
    SettingsDirectory.prototype.getDescription = function () {
        return this.description;
    };
    /**
     * Checks whether this node is a directory.
     * @returns {boolean} True.
     */
    SettingsDirectory.prototype.isDirectory = function () {
        return true;
    };
    /**
     * Sets the parent directory of this directory.
     * @param parent The new parent directory of this.
     */
    SettingsDirectory.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    SettingsDirectory.prototype.getParent = function () {
        return this.parent;
    };
    return SettingsDirectory;
})();
/**
 * A settings parameter that can have multiple numeric values.
 */
var SettingsParameter = (function () {
    /**
     * Creates a settings parameter.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     * @param value The original value of this settings parameter.
     */
    function SettingsParameter(ruid, name, description, imageURL, value) {
        this.name = name;
        this.description = description;
        this.ruid = ruid;
        this.imageURL = imageURL;
        this.value = value;
        this.actualValue = value;
    }
    /**
     * Settings the actual value of this parameter (that is set in the GUI).
     * Does not change the original value of this parameter that is in the DB.
     * @param value The new actual value of this parameter.
     */
    SettingsParameter.prototype.setActualValue = function (value) {
        this.actualValue = value;
    };
    /**
     * Gets the actual value of this parameter.
     * @returns {number} The actual value of this parameter.
     */
    SettingsParameter.prototype.getActualValue = function () {
        return this.actualValue;
    };
    /**
     * Gets the value of this parameter that is currently stored in the DB.
     * @returns {number} The value of this parameter that is currently stored in the DB.
     */
    SettingsParameter.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Gets the URL of the image of this parameter that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this parameter.
     */
    SettingsParameter.prototype.getImageURL = function () {
        return this.imageURL;
    };
    /**
     * Gets the full unique ID of this parameter.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this parameter.
     */
    SettingsParameter.prototype.getFullUid = function () {
        return this.parent.getFullUid() + '/' + this.ruid;
    };
    /**
     * Gets the relatively unique ID of this parameter.
     * @returns {string} The ruid of this parameter.
     */
    SettingsParameter.prototype.getRuid = function () {
        return this.ruid;
    };
    /**
     * Gets the elements of this node. Paramaters do not contain elements, so it returns null.
     * @returns {null} Null.
     */
    SettingsParameter.prototype.getElements = function () {
        return null;
    };
    /**
     * Gets the name of this parameter that is to be displayed in the GUI.
     * @returns {string} The name of this parameter.
     */
    SettingsParameter.prototype.getName = function () {
        return this.name;
    };
    /**
     * Gets the description of this parameter that is to be displayed in the GUI.
     * @returns {string} The description of this parameter.
     */
    SettingsParameter.prototype.getDescription = function () {
        return this.description;
    };
    /**
     * Checks whether this node is a directory.
     * @returns {boolean} False.
     */
    SettingsParameter.prototype.isDirectory = function () {
        return false;
    };
    /**
     * Sets the parent directory of this parameter.
     * @param parent The new parent directory of this.
     */
    SettingsParameter.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    SettingsParameter.prototype.getParent = function () {
        return this.parent;
    };
    return SettingsParameter;
})();
/**
 * The class that logs all the changes to all the values that can be written back to the database.
 * Deprecated, will be removed soon.
 */
var ValueChangeListener = (function () {
    /**
     * Creates the listener.
     * @param textDebugger The debugger of the GUI that provides display function for this class.
     */
    function ValueChangeListener(textDebugger) {
        this.textDebugger = textDebugger;
        this.list_uid = [];
        this.list_value = [];
    }
    /**
     * The method to be called when a value of a parameter changes.
     * @param fullUid The full Uid of the parameter.
     * @param value The new value of the parameter.
     * @param originalValue The value of the parameter that is stored in the database.
     */
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
        TextDebugger.refreshData(this.list_uid, this.list_value);
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
/**
 * A class that was designed to support serialisation of the directory structure.
 * Deprecated, to be removed soon.
 */
var SCommunicator = (function () {
    function SCommunicator() {
    }
    /*public sendData(fullUids : string[], values : number[]) {
     // Some code ...
     // Sends data to the server ...
     }*/
    /**
     * Searches for an element in the buffer with a specified ruid.
     * @param directoryBuffer The buffer that contains all the elements in which you are looking for a specified one.
     * @param ruid The ruid of the specific element you are looking for.
     * @returns {number} The index of the element in the array. -1 if not found.
     */
    SCommunicator.getElementIndexByRuid = function (directoryBuffer, ruid) {
        for (var i = 0; i < directoryBuffer.length; i++) {
            if (directoryBuffer[i].getRuid() == ruid) {
                return i;
            }
        }
        return -1;
    };
    SCommunicator.startXML = function (xmlURL) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                myFunction(xhttp);
            }
        };
        xhttp.open("GET", xmlURL, true);
        xhttp.send();
        function myFunction(xml) {
            var xmlDoc = xml.responseXML;
            var root = SCommunicator.receiveXML(xmlDoc);
            SCommunicator.testXMLReceiver2(root);
        }
    };
    SCommunicator.receiveXML = function (xml) {
        var root2 = xml.children;
        if (root2.length != 1) {
            // Error
            return;
        }
        return SCommunicator.createRecursively(root2[0]);
    };
    SCommunicator.createRecursively = function (directory) {
        var childNodes = directory.childNodes;
        var settingsDir;
        settingsDir = new SettingsDirectory(SCommunicator.getValue("ruid", directory), SCommunicator.getValue("name", directory), SCommunicator.getValue("description", directory), [], SCommunicator.getValue("imageURL", directory));
        for (var i = 0; i < childNodes.length; i++) {
            var child;
            if (childNodes[i].tagName == "dir") {
                child = SCommunicator.createRecursively(childNodes[i]);
                settingsDir.appendChild(child);
            }
            else if (childNodes[i].tagName == "npar") {
                child = SCommunicator.parseNumericParameter(childNodes[i]);
                settingsDir.appendChild(child);
            }
        }
        return settingsDir;
    };
    SCommunicator.parseNumericParameter = function (parameter) {
        var childPar = new SettingsParameter(SCommunicator.getValue("ruid", parameter), SCommunicator.getValue("name", parameter), SCommunicator.getValue("description", parameter), SCommunicator.getValue("imageURL", parameter), 0);
        return childPar;
    };
    SCommunicator.getValue = function (tag, directory) {
        for (var i = 0; i < directory.childNodes.length; i++) {
            if (directory.childNodes[i].tagName == tag) {
                return directory.childNodes[i].innerHTML;
            }
        }
        return "XML error. Tag \"" + tag + "\" is missing.";
    };
    /**
     * Emulates a situation where the whole directory structure is to be reconstructed based on a text file.
     * @param directories The list of the directories.
     * @returns {SettingsDirectory} The root directory.
     */
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
    /**
     * The test method to be used to visualize the function of this whole class.
     * @param directories The directories described as a string array.
     */
    SCommunicator.testDataReceiver = function (directories) {
        var root = SCommunicator.receiveData(directories); //, parameters, parameterValues);
        var textDebugger = new TextDebugger();
        var valueChangeListener = new ValueChangeListener(textDebugger);
        var table = new TableFactory(document.body, valueChangeListener);
        table.createTable(root);
    };
    SCommunicator.testXMLReceiver = function (xmlURL) {
        SCommunicator.startXML(xmlURL);
    };
    SCommunicator.testXMLReceiver2 = function (root) {
        var textDebugger = new TextDebugger();
        var valueChangeListener = new ValueChangeListener(textDebugger);
        var table = new TableFactory(document.body, valueChangeListener);
        table.createTable(root);
    };
    return SCommunicator;
})();
/**
 * The class that provides a debugging console output in the browser.
 */
var TextDebugger = (function () {
    function TextDebugger() {
    }
    /**
     * Refreshes the whole output array consisting of two columns.
     * @param fullUids The list of the Uids of the parameters.
     * @param values The actual values of the parameters.
     */
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
/*
 var buttonnode= document.createElement('input');
 buttonnode.setAttribute('type','button');
 buttonnode.setAttribute('name','bt_communicator_test');
 buttonnode.setAttribute('value','Communicator Test');
 document.body.appendChild(buttonnode);
 buttonnode.onclick = function () {
 var oldtable = document.getElementById('settings_table');
 if (oldtable != null) {
 document.body.removeChild(oldtable);
 }
 var communicator = new SCommunicator();
 var rawString = "root|Name:Root|DescRoot|directory.png\\root/dir1|Directory1|Desc1|directory.png\\root/dir2|Directory2|Desc2|directory.png\\root/dir1/dir3|Directory3|Desc3|directory.png";
 SCommunicator.testDataReceiver(rawString.split('\\')); //, [], []);
 };

 buttonnode = document.createElement('input');
 buttonnode.setAttribute('type','button');
 buttonnode.setAttribute('name','bt_parameter_editor_test');
 buttonnode.setAttribute('value','Parameter Editor Test');
 document.body.appendChild(buttonnode);
 buttonnode.onclick = function () {
 var oldtable = document.getElementById('settings_table');
 if (oldtable != null) {
 document.body.removeChild(oldtable);
 }
 var textDebugger = new TextDebugger();
 var valueChangeListener = new ValueChangeListener(textDebugger);
 var table = new TableFactory(document.body, valueChangeListener);
 var par1 = new SettingsParameter('p1', 'My name is Parameter1', 'I am the description of Parameter1', '../../img/settings/p1.png', 15);
 var par2 = new SettingsParameter('p2', 'My name is Parameter2', 'I am the description of Parameter2', '../../img/settings/p2.png', 12);
 var parList = [par1, par2];
 var dir1 = new SettingsDirectory('d1', 'My name is Directory1', 'I am the description of Directory1', parList, '../../img/settings/directory.png');
 var par3 = new SettingsParameter('p3', 'My name is Parameter3', 'I am the description of Parameter3', '../../img/settings/p3.png', 7);
 var dir2 = new SettingsDirectory('root', 'My name is ROOT', 'I am the description of ROOT', [dir1, par3], '../../img/settings/directory.png');
 table.createTable(dir2);
 };
 */
SCommunicator.testXMLReceiver("settingsDS.xml");

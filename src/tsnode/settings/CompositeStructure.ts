/**
 * @author David G.
 */

/// <reference path="./TSettings.ts"/>
/// <reference path="./../messages.ts"/>


import SettingsContainer = SettingsData.SettingsContainer;
/**
 * A settings directory that can contain parameters or other directories.
 */
class SettingsDirectory implements SettingsNode{
    private elements : SettingsNode[];
    private name : string;
    private description : string;
    private parent : SettingsNode;
    private ruid : string;
    private imageURL : string;

    /**
     * Creates a settings directory.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param elements The children of this directory.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     */
    public constructor(ruid : string, name : string, description : string, elements : SettingsNode[], imageURL : string) {
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

    pollFromDBRecursively() {
        if (this.getElements() != null) {
            for (var i = 0; i < this.getElements().length; i++) {
                this.getElements()[i].pollFromDBRecursively();
            }
        }
    }

    /**
     * Sets the value of the directory. To be ignored.
     * @param value The new value of the directory.
     */
    setValue(value : number) : void {
    }

    /**
     * Gets the topic of this directory. Directories do not have a topic, so null is returned.
     * @returns {null} Null, directories do not have a topic.
     */
    getTopic() : string {
        return null;
    }

    /**
     * Appends a new child element to this directory.
     * @param element The child node to be appended to this directory.
     */
    appendChild(element : SettingsNode) {
        if (this.getElementByRuid(element.getRuid()) == null) {
            this.elements.push(element);
            element.setParent(this);
        }
    }

    /**
     * Gets a child of this directory based on its ruid. No grandchildren will be checked.
     * @param ruid The ruid of the child of this directory you are looking for.
     * @returns {any} The child of this directory with the specified ruid, null if not found.
     */
    getElementByRuid(ruid : string) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].getRuid() == ruid) {
                return this.elements[i];
            }
        }
        return null;
    }

    /**
     * Gets the original value of this directory. To be ignored.
     * @returns {number} The original value of this directory.
     */
    getValue() {
        return 0;
    }

    /**
     * Gets the URL of the image that is to be displayed as this directory in the GUI.
     * @returns {string} The URL of the image of this directory.
     */
    getImageURL() {
        return this.imageURL;
    }

    /**
     * Gets the full unique ID of this directory.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this directory.
     */
    getFullUid() {
        if (this.parent == this) {
            return this.ruid;
        }
        return this.parent.getFullUid() + '.' + this.ruid;
    }

    /**
     * Gets the relatively unique ID of this directory.
     * @returns {string} The ruid of this directory.
     */
    getRuid() {
        return this.ruid;
    }

    /**
     * Gets all the children of this directory.
     * @returns {SettingsNode[]} The children of this directory.
     */
    getElements() {
        return this.elements;
    }

    getElementsRecursively(buffer : SettingsNode[]) {
        if (this.getElements() != null && this.getElements().length > 0) {
            for (var i = 0; i < this.getElements().length; i++) {
                buffer.push(this.getElements()[i]);
                this.getElements()[i].getElementsRecursively(buffer);
            }
        }
    }

    /**
     * Gets the name of this directory that is to be displayed in the GUI.
     * @returns {string} The name of this directory.
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the description of this directory that is to be displayed in the GUI.
     * @returns {string} The description of this directory.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Checks whether this node is a directory.
     * @returns {boolean} True.
     */
    isDirectory() {
        return true;
    }

    /**
     * Sets the parent directory of this directory.
     * @param parent The new parent directory of this.
     */
    setParent(parent : SettingsDirectory) {
        this.parent = parent;
    }

    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    getParent() {
        return this.parent;
    }
}

/**
 * A settings parameter that can have multiple numeric values.
 */
class SettingsParameter implements SettingsNode {
    private name : string;
    private description : string;
    private parent : SettingsDirectory;
    private ruid : string;
    private imageURL : string;
    private settingsContainer : SettingsData.SettingsContainer;
    private clientSideBuffer : TSettings.ClientSideBuffer;
    private container : Node;
    private unit : string;
    private view : HTMLInputElement = null;


    /**
     * Creates a settings parameter.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     * @param value The original value of this settings parameter.
     */
    public constructor(ruid : string, name : string, description : string, imageURL : string,
                       topic : string, unit : string, defaultValue : SettingsContainer,
                       clientSideBuffer : TSettings.ClientSideBuffer, container : Node) {
        this.name = name;
        this.description = description;
        this.ruid = ruid;
        this.imageURL = imageURL;
        this.settingsContainer = defaultValue;
        this.clientSideBuffer = clientSideBuffer;
        this.container = container;
        this.unit = unit;
    }

    getUnit() : string {
        return this.unit;
    }

    /**
     * Settings the actual value of this parameter (that is set in the GUI).
     * Does not change the original value of this parameter that is in the DB.
     * @param value The new actual value of this parameter.
     */
    setValue(value : number) {
        this.settingsContainer = new SettingsData.SettingsContainer(this.settingsContainer.getTopic(),
            value, this.settingsContainer.getDescription());
        this.clientSideBuffer.setValueOf(this.settingsContainer);
    }

    setView(view : HTMLInputElement) {
        this.view = view;
    }

    pollFromDBRecursively() {
        this.settingsContainer = this.clientSideBuffer.getValueOf(this.settingsContainer.getTopic());
        if (this.view != null) {
            this.view.value = "" + this.settingsContainer.getValue();
        }
    }

    /**
     * Gets the value of this parameter that is currently stored in the DB.
     * @returns {number} The value of this parameter that is currently stored in the DB.
     */
    getValue() : number {
        return this.settingsContainer.getValue();
    }

    /**
     * Gets the URL of the image of this parameter that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this parameter.
     */
    getImageURL() {
        return this.imageURL;
    }

    getTopic() : string {
        return this.settingsContainer.getTopic();
    }

    /**
     * Gets the full unique ID of this parameter.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this parameter.
     */
    getFullUid() {
        return this.parent.getFullUid() + '.' + this.ruid;
    }

    /**
     * Gets the relatively unique ID of this parameter.
     * @returns {string} The ruid of this parameter.
     */
    getRuid() {
        return this.ruid;
    }

    /**
     * Gets the elements of this node. Paramaters do not contain elements, so it returns null.
     * @returns {null} Null.
     */
    getElements() {
        return null;
    }

    getElementsRecursively(buffer : SettingsNode[]) : void {
        return;
    }

    /**
     * Gets the name of this parameter that is to be displayed in the GUI.
     * @returns {string} The name of this parameter.
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the description of this parameter that is to be displayed in the GUI.
     * @returns {string} The description of this parameter.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Checks whether this node is a directory.
     * @returns {boolean} False.
     */
    isDirectory() {
        return false;
    }

    /**
     * Sets the parent directory of this parameter.
     * @param parent The new parent directory of this.
     */
    setParent(parent : SettingsDirectory) {
        this.parent = parent;
    }

    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    getParent() {
        return this.parent;
    }
}

interface SettingsNode {

    pollFromDBRecursively();

    /**
     * Sets the actual value of this node (that is set in the GUI).
     * Does not change the original value of this node that is in the DB.
     * @param value The new actual value of this node.
     */
    setValue(value : number);

    /**
     * Gets the value of this node that is currently stored in the DB.
     * @returns {number} The value of this node that is currently stored in the DB.
     */
    getValue() : number;

    /**
     * Gets the URL of the image of this node that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this node.
     */
    getImageURL() : string;

    /**
     * Gets the name of this node that is to be displayed in the GUI.
     * @returns {string} The name of this node.
     */
    getName() : string;

    /**
     * Gets the description of this node that is to be displayed in the GUI.
     * @returns {string} The description of this node.
     */
    getDescription() : string;

    /**
     * Gets the elements of this node.
     * @returns {SettinsNode[]} The children of this node.
     */
    getElements() : SettingsNode[];

    getElementsRecursively(buffer : SettingsNode[]) : void;

    /**
     * Checks whether this node is a directory.
     * @returns {boolean} Yes if this is a directory, false else.
     */
    isDirectory() : boolean;

    /**
     * Sets the parent directory of this node.
     * @param parent The new parent directory of this.
     */
    setParent(parent : SettingsDirectory);

    /**
     * Gets the parent directory of this.
     * @returns {SettingsNode} The parent directory of this.
     */
    getParent() : SettingsNode;

    getTopic() : string;

    /**
     * Gets the relatively unique ID of this node.
     * @returns {string} The ruid of this node.
     */
    getRuid() : string;

    /**
     * Gets the full unique ID of this node.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this node.
     */
    getFullUid() : string;
}

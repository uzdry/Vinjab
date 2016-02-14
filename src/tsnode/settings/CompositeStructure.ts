/**
 * Created by Ray on 14.02.2016.
 */

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

    /**
     * Sets the value of the directory. To be ignored.
     * @param value The new value of the directory.
     */
    setActualValue(value : number) : void {
    }

    /**
     * Notifies this object that its value has been saved in the database.
     */
    actualValueStored() : void {
        if (this.elements != null) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].actualValueStored();
            }
        }
    }

    /**
     * Gets the topic of this directory. Directories do not have a topic, so null is returned.
     * @returns {null} Null, directories do not have a topic.
     */
    getTopic() : Topic {
        return null;
    }

    /**
     * Gets the actual value of the directory. To be ignored.
     * @returns {number} The actual value of the directory.
     */
    getActualValue() {
        return 0;
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
        return this.parent.getFullUid() + '/' + this.ruid;
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
    private value : number;
    private actualValue : number;
    private topic : Topic;
    private valueChangeListener : ValueChangeListener;
    private container : Node;

    /**
     * Creates a settings parameter.
     * @param ruid The relatively unique ID of this directory. It must be unique among all the children of a parent.
     *  Grandchildren may have the same ruid.
     * @param name The name of the directory to be displayed in the GUI. Must not be unique.
     * @param description The description of the directory to be displayed in the GUI.
     * @param imageURL The URL of the image to be displayed in the GUI as this folder.
     * @param value The original value of this settings parameter.
     */
    public constructor(ruid : string, name : string, description : string, imageURL : string, topic : Topic, valueChangeListener : ValueChangeListener, value : number,
                       container : Node) {
        this.name = name;
        this.description = description;
        this.ruid = ruid;
        this.imageURL = imageURL;
        this.value = value;
        this.actualValue = value;
        this.topic = topic;
        this.valueChangeListener = valueChangeListener;
        this.container = container;
    }

    /**
     * Notifies this object that its value has been saved in the database.
     */
    actualValueStored() {
        this.value = this.actualValue;
    }

    /**
     * Settings the actual value of this parameter (that is set in the GUI).
     * Does not change the original value of this parameter that is in the DB.
     * @param value The new actual value of this parameter.
     */
    setActualValue(value : number) {
        this.actualValue = value;
        if (this.actualValue != this.value) {
            this.valueChangeListener.append(this, this.container);
        } else {
            this.valueChangeListener.remove(this, this.container);
        }
    }

    /**
     * Gets the actual value of this parameter.
     * @returns {number} The actual value of this parameter.
     */
    getActualValue() {
        return this.actualValue;
    }

    /**
     * Gets the value of this parameter that is currently stored in the DB.
     * @returns {number} The value of this parameter that is currently stored in the DB.
     */
    getValue() {
        return this.value;
    }

    /**
     * Gets the URL of the image of this parameter that is to be displayed in the GUI.
     * @returns {string} The URL of the image of this parameter.
     */
    getImageURL() {
        return this.imageURL;
    }

    getTopic() : Topic {
        return this.topic;
    }

    /**
     * Gets the full unique ID of this parameter.
     * All the nodes (directories/parameters...) have a unique Uid.
     * @returns {string} The unique ID of this parameter.
     */
    getFullUid() {
        return this.parent.getFullUid() + '/' + this.ruid;
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

    actualValueStored() : void;

    /**
     * Sets the actual value of this node (that is set in the GUI).
     * Does not change the original value of this node that is in the DB.
     * @param value The new actual value of this node.
     */
    setActualValue(value : number);

    /**
     * Gets the actual value of this node.
     * @returns {number} The actual value of this node.
     */
    getActualValue() : number;

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

    getTopic() : Topic;

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

var fs = require('fs');
eval(fs.readFileSync('messages.js')+'');
import {Server} from "./Server";
import {Broker} from "./Bus";
import {Aggregation, Distance, FuelConsumption, FuelDisplay, AverageComputation} from "./AggregatedFunctions";
import {BluetoothSim} from "./BluetoothSim";
import {DBBusDevice} from "./DBAccess";
import {BluetoothObd2} from "./bluetooth-obd2/BluetoothObd2"

/**
 * this class is for starting a server
 */
class ServerStarter {

    private db;
    private server;

    private source;
    private aggregations: Array<Aggregation>;

    /**
     * public constructor
     */
    constructor() {

       // var leveldown = require("leveldown");
       // leveldown.destroy("./testDB", function() { });

        this.db = new DBBusDevice();

        this.aggregations = new Array<Aggregation>();

        this.server = new Server();

        //this.source = new BluetoothObd2();
        this.source = new BluetoothSim();

        this.aggregations.push(new FuelConsumption());
        this.aggregations.push(new Distance());
        this.aggregations.push(new AverageComputation(Topic.SPEED));
        this.aggregations.push(new AverageComputation(Topic.FUEL_CONSUMPTION));
        this.aggregations.push(new FuelDisplay());

       this.source.init();

    }

}

var serverstarter = new ServerStarter();

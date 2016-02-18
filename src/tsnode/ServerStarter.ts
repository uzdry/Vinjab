import {Server} from "./Server";
import {Broker} from "./Bus";
import {Aggregation, Distance, FuelConsumption, AverageComputation} from "./AggregatedFunctions";
import {Topic} from "./messages";
import {BluetoothSim} from "./BluetoothSim";
import {DBBusDevice} from "./DBAccess";

/**
 * this class is for starting a server
 */
class ServerStarter {

    private db;
    private server;
    private broker;

    private distance;
    private fuelConsumption;
    private source;
    private aggregations: Array<Aggregation>;

    /**
     * public constructor
     */
    constructor() {

        this.db = new DBBusDevice();

        this.aggregations = new Array<Aggregation>();

        this.server = new Server();

        this.distance = new Distance();
        this.fuelConsumption = new FuelConsumption();

        this.source = new BluetoothSim();

        this.aggregations.push(new FuelConsumption());
        this.aggregations.push(new Distance());
        this.aggregations.push(new AverageComputation(Topic.SPEED));
        this.aggregations.push(new AverageComputation(Topic.FUEL_CONSUMPTION));

        this.source.init();

    }

}

var serverstarter = new ServerStarter();

import {DBBusDevice} from "./src/tsnode/DBAccess";
import {Distance, AverageSpeed, AvgFuelConsumption, FuelConsumption} from "./src/tsnode/AggregatedFunctions";
import {Server} from "./src/tsnode/Server";
import {BluetoothObd2} from "./src/tsnode/bluetooth-obd2/BluetoothObd2";
/**
 * Created by soads_000 on 08.02.2016.
 */

/** Start the database first so that there will no data be lost */
var database = new DBBusDevice();
/** Start the aggregated functions second, so that the first values will be used in the calculation as well*/
var aggregatedFunctions = [new Distance(), new AverageSpeed(), new AvgFuelConsumption(), new FuelConsumption()];
/** Start the Server */
var server = new Server();
/** Start the bluetooth-obd receiver */
var bluetooth = new BluetoothObd2();

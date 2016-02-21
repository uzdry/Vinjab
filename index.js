var DBAccess_1 = require("./src/tsnode/DBAccess");
var AggregatedFunctions_1 = require("./src/tsnode/AggregatedFunctions");
var Server_1 = require("./src/tsnode/Server");
var BluetoothObd2_1 = require("./src/tsnode/bluetooth-obd2/BluetoothObd2");
/**
 * Created by soads_000 on 08.02.2016.
 */
/** Start the database first so that there will no data be lost */
var database = new DBAccess_1.DBBusDevice();
/** Start the aggregated functions second, so that the first values will be used in the calculation as well*/
var aggregatedFunctions = [new AggregatedFunctions_1.Distance(), new AggregatedFunctions_1.AverageSpeed(), new AggregatedFunctions_1.AvgFuelConsumption(), new AggregatedFunctions_1.FuelConsumption()];
/** Start the Server */
var server = new Server_1.Server();
/** Start the bluetooth-obd receiver */
var bluetooth = new BluetoothObd2_1.BluetoothObd2();
//# sourceMappingURL=index.js.map
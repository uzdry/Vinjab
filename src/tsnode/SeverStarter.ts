/**
 * Created by yimeng on 14/02/16.
 */

/// <reference path="../../levelup.d.ts" />
import levelup = require("levelup");
import {Server} from "./Server";
import {Broker} from "./Bus";
import {Distance, FuelConsumption, AverageComputation} from "./AggregatedFunctions";
import {Topic} from "./messages";

/**
 * this class is for starting a server
 */
class SeverStarter {

    private db;
    private server;
    private broker;

    private distance;
    private fuelConsumption;
    private averageComputations: AverageComputation[];

    /**
     * public constructor
     */
    constructor() {

        this.db = levelup('./testDB', function(err, db) {
            if (err) console.log("Error in opening the Database: " + err);
            this.db = db;
        });

        this.server = new Server();
        this.broker = new Broker();

        this.distance = new Distance();
        this.fuelConsumption = new FuelConsumption();

        for(var topic in Topic.VALUES) {
            var averageComputation = new AverageComputation(topic);
            this.averageComputations.push(averageComputation);
        }

    }

}

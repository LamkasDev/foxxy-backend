/* Types */
import { FeatureAPIOptions, RouteType, Status } from "../../ts/types";

/* Node Imports */
import express from "express";
import cors from "cors";
import { Server } from "http";

/* Local Imports */
import Feature from "../feature";

class FeatureAPI extends Feature {
    options: FeatureAPIOptions;
    app: express.Express | undefined;
    appServer: Server | undefined;

    constructor(options: FeatureAPIOptions) {
        super(options);
        this.options = options;
    }

    async start(): Promise<void> {
        this.app = express();
        const corsCallback = {
            origin: (origin: any, callback: any) => {
                callback(null, this.options.allowedOrigins.indexOf(origin) !== -1);
            },
            credentials: true,
        };
        this.app.use(cors(corsCallback));

        this.appServer = this.app.listen(this.options.port);
        await new Promise((resolve) => {
            if (this.appServer === undefined) {
                resolve(0);
                return;
            }
            this.appServer.once("error", (e) => {
                this.state = { status: Status.ERROR, message: e.message };
                resolve(0);
            });
            this.appServer.once("listening", () => {
                resolve(0);
            });
        });
    }
}

export default FeatureAPI;

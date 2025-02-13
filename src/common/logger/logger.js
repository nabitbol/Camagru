import { transports } from "./Enums.js";
import { config } from "./config.js";

class Logger {
    constructor(config) {
        this.logs = [];
        this.level = "";
        this.timestamp = "";
        this.message = "";
        this.transports = config.TRANSPORT_TYPES;
        this.file = config.FILE_NAME;
    }

    #outputLogs = () => {
        this.transports.forEach(currTransport => {
            transports[currTransport](
                this.logs,
                this.timestamp,
                this.level,
                this.message,
                this.file
            )
        });
    }

    log = ({ level, message }) => {
        const now = new Date().toISOString();
        const serverLog = `${level} [${now}]: ${message}`;

        this.logs.push(serverLog);
        this.timestamp = now.timestamp;
        this.level = level;
        this.message = message;

        this.#outputLogs()
    }
}


const logger = new Logger(config);

export {
    Logger,
    logger
}
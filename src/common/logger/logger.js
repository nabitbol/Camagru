class Logger {
    constructor() {
        this.logs = [];
        this.level = "";
        this.timestamp = "";
        this.message = "";
    }

    log = ({ level, message }) => {
        const now = new Date().toISOString();
        const serverLog = `${level} [${now}]: ${message}`;

        this.logs.push(serverLog);
        this.timestamp = now.timestamp;
        this.message = message;

        console.log(serverLog);
    }
}


const logger = new Logger();

export {
    logger,
    Logger
}
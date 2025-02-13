import {
    outputLogToConsole,
    outputLogToFile
} from "./utils.js"

const logLevels = {
    ERROR: "ERROR",
    INFO: "INFO",
    WARN: "WARN",
    DEBUG: "DEBUG"
};

const transports = {
    CONSOLE: outputLogToConsole,
    FILE: outputLogToFile,
    // ELASTICSEARCH: outputLogToElasticsearch
}

export {
    logLevels,
    transports
}
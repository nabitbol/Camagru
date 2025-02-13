import { logLevels } from "./Enums.js"
import fs from "fs";


const outputLogToConsole = (logs,
    timestamp,
    level,
    message,
    file) => {

    const lastLogIdx = logs.length - 1;

    if (level === logLevels.ERROR) {
        console.error(logs[lastLogIdx]);
    } else {
        console.log(logs[lastLogIdx]);
    }
}

/*
** this function open the file in writing mode and add 
** the latest log att the end of the file.
*/
const outputLogToFile = (logs,
    timestamp,
    level,
    message,
    file) => {

    const lastLogIdx = logs.length - 1;

    fs.appendFile(file, logs[lastLogIdx] + "\n", err => {
        if (err) {
            const now = new Date().toISOString();
            console.error(`${logLevels.ERROR} [${now}]: ${err.message}`);
        }
    });

};

export {
    outputLogToConsole,
    outputLogToFile
}
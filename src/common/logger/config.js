import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/../../.env` });

const config = {
    TRANSPORT_TYPES: process.env.TRANSPORT_TYPES.split(','),
    FILE_NAME: process.env.FILE_NAME
}

export {
    config
};
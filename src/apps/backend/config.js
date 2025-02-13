import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/../../.env` });

const pgConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: process.env.DB_CONNECTION_MAX,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

export { pgConfig };

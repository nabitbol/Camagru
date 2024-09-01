import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/../../.env` });

/* -------------------------------------------------------------------------- */
/*                                  config db                                 */
/* -------------------------------------------------------------------------- */

const pgConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: process.env.DB_CONNECTION_MAX,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

/* -------------------------------------------------------------------------- */
/*                                 config mail                                */
/* -------------------------------------------------------------------------- */

// Use secrue:true for port 465, `false` for all other ports
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

/* -------------------------------------------------------------------------- */

export { pgConfig, transporter };

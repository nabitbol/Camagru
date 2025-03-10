import nodemailer from "nodemailer";

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
/*                                  Web info                                  */
/* -------------------------------------------------------------------------- */

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const BACKEND_PORT = process.env.BACKEND_PORT;
const CORS = { "Access-Control-Allow-Origin": process.env.CORS };
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_TIME = process.env.TOKEN_EXPIRATION_TIME;

/* -------------------------------------------------------------------------- */

export { pgConfig, transporter, BACKEND_BASE_URL, BACKEND_PORT, CORS, JWT_SECRET, TOKEN_EXPIRATION_TIME };

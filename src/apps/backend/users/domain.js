import crypto from "node:crypto";
import * as argon2 from "argon2";
import QueryBuilder from "@camagru/query-builder";
import { UserDataAccess } from "./data-access.js";
import { pgConfig, transporter } from "../config.js";

//TODO add error handling
//TODO input verification

const queryBuilder = new QueryBuilder(pgConfig);
const userDataAccess = UserDataAccess(queryBuilder);

/* --------------------------------- sign-up -------------------------------- */

const hashString = async (toHash) => {
  try {
    const hash = await argon2.hash(toHash);
    return hash;
  } catch (err) {
    console.log(err);
  }
};

const getVerifyEmailContent = (userEmail, username, verificationToken) => {
  return {
    from: '"Camagru team 📷" <wilfrid.stokes63@ethereal.email>',
    to: userEmail,
    subject: "Verification email ✔",
    text: `Welcome ${username}! \n\n We are thrille to count you in. \n\n\
To verify your account please on the link below: ${verificationToken}`,
    html: `<h1>Welcome ${username}!</h1> \
<p>We are thrille to count you in.</p>\
<p>To verify your account please on the link below: \
<strong alt="link to validate your account">${verificationToken}\
</strong></p>`,
  };
};

const isExisitingUser = async (email) => {
  try {
    const existingUser = await userDataAccess.getUserFromEmail({ email });
    if (existingUser) throw new Error("Email already in use");
  } catch (err) {
    throw err;
  }
};

const getVerificationToken = () => {
  return crypto.randomBytes(256).toString("hex");
};

const addUser = async (userData) => {
  await userDataAccess.addUser(userData);
};

const sendVerificationEmail = async (
  userEmail,
  username,
  verificationToken
) => {
  try {
    const info = await transporter.sendMail(
      getVerifyEmailContent(userEmail, username, verificationToken)
    );

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
};

const signUp = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    await isExisitingUser(email);
    const verificationToken = getVerificationToken();
    await sendVerificationEmail(email, username, verificationToken);
    const hash = await hashString(password);
    await addUser({
      email: email,
      username: username,
      pass: hash,
      email_verification_token: verificationToken,
      email_verified: false,
    });
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end();
  } catch (err) {
    // if user already exist called is verified user
    console.log(err);
  }
};

export { signUp };

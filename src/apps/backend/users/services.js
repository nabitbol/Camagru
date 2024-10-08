import crypto from "node:crypto";
import * as argon2 from "argon2";
import { transporter, backendBaseUrl, backendPort } from "../config.js";
import UserDataAccess from "./data-access.js";

//TODO add error handling
//TODO input verification

const getVerifyEmailContent = (userEmail, username, verificationToken) => {
  //Swape from email to env variable
  return {
    from: '"Camagru team 📷" <wilfrid.stokes63@ethereal.email>',
    to: userEmail,
    subject: "Verification email ✔",
    text: `Welcome ${username}! \n\n We are thrille to count you in. \n\n\
To verify your account please on the link below: ${verificationToken}`,
    html: `<h1>Welcome ${username}!</h1> \
<p>We are thrille to count you in.</p>\
<p>To verify your account please on the link below:</p>\
<a href="${backendBaseUrl}:${backendPort}/verify/${verificationToken}">link to \
validate your account </a>`,
  };
};

const UserServices = (userDataAccess) => {
  const hashString = async (toHash) => {
    try {
      const hash = await argon2.hash(toHash);
      return hash;
    } catch (err) {
      console.log(`Error: ${err.message}`);
      throw new Error("Couldn't hash string");
    }
  };

  const isExisitingUser = async (email) => {
    try {
      const existingUser = await userDataAccess.getUserFromEmail({ email });
      return existingUser ? true : false;
    } catch (err) {
      console.log(`Error: ${err.message}`);
      throw new Error("Couldn't get user from email");
    }
  };

  const getVerificationToken = () => {
    return crypto.randomBytes(256).toString("hex");
  };

  const addUser = async (userData) => {
    try {
      await userDataAccess.addUser(userData);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      throw new Error("Couldn't addd user");
    }
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
      console.log(`Error: ${err.message}`);
      throw new Error("Couldn't send verification e-mail");
    }
  };

  const getUserFromToken = async (token) => {
    try {
      const userData = await userDataAccess.getUserFromToken(token);
      if (!userData) {
        console.log(`Error: ${err.message}`);
        throw new Error("User not found");
      }
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const updateUserVerifiedStatus = async (userData) => {
    try {
      await userDataAccess.updateUser(userData, {
        email_verified: true,
        email_verification_token: null,
      });
    } catch (err) {
      console.log(`Error: ${err.message}`);
      throw new Error("Couldn't update user data");
    }
  };

  return {
    addUser,
    isExisitingUser,
    getVerificationToken,
    sendVerificationEmail,
    hashString,
    getUserFromToken,
    updateUserVerifiedStatus,
  };
};

export default UserServices;

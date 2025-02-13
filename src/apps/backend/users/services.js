import crypto from "node:crypto";
import * as argon2 from "argon2";
import { transporter, BACKEND_BASE_URL, BACKEND_PORT } from "../config.js";
import { MyError, errors } from '../errors/index.js';
import { logger, logLevels } from '@camagru/logger';


//TODO add error handling
//TODO input verification

/* -------------------------------------------------------------------------- */
/*                                    tools                                   */
/* -------------------------------------------------------------------------- */

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
<a href="${BACKEND_BASE_URL}:${BACKEND_PORT}/sign-up/verify-email/${verificationToken}">link to \
validate your account </a>`,
  };
};

const UserServices = (userDataAccess) => {
  const hashString = async (toHash) => {
    try {
      const hash = await argon2.hash(toHash);
      return hash;
    } catch (err) {
      throw new MyError(errors.USER_UPDATE);
    }
  };

  const isExisitingUser = async (email) => {
    try {
      const existingUser = await userDataAccess.getUserFromEmail({ email });
      return existingUser ? true : false;
    } catch (err) {
      throw new MyError(errors.USER_NOT_FOUND);
    }
  };

  const getVerificationToken = () => {
    return crypto.randomBytes(256).toString("hex");
  };

  const addUser = async (userData) => {
    try {
      await userDataAccess.addUser(userData);

      logger.log({
        level: logLevels.INFO,
        message: "User added successufully",
      });

    } catch (err) {
      throw new MyError(errors.USER_INSERTION);
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

      logger.log({
        level: logLevels.INFO,
        message: `Message sent: ${info.messageId}`,
      });

    } catch (err) {
      throw new MyError(errors.EMAIL_NOT_SENT);
    }
  };

  const getUserFromToken = async (token) => {
    try {
      const userData = await userDataAccess.getUserFromToken(token);
      if (!userData) {
        throw new MyError(errors.USER_NOT_FOUND);
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
      throw new MyError(errors.USER_UPDATE);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                main services                               */
  /* -------------------------------------------------------------------------- */

  const signUp = async (email, username, password, response) => {
    //move business log to service and keep the data format and validation in service
    if (await userServices.isExisitingUser(email)) {
      throw new MyError(errors.EMAIL_ALREADY_IN_USE);
    }

    const verificationToken = userServices.getVerificationToken();

    const hash = await userServices.hashString(password);

    await userServices.addUser({
      email: email,
      username: username,
      pass: hash,
      email_verification_token: verificationToken,
      email_verified: false,
    });

    await userServices.sendVerificationEmail(
      email,
      username,
      verificationToken
    );

    response
      .status(201)
      .header("Content-Type", "application/json")
      .body({
        content: "User signed up successfully",
      })
      .send();
  };


  const verifyUser = async (token, response) => {
    const userData = await userServices.getUserFromToken(token);

    await userServices.updateUserVerifiedStatus(userData);

    response
      .status(202)
      .header("Content-Type", "application/json")
      .body({
        content: "User verified successfully",
      })
      .send();

  }
  return {
    signUp,
    verifyUser
  };
};

export default UserServices;

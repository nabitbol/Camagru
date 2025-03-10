import crypto, { Verify } from 'node:crypto';
import * as argon2 from 'argon2';
import Jwt from '@camagru/myjwt';
import { transporter, getVerifyEmailContent, getResetPasswordEmailContent } from '../config.js';
import { MyError, errors } from '../errors/index.js'
import { logger, logLevels } from '@camagru/logger';
import { JWT_SECRET } from '../config.js';


//TODO input verification

/* -------------------------------------------------------------------------- */
/*                                    tools                                   */
/* -------------------------------------------------------------------------- */

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

  const genToken = () => {
    const token = crypto.randomBytes(256).toString("hex");

    logger.log({
      level: logLevels.INFO,
      message: "Generated token successfully",
    });

    return token;
  };

  const addUser = async (userData) => {
    try {
      await userDataAccess.addUser(userData);

      logger.log({
        level: logLevels.INFO,
        message: "User added successfully",
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
        message: `Verification e-mail sent: ${info.messageId}`,
      });

    } catch (err) {
      throw new MyError(errors.EMAIL_NOT_SENT);
    }
  };

  const sendResetPasswordEmail = async (
    userEmail,
    username,
    verificationToken
  ) => {
    try {

      const info = await transporter.sendMail(
        getResetPasswordEmailContent(userEmail, username, verificationToken)
      );

      logger.log({
        level: logLevels.INFO,
        message: `Reset password e-mail sent: ${info.messageId}`,
      });

    } catch (err) {
      throw new MyError(errors.EMAIL_NOT_SENT);
    }
  };

  const getUserFromVerificationToken = async (token) => {
    try {
      const userData = await userDataAccess.getUserFromVerificationToken(token);
      if (!userData) {
        throw new MyError(errors.USER_NOT_FOUND);
      }
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const getUserFromResetPasswordToken = async (token) => {
    try {
      const userData = await userDataAccess.getUserFromResetPasswordToken(token);
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

      logger.log({
        level: logLevels.INFO,
        message: "Updated user verification status",
      });

    } catch (err) {
      throw new MyError(errors.USER_UPDATE);
    }
  };

  const updateUserResetPasswordToken = async (userData, token) => {
    try {
      await userDataAccess.updateUser(userData, {
        pass_reset_token: token,
      });

      logger.log({
        level: logLevels.INFO,
        message: "Updated user password token",
      });

    } catch (err) {
      throw new MyError(errors.USER_UPDATE);
    }
  };

  const resetUserPassword = async (userData, hash) => {
    try {
      await userDataAccess.updateUser(userData, {
        pass: hash,
      });

      logger.log({
        level: logLevels.INFO,
        message: "Updated user password",
      });

    } catch (err) {
      throw new MyError(errors.USER_UPDATE);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                main services                               */
  /* -------------------------------------------------------------------------- */

  /**
   * 
   * @param {string} email 
   * @param {string} username 
   * @param {string} password
   * 
   * If user do not exist, add it to the database and
   *  send verification e-mail. 
   */
  const signUp = async (email, username, password) => {
    if (await isExisitingUser(email)) {
      throw new MyError(errors.EMAIL_ALREADY_IN_USE);
    }

    const verificationToken = genToken();

    const hash = await hashString(password);

    await addUser({
      email: email,
      username: username,
      pass: hash,
      email_verification_token: verificationToken,
      email_verified: false,
    });

    await sendVerificationEmail(
      email,
      username,
      verificationToken
    );
  };

  /**
   * 
   * @param {string} token 
   * @returns {Jwt} json web token
   */
  const verifyUser = async (token) => {
    const userData = await getUserFromVerificationToken(token)

    await updateUserVerifiedStatus(userData);

    return new Jwt().sign(userData.email, JWT_SECRET);
  };

  /**
   * 
   * @param {string} token 
   * @returns {object} token payload
   * 
   * Verify token signature and experiation
   */
  const verifyToken = (token) => {
    return new Jwt().verify(token, JWT_SECRET);
  };

  /**
   * 
   * @param {Object} userDataInput 
   * @returns {Jwt} json web token
   * 
   * Verify that user data input match user
   * safed credentials
   */
  const signIn = async (userDataInput) => {
    const { email } = userDataInput
    const userData = await userDataAccess.getUserFromEmail({ email });

    if (!userData)
      throw new MyError(errors.LOGIN_INVALID_CREDENTIALS);

    if (!userData.email_verified)
      throw new MyError(errors.EMAIL_NOT_VERIFIED);

    if (!await argon2.verify(userData.pass, userDataInput.password))
      throw new MyError(errors.LOGIN_INVALID_CREDENTIALS);

    const jwt = new Jwt().sign(userData.email, JWT_SECRET);

    logger.log({
      level: logLevels.INFO,
      message: `User ${userData.id}: successfully signed in.`
    });

    return jwt;
  };

  /**
   * 
   * @param {string} email 
   * 
   * Add password reset token to the user data
   */
  const sendResetPassword = async (email) => {

    const userData = await userDataAccess.getUserFromEmail({ email });
    if (!userData)
      return;

    const resetPasswordToken = genToken();

    await updateUserResetPasswordToken(userData, resetPasswordToken);

    await sendResetPasswordEmail(
      userData.email,
      userData.username,
      resetPasswordToken
    );

  };

  const verifyResetPassword = async (token, newPassword) => {
    const userData = await getUserFromResetPasswordToken(token);

    const hash = await hashString(newPassword);

    await updateUserResetPasswordToken(userData, null);

    await resetUserPassword(userData, hash);
  }

  return {
    signUp,
    verifyUser,
    verifyToken,
    signIn,
    sendResetPassword,
    verifyResetPassword
  };
};

export default UserServices;

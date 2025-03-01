import * as fieldCheck from '@camagru/field-check';
import { HttpResponseBuilder, HttpResponseHandler } from '@camagru/http-response';
import { TOKEN_EXPIRATION_TIME } from '../config.js';


const UserControllers = (userServices) => {
  const header = [{ "Content-Type": "application/json" }];
  const tokenExperationOptions = TOKEN_EXPIRATION_TIME * 60 * 1000;

  const signUp = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { email, username, password } = req.body;
    const status = 201;

    try {

      if (!username || fieldCheck.validateUsername(username) === false)
        throw (Error("invalid username"));

      if (!email || fieldCheck.validateEmail(email) === false)
        throw (Error("invalid email"));

      if (!password || fieldCheck.validatePassword(password) === false)
        throw (Error("invalid password"));

      await userServices.signUp(email, username, password);

      HttpResponseHandler(response, {
        header,
        status,
      });

    } catch (err) {
      next(err);
    }

  };

  /* -------------------------------------------------------------------------- */

  const verifyUser = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const token = req.params.id;
    const status = 202;

    try {
      const jwt = await userServices.verifyUser(token);

      header.push({
        'Set-Cookie': `token=${jwt};\
        Max-Age=${tokenExperationOptions}; HttpOnly; secure`
      });

      HttpResponseHandler(response, {
        header,
        status,
      });

    } catch (err) {
      next(err);
    };
  }

  /* -------------------------------------------------------------------------- */

  const signIn = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { email, password } = req.body;
    const status = 200;

    try {

      if (!email || fieldCheck.validateEmail(email) === false)
        throw (Error("invalid email"));

      if (!password || fieldCheck.validatePassword(password) === false)
        throw (Error("invalid password"));

      //ToDo add coockie expiration for the client 
      const jwt = await userServices.signIn({
        email,
        password
      });

      header.push({
        'Set-Cookie': `token=${jwt};\
        Max-Age=${tokenExperationOptions}; HttpOnly; secure`
      });

      HttpResponseHandler(response, {
        header,
        status
      });

    } catch (err) {
      next(err);
    };
  }

  /* -------------------------------------------------------------------------- */

  /**
   * 
   * Always return a 202 (Accepted) response for password reset requests,
   * regardless of whether the user exists.
   * This prevents attackers from enumerating valid usernames
   * through password reset attempts.
   */
  const sendResetPassword = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { email } = req.body;
    const status = 202;

    try {

      if (!email || fieldCheck.validateEmail(email) === false)
        throw (Error("invalid email"));

      await userServices.sendResetPassword(email);

      HttpResponseHandler(response, {
        header,
        status
      });

    } catch (err) {
      next(err);
    }
  }

  /* -------------------------------------------------------------------------- */

  const verifyResetPassword = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { password } = req.body;
    const token = req.params.id;
    const status = 204;

    try {

      if (!password || fieldCheck.validatePassword(password) === false)
        throw (Error("invalid password"));

      await userServices.verifyResetPassword(token, password);

      HttpResponseHandler(response, {
        header,
        status
      });

    } catch (err) {
      next(err);
    }
  }

  /* -------------------------------------------------------------------------- */

  const isAuth = (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const status = 302;

    try {

      header.push({ 'location': '/signin' });
      if (!req.header['Cookie']) {
        HttpResponseHandler(response, {
          header,
          status
        });

        return;
      }

      const token = req.header['Cookie'].split(' ')[1];
      const payload = userServices.verifyToken(token);

      Object.assign(req.body, payload);

      next();

    } catch (err) {
      next(err);
    }
  }

  return {
    signUp,
    verifyUser,
    isAuth,
    signIn,
    sendResetPassword,
    verifyResetPassword
  };
};


export default UserControllers;

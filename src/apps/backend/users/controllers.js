import * as fieldCheck from '@camagru/field-check';
import { HttpResponseBuilder, HttpResponseHandler } from '@camagru/http-response';
import { TOKEN_EXPIRATION_TIME } from '../config.js';


const UserControllers = (userServices) => {
  const header = [{ "Content-Type": "application/json" }];
  const tokenExperationOptions = TOKEN_EXPIRATION_TIME * 60 * 1000;

  const signUp = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { email, username, password } = req.body;
    const message = "User signed up successfully";
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
        message,
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
    const message = "User verified successfully";


    try {
      const jwt = await userServices.verifyUser(token);

      header.push({
        'Set-Cookie': `token=${jwt};\
        Max-Age=${tokenExperationOptions}; HttpOnly; secure`
      });

      HttpResponseHandler(response, {
        header,
        status,
        message
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
    const message = "User signed in successfully";

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
        status,
        message
      });

    } catch (err) {
      next(err);
    };
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
    signIn
  };
};


export default UserControllers;

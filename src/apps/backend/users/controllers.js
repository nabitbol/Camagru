import { HttpResponseBuilder, HttpResponseHandler } from "@camagru/http-response";
import { MyError, errors } from '../errors/index.js'
import { logger, logLevels } from "@camagru/logger";


const UserControllers = (userServices) => {
  const signUp = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { email, username, password } = req.body;

    try {
      userServices.signUp(email, username, password, response);
    } catch (err) {


      if (err instanceof MyError) {
        HttpResponseHandler(response, err);
      } else {
        HttpResponseHandler(response, {
          ...errors.DEFAULT_ERROR,
          message: err.message
        });
      }

      logger.log({
        level: logLevels.ERROR,
        message: err.message
      });

    }

  };

  const verifyUser = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const token = req.params.id;

    try {
      userServices.verifyUser(token, response);
    } catch (err) {

      if (err instanceof MyError) {
        HttpResponseHandler(response, err);
      } else {
        HttpResponseHandler(response, {
          ...errors.DEFAULT_ERROR,
          message: err.message
        });
      }

      logger.log({
        level: logLevels.ERROR,
        message: err.message
      });
    }

  };
  return {
    signUp,
    verifyUser,
  };
};

export default UserControllers;

import { HttpResponseBuilder, HttpResponseHandler } from "@camagru/http-response";
import { MyError, errors } from '../errors/index.js'
import { logger, logLevels } from "@camagru/logger";


const UserControllers = (userServices) => {
  const signUp = async (req, res) => {
    const response = new HttpResponseBuilder(res);
    const { email, username, password } = req.body;

    try {

      if (await userServices.isExisitingUser(email)) {
        throw new MyError(errors.EMAIL_ALREADY_IN_USE);
      }

      const verificationToken = userServices.getVerificationToken();

      await userServices.sendVerificationEmail(
        email,
        username,
        verificationToken
      );

      const hash = await userServices.hashString(password);

      await userServices.addUser({
        email: email,
        username: username,
        pass: hash,
        email_verification_token: verificationToken,
        email_verified: false,
      });

      response
        .status(201)
        .header("Content-Type", "application/json")
        .body({
          content: "User signed up successfully",
        })
        .send();

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

  const verifyUser = async (req, res) => {
    const response = new HttpResponseBuilder(res);
    const token = req.params.id;

    try {
      const userData = await userServices.getUserFromToken(token);

      await userServices.updateUserVerifiedStatus(userData);

      response
        .status(202)
        .header("Content-Type", "application/json")
        .body({
          content: "User verified successfully",
        })
        .send();

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

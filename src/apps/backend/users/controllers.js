import { HttpResponseHandler } from "@camagru/http-response";
import { MyError, ErrorType, errors } from '../errors/index.js'


const UserControllers = (userServices) => {
  const signUp = async (req, res) => {
    const response = new HttpResponseHandler(res);
    const { email, username, password } = req.body;

    try {

      if (await userServices.isExisitingUser(email)) {
        console.log(ErrorType.EMAIL_ALREADY_IN_USE);
        throw new MyError("Email already in use", ErrorType.EMAIL_ALREADY_IN_USE);
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
          content: "Signed up successfully",
        })
        .send();

    } catch (err) {

      console.log(err.message);

      if (err instanceof MyError) {
        errors[err.errorType](response, err);
      } else {
        errors[ErrorType.DEFAULT_ERROR](response, err);
      }

    }

  };

  const verifyUser = async (req, res) => {
    const response = new HttpResponseHandler(res);
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

      console.log(err.message);

      if (err instanceof MyError) {
        errors[err.errorType](response, err);
      } else {
        errors[ErrorType.DEFAULT_ERROR](response, err);
      }

    }

  };
  return {
    signUp,
    verifyUser,
  };
};

export default UserControllers;

import { HttpResponseHandler } from "@camagru/http-response";
import {
  httpDefaultError,
  httpErrorEmailAlreadyUsed,
  httpErrorEmailNotSent,
  httpErrorUserInsertion,
  httpErrorUserNotFound,
} from "../http-responses.js";

const UserControllers = (userServices) => {
  const signUp = async (req, res) => {
    const response = new HttpResponseHandler(res);
    const { email, username, password } = req.body;

    try {
      if (await userServices.isExisitingUser(email))
        throw new Error("Email already in use");
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
          content: "ich",
        })
        .send();
    } catch (err) {
      switch (err.message) {
        case "Email already in use":
          httpErrorEmailAlreadyUsed(response, err);
          break;
        case "Couldn't send verification e-mail":
          httpErrorEmailNotSent(response, err)
          break;
        case "Couldn't addd user":
          httpErrorUserInsertion(response, err);
          break;
        default:
          httpDefaultError(response, err);
      }
    }
  };

  const verifyUser = async (req, res) => {
    const response = new HttpResponseHandler(res);
    const token = req.params.id;

    try {
      const userData = await userServices.getVerificationToken(token);
      await userServices.updateUserVerifiedStatus(userData);
      response.status(202).header("Content-Type", "application/json").send();
    } catch (err) {
      switch (err.message) {
        case "User not found":
          httpErrorUserNotFound(response, err);
          break;
        case "Couldn't update user data":
          // add http error for email couldn't be sent
          break;
        default:
          httpDefaultError(response, err); 
    }
  };

  return {
    signUp,
    verifyUser
  };
};

// .get("/test", simpleText);

export default UserControllers;

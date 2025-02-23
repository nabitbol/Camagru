import { HttpResponseBuilder, HttpResponseHandler } from "@camagru/http-response";


const UserControllers = (userServices) => {
  const header = [{ "Content-Type": "application/json" }];

  const signUp = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const { email, username, password } = req.body;
    const message = "User signed up successfully";
    const status = 201;

    try {
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

  const verifyUser = async (req, res, next) => {
    const response = new HttpResponseBuilder(res);
    const token = req.params.id;
    const status = 202;
    const message = "User verified successfully";

    try {
      await userServices.verifyUser(token);

      HttpResponseHandler(response, {
        header,
        status,
        message
      });

    } catch (err) {
      next(err);
    };
  }

  return {
    signUp,
    verifyUser,
  };
};


export default UserControllers;

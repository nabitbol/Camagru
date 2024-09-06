import HttpResponseHandler from "@camagru/response";

const UserControllers = (userServices) => {
  const signUp = async (req, res) => {
    const response = new HttpResponseHandler(res);
    const { email, username, password } = req.body;

    try {
      await userServices.isExisitingUser(email);
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
        .status(500)
        .header("Content-Type", "application/json")
        .body({
          content: "ich",
        })
        .send();
    } catch (err) {
      // if user already exist called is verified user
      console.log(err);
    }
  };

  return {
    signUp,
  };
};

// .get("/test", simpleText);

export default UserControllers;

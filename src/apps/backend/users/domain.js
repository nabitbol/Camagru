import crypto from "node:crypto";
import * as argon2 from "argon2";
import { transporter } from "../config.js";

//TODO add error handling
//TODO input verification

const getVerifyEmailContent = (userEmail, username, verificationToken) => {
  return {
    from: '"Camagru team 📷" <wilfrid.stokes63@ethereal.email>',
    to: userEmail,
    subject: "Verification email ✔",
    text: `Welcome ${username}! \n\n We are thrille to count you in. \n\n\
To verify your account please on the link below: ${verificationToken}`,
    html: `<h1>Welcome ${username}!</h1> \
<p>We are thrille to count you in.</p>\
<p>To verify your account please on the link below: \
<strong alt="link to validate your account">${verificationToken}\
</strong></p>`,
  };
};

const UserServices = (userDataAccess) => {
  const hashString = async (toHash) => {
    try {
      const hash = await argon2.hash(toHash);
      return hash;
    } catch (err) {
      console.log(err);
    }
  };

  const isExisitingUser = async (email) => {
    try {
      const existingUser = await userDataAccess.getUserFromEmail({ email });
      if (existingUser) throw new Error("Email already in use");
    } catch (err) {
      throw err;
    }
  };

  const getVerificationToken = () => {
    return crypto.randomBytes(256).toString("hex");
  };

  const addUser = async (userData) => {
    await userDataAccess.addUser(userData);
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

      console.log("Message sent: %s", info.messageId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    addUser,
    isExisitingUser,
    getVerificationToken,
    sendVerificationEmail,
    hashString,
  };
};

export default UserServices;

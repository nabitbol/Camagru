/* ------------------------------- User errors ------------------------------ */

const header = [{ "Content-Type": "application/json" }]

const httpErrorEmailAlreadyUsed = {
  status: 409,
  message: "Email already in use",
  header
}

const httpErrorUserInsertion = {
  status: 500,
  message: "Couldn't addd user",
  header
};

const httpErrorUserUpdate = {
  status: 500,
  message: "Couldn't update user data",
  header
};

const httpErrorUserNotFound = {
  status: 404,
  message: "Couldn't get user",
  header
};

const httpErrorEmailNotSent = {
  status: 502,
  message: "Couldn't send verification e-mail",
  header
};

const httpEmailNotVerified = {
  status: 403,
  message: "User email not verified",
  header
}

const httpInvalidCredentials = {
  status: 400,
  message: "Couldn't login, invalid credentials",
  header
}

/* ------------------------------ Shared errors ----------------------------- */

const httpDefaultError = {
  status: 500,
  header
};

export {
  httpErrorEmailAlreadyUsed,
  httpErrorEmailNotSent,
  httpDefaultError,
  httpErrorUserInsertion,
  httpErrorUserUpdate,
  httpErrorUserNotFound,
  httpEmailNotVerified,
  httpInvalidCredentials
};

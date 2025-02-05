/* ------------------------------- User errors ------------------------------ */

const httpErrorEmailAlreadyUsed = {
  status: 409,
  message: "Email already in use",
  header: ["Content-Type", "application/json"]
}

const httpErrorUserInsertion = {
  status: 500,
  message: "Couldn't addd user",
  header: ["Content-Type", "application/json"]
};


const httpErrorUserUpdate = {
  status: 500,
  message: "Couldn't update user data",
  header: ["Content-Type", "application/json"]
};

const httpErrorUserNotFound = {
  status: 404,
  message: "Couldn't get user from email",
  header: ["Content-Type", "application/json"]
};

const httpErrorEmailNotSent = {
  status: 502,
  message: "Couldn't send verification e-mail",
  header: ["Content-Type", "application/json"]
};

/* ------------------------------ Shared errors ----------------------------- */

const httpDefaultError = {
  status: 500,
  header: ["Content-Type", "application/json"]
};

export {
  httpErrorEmailAlreadyUsed,
  httpErrorEmailNotSent,
  httpDefaultError,
  httpErrorUserInsertion,
  httpErrorUserUpdate,
  httpErrorUserNotFound,
};

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
  message: "Couldn't get user from email",
  header
};

const httpErrorEmailNotSent = {
  status: 502,
  message: "Couldn't send verification e-mail",
  header
};

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
};

/* ------------------------------- User errors ------------------------------ */

const httpErrorEmailAlreadyUsed = (response, error) => {
  response
    .status(409)
    .header("Content-Type", "application/json")
    .body({
      message: error.message,
    })
    .send();
};

const httpErrorUserInsertion = (response, error) => {
  response
    .status(500)
    .header("Content-Type", "application/json")
    .body({
      message: error.message,
    })
    .send();
};

const httpErrorUserUpdate = (response, error) => {
  response
    .status(500)
    .header("Content-Type", "application/json")
    .body({
      message: error.message,
    })
    .send();
};

const httpErrorUserNotFound = (response, error) => {
  response
    .status(404)
    .header("Content-Type", "application/json")
    .body({
      message: error.message,
    })
    .send();
};

const httpErrorEmailNotSent = (response, error) => {
  response
    .status(502)
    .header("Content-Type", "application/json")
    .body({
      message: error.message,
    })
    .send();
};

/* ------------------------------ Shared errors ----------------------------- */

const httpDefaultError = (response, error) => {
  response
    .status(500)
    .header("Content-Type", "application/json")
    .body({
      message: error.message,
    })
    .send();
};

export {
  httpErrorEmailAlreadyUsed,
  httpErrorEmailNotSent,
  httpDefaultError,
  httpErrorUserInsertion,
  httpErrorUserUpdate,
  httpErrorUserNotFound,
};

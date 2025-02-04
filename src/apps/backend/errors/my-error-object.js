/*
** The constructor is wainting for errors keys listed in /backend/errors/error-list.js
*/

class MyError extends Error {
    constructor(message, error) {
      super(message);
      this.responseHandler = error;
    }
  };
  
/*
** Example of MyError object usage:
** 
** try {
**  Your statements
**  const customError = new MyError('DEFAULT_ERROR',  errors.DEFAULT_ERROR);
** }
** catch (err) {
**  err.responseHandler(response, err);
** }
*/

export default MyError;
  
/*
** The constructor is wainting for errorType keys listed in /backend/errors/error-list.js
*/

class MyError extends Error {
    constructor(message, ErrorType) {
      super(message);
      this.errorType = ErrorType;
    }
  };
  
/*
** Example of MyError object usage:
**
** const customError = new MyError('DEFAULT_ERROR',  ErrorType.DEFAULT_ERROR);  
** errors[customError.errorType];
*/

export default MyError;
  
/*
** The constructor is wainting for errors keys listed in /backend/errors/error-list.js
*/

class MyError extends Error {
  constructor({ message, status, header }) {
    super(message);
    this.status = status;
    this.header = header;

  }
};

export default MyError;

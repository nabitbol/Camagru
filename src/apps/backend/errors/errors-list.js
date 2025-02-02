import * as httpErrorResponses from './http-responses.js'

/*
** Maps error types to corresponding HTTP error responses.  This allows
** associating specific error objects with the appropriate error handling
** functions.
*/

const ErrorType = {
    DEFAULT_ERROR: 0,
    USER_INSERTION: 1,
    USER_UPDATE: 2,
    USER_NOT_FOUND: 3,
    EMAIL_ALREADY_IN_USE: 4,
    EMAIL_NOT_SENT: 5,
};

const errors = [
    httpErrorResponses.httpDefaultError,
    httpErrorResponses.httpErrorUserInsertion,
    httpErrorResponses.httpErrorUserUpdate,
    httpErrorResponses.httpErrorUserNotFound,
    httpErrorResponses.httpErrorEmailAlreadyUsed,
    httpErrorResponses.httpErrorEmailNotSent
];

export {
    ErrorType,
    errors
};

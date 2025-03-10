import * as httpErrorResponses from './http-responses.js'

const errors = {
    DEFAULT_ERROR: httpErrorResponses.httpDefaultError,
    USER_INSERTION: httpErrorResponses.httpErrorUserInsertion,
    USER_UPDATE: httpErrorResponses.httpErrorUserUpdate,
    USER_NOT_FOUND: httpErrorResponses.httpErrorUserNotFound,
    EMAIL_ALREADY_IN_USE: httpErrorResponses.httpErrorEmailAlreadyUsed,
    EMAIL_NOT_SENT: httpErrorResponses.httpErrorEmailNotSent,
    EMAIL_NOT_VERIFIED: httpErrorResponses.httpEmailNotVerified,
    LOGIN_INVALID_CREDENTIALS: httpErrorResponses.httpInvalidCredentials,
};

export {
    errors,
};

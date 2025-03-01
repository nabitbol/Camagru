
const validateEmail = (email) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);

const validateUsername = (username) => /^[a-zA-Z0-9]{3,}$/.test(username);

const validatePassword = (password) => /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(password);

export {
    validateEmail,
    validateUsername,
    validatePassword
}
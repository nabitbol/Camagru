import { validateEmail, validateUsername, validatePassword } from '@camagru/field-check';
import * as authService from '../../utils/auth-service.js'

const signup = async () => {
  const email = document.querySelector('#email').value;
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const passwordRepeat = document.querySelector('#password-repeat').value;
  const emailError = document.querySelector('#email-error');
  const usernameError = document.querySelector('#username-error');
  const passwordError = document.querySelector('#password-error');
  const passwordRepeatError = document.querySelector('#password-repeat-error');

  let hasErrors = false;
  emailError.classList.add('hidden');
  usernameError.classList.add('hidden');
  passwordError.classList.add('hidden');


  if (validateUsername(username) === false) {
    usernameError.classList.remove('hidden');
    hasErrors = true;
  }

  if (validateEmail(email) === false) {
    emailError.classList.remove('hidden');
    hasErrors = true;
  }

  if (validatePassword(password) === false) {
    passwordError.classList.remove('hidden');
    hasErrors = true;
  }

  if (password !== passwordRepeat) {
    passwordRepeatError.classList.remove('hidden');
    hasErrors = true;
  }

  if (hasErrors) return;

  try {
    await authService.signup({ email, username, password })
  } catch (err) {
    return console.error(err);
  }

  // window.location.replace('success.html');
}

/* ----------------------------- event listeners ---------------------------- */

const initializeEventListeners = () => {
  const signupButton = document.querySelector("#signup-button");

  signupButton.addEventListener('click', signup)
}

initializeEventListeners();

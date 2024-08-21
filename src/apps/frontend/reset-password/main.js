const resetPassword = async () => {
  const token = (new URLSearchParams(window.location.search)).get('token');

  const password = document.querySelector('#password').value;
  const passwordRepeat = document.querySelector('#password-repeat').value;
  const passwordError = document.querySelector('#password-error');
  const passwordRepeatError = document.querySelector('#password-repeat-error');

  let hasErrors = false;
  passwordError.classList.add('hidden');
  passwordRepeatError.classList.add('hidden');

  if (document.camagru.validatePassword(password) === false) {
    passwordError.classList.remove('hidden');
    hasErrors = true;
  }

  if (password !== passwordRepeat) {
    passwordRepeatError.classList.remove('hidden');
    hasErrors = true;
  }

  if (hasErrors) return;

  try {
    await document.camagru.fetch('POST', '/reset-password/send', { password, token });
  } catch (err) {
    return console.error(err);
  }

  window.location.replace('signin');
}
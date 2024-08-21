const signup = async () => {
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const emailError = document.querySelector('#email-error');
  const passwordError = document.querySelector('#password-error');
  const credentialsError = document.querySelector('#invalid-credentials-error');

  let hasErrors = false;
  emailError.classList.add('hidden');
  passwordError.classList.add('hidden');
  credentialsError.classList.add('hidden');

  if (document.camagru.validateEmail(email) === false) {
    emailError.classList.remove('hidden');
    hasErrors = true;
  }

  if (document.camagru.validatePassword(password) === false) {
    passwordError.classList.remove('hidden');
    hasErrors = true;
  }

  if (hasErrors) return;

  try {
    await document.camagru.fetch('POST', '/signin', { email, password })
  } catch (err) {
    credentialsError.classList.remove('hidden');
    return console.error(err);
  }

  window.location.replace('/galery')
}
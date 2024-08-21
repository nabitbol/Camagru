const requestPasswordReset = async () => {
  const email = document.querySelector('#email').value;
  const emailError = document.querySelector('#email-error');

  let hasErrors = false;
  emailError.classList.add('hidden');

  if (document.camagru.validateEmail(email) === false) {
    emailError.classList.remove('hidden');
    hasErrors = true;
  }

  if (hasErrors) return;

  try {
    await document.camagru.fetch('POST', '/reset-password/send', { email })
  } catch (err) {
    // credentialsError.classList.remove('hidden');
    // return;
  }

  window.location.replace('success.html')
}
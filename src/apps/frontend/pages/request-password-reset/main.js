import { validateEmail } from '@camagru/field-check';
import { apiCall } from "../../utils/api-services";

const requestPasswordReset = async () => {
  const email = document.querySelector('#email').value;
  const emailError = document.querySelector('#email-error');

  let hasErrors = false;
  emailError.classList.add('hidden');

  if (validateEmail(email) === false) {
    emailError.classList.remove('hidden');
    hasErrors = true;
  }

  if (hasErrors) return;

  try {
    await apiCall('POST', '/reset-password/send', { email });
  } catch (err) {
    return console.error(err);
  }

  window.location.replace('success.html');
}
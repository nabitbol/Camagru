const togglePasswordButtonVisibility = () => {
  const input = document.querySelector('.input-password input').value;
  const button = document.querySelector('.input-password button');
  const isEmptyInput = input === '';

  if (isEmptyInput) {
    button.classList.add('hidden');
  } else {
    button.classList.remove('hidden');
  }
}

const togglePasswordVisibility = () => {
  const inputPassword = document.querySelector('.input-password input');

  inputPassword.type =
    inputPassword.type === 'password'
      ? 'text'
      : 'password';
}

const initializePasswordVisibilityToggleListeners = () => {
  const input = document.querySelector('.input-password input');
  const button = document.querySelector('#password-button');

  input.addEventListener('input', togglePasswordButtonVisibility);
  button.addEventListener('click', togglePasswordVisibility);
}

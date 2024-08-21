document.camagru = {
  validateEmail: (email) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email),
  validatePassword: (password) => /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(password),
  fetch: async (method, url, body) => {
    console.log({ method, url, body })
    // return (await fetch(url, {
    //   method,
    //   body: JSON.stringify(body)
    // })).json();
  }
};
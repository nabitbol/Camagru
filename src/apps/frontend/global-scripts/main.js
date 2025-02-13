document.camagru = {
  validateEmail: (email) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email),

  validateUsername: (username) => /^[a-zA-Z0-9]*$/.test(username),

  validatePassword: (password) => /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(password),

  fetch: async (method, url, body) => {
    console.debug({ method, url, body })

    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(body)
      })

      const data = response.json()

      return data;
    } catch (err) {
      window.location.replace('/errors/500.html')
    }
  }
};
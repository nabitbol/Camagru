const token = (new URLSearchParams(window.location.search)).get('token');

if (!token) window.location.replace('/errors/401.html');

(async () => {
  try {
    document.camagru.fetch('POST', '/signup/verify-email', { token })
  } catch (err) {
    window.location.replace('/errors/401.html');
  }
})()
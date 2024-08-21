const token = (new URLSearchParams(window.location.search)).get('token');

if (!token) window.location.replace('forbidden');

(async () => {
  try {
    document.camagru.fetch('POST', '/signup/verify-email', { token })
  } catch (err) {
    window.location.replace('forbidden');
  }
})()
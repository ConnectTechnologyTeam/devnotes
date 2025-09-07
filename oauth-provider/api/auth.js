const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { GITHUB_CLIENT_ID, SITE_URL } = process.env;
  
  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({ error: 'GitHub Client ID not configured' });
  }

  const redirectUri = `${SITE_URL}/api/callback`;
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in a cookie for verification
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state}`;
  
  res.redirect(authUrl);
};

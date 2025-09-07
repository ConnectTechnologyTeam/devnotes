const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { code, state } = req.query;
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SITE_URL } = process.env;
  
  // Verify state parameter
  const cookieState = req.cookies?.oauth_state;
  if (!state || state !== cookieState) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || 'Failed to get access token' });
    }

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'decap-oauth'
      },
    });

    const userData = await userResponse.json();

    // Audit login to repo via Contents API
    try {
      const owner = process.env.REPO_OWNER;
      const repo = process.env.REPO_NAME;
      const path = 'data/user-logins.json';
      const token = process.env.REPO_ACCESS_TOKEN;

      let fileSha = null, json = {};
      let fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'cms-audit' }
      });
      if (fileRes.status === 200) {
        const file = await fileRes.json();
        fileSha = file.sha;
        json = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
      }

      const login = userData.login;
      const now = new Date().toISOString();
      const cur = json[login] || { loginCount: 0 };
      json[login] = {
        name: userData.name || cur.name || login,
        avatarUrl: userData.avatar_url || cur.avatarUrl || '',
        loginCount: (cur.loginCount || 0) + 1,
        lastLogin: now
      };

      const contentB64 = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');
      await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'cms-audit'
        },
        body: JSON.stringify({
          message: `chore(cms): update login for ${login}`,
          content: contentB64,
          sha: fileSha
        })
      });
    } catch (e) {
      console.error('Failed to audit login:', e);
    }
    
    // Create HTML page that posts message to parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'authorization',
              token: '${tokenData.access_token}',
              user: ${JSON.stringify(userData)}
            }, '*');
            window.close();
          </script>
          <p>Authentication successful! You can close this window.</p>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


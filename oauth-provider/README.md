# OAuth Provider for DevNotes Scribe

This is a minimal OAuth provider for GitHub authentication used by Decap CMS.

## Quick Setup

1. **Deploy to Vercel**:
   ```bash
   cd oauth-provider
   vercel --prod
   ```

2. **Set Environment Variables** in Vercel dashboard:
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret  
   - `SITE_URL`: Your Vercel deployment URL

3. **Update CMS config** with your Vercel URL in `public/admin/config.yml`

See the main [CMS_SETUP.md](../CMS_SETUP.md) for complete instructions.

## Setup Instructions

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: DevNotes Scribe CMS
   - **Homepage URL**: `https://YOUR_VERCEL_DOMAIN.vercel.app` (you'll get this after deployment)
   - **Authorization callback URL**: `https://YOUR_VERCEL_DOMAIN.vercel.app/api/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

### 2. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the OAuth provider:
   ```bash
   cd oauth-provider
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
   - `SITE_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

### 3. Update CMS Configuration

Update `public/admin/config.yml` with your repository and OAuth provider details:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO_NAME
  branch: main
  base_url: https://YOUR_VERCEL_DOMAIN.vercel.app
  site_url: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

### 4. Test the Setup

1. Visit `https://YOUR_SITE_URL/admin`
2. Click "Login with GitHub"
3. Complete the OAuth flow
4. You should be redirected back to the CMS admin interface

## How It Works

1. User clicks "Login with GitHub" in the CMS
2. CMS redirects to `/api/auth`
3. Auth endpoint redirects to GitHub OAuth with proper parameters
4. GitHub redirects back to `/api/callback` with authorization code
5. Callback endpoint exchanges code for access token
6. Token is sent back to CMS via postMessage API

## Security Notes

- State parameter is used to prevent CSRF attacks
- Tokens are only sent via secure postMessage to the parent window
- All cookies are set with HttpOnly and Secure flags
- State cookies expire after 10 minutes

## Troubleshooting

- **"Invalid state parameter"**: Check that cookies are enabled and the state parameter matches
- **"Authorization code not provided"**: GitHub OAuth might have been cancelled or failed
- **"Failed to get access token"**: Check that Client ID and Secret are correct
- **CMS not receiving token**: Check browser console for postMessage errors

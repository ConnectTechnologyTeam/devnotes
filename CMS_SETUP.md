# Decap CMS Setup Guide for DevNotes Scribe

This guide will help you set up Decap CMS with GitHub authentication and deploy your site to GitHub Pages.

## 🚀 Quick Start Checklist

- [ ] Create GitHub OAuth App
- [ ] Deploy OAuth provider to Vercel
- [ ] Update CMS configuration
- [ ] Enable GitHub Pages with Actions
- [ ] Test the complete flow

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Node.js installed locally
- Git repository with your code

## 🔧 Step-by-Step Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `DevNotes Scribe CMS`
   - **Homepage URL**: `https://YOUR_VERCEL_DOMAIN.vercel.app` (you'll get this after step 2)
   - **Authorization callback URL**: `https://YOUR_VERCEL_DOMAIN.vercel.app/api/callback`
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret** (you'll need these for step 2)

### 2. Deploy OAuth Provider to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the oauth-provider directory:
   ```bash
   cd oauth-provider
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables:
     - `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
     - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
     - `SITE_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

5. Note your Vercel deployment URL for the next step

### 3. Update CMS Configuration

Edit `public/admin/config.yml` and replace the placeholder values:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO_NAME  # Replace with your GitHub username and repo name
  branch: main
  base_url: https://YOUR_VERCEL_DOMAIN.vercel.app  # Replace with your Vercel URL
  site_url: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME  # Replace with your GitHub Pages URL
```

### 4. Update Content Utilities

Edit `src/lib/contentUtils.ts` and update the URLs:

```typescript
const getContentBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main';
  }
  
  return 'https://YOUR_USERNAME.github.io/YOUR_REPO_NAME';
};
```

### 5. Enable GitHub Pages with Actions

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select **"GitHub Actions"**
4. The workflow will automatically run on your next push to main

### 6. Test the Complete Flow

1. **Test OAuth Flow**:
   - Visit `https://YOUR_SITE_URL/admin`
   - Click "Login with GitHub"
   - Complete the OAuth flow
   - You should be redirected back to the CMS admin

2. **Test Content Creation**:
   - Create a new post in the CMS
   - Add some content and publish
   - Check that the file appears in your `content/posts/` directory

3. **Test Deployment**:
   - Push changes to main branch
   - Check GitHub Actions tab for deployment status
   - Visit your GitHub Pages URL to see the deployed site

## 🎯 How It Works

### Content Flow
1. **Write**: Use Decap CMS at `/admin` to create/edit content
2. **Store**: Content is saved as Markdown files in `content/` directory
3. **Images**: Uploaded images go to `public/uploads/`
4. **Deploy**: GitHub Actions builds and deploys to GitHub Pages

### Authentication Flow
1. User clicks "Login with GitHub" in CMS
2. Redirects to your Vercel OAuth provider
3. OAuth provider redirects to GitHub
4. GitHub redirects back with authorization code
5. OAuth provider exchanges code for access token
6. Token is sent back to CMS via postMessage

## 📁 File Structure

```
devnotes-scribe/
├── public/
│   ├── admin/
│   │   ├── index.html          # CMS interface
│   │   └── config.yml          # CMS configuration
│   └── uploads/                # Media uploads
├── content/
│   ├── posts/                  # Blog posts (Markdown)
│   └── pages/                  # Static pages (Markdown)
├── oauth-provider/             # Vercel serverless functions
│   ├── api/
│   │   ├── auth.js            # OAuth initiation
│   │   └── callback.js        # OAuth callback
│   └── package.json
├── .github/workflows/
│   └── pages.yml              # GitHub Actions deployment
└── src/lib/
    └── contentUtils.ts        # Content loading utilities
```

## 🔧 Customization

### Adding New Content Types

To add a new content type (e.g., "projects"), add to `public/admin/config.yml`:

```yaml
collections:
  # ... existing collections ...
  - name: "projects"
    label: "Projects"
    folder: "content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Body", name: "body", widget: "markdown"}
```

### Customizing the UI

The CMS uses your existing React components. You can:
- Modify `src/pages/Posts.tsx` to change how posts are displayed
- Add new routes in `src/App.tsx`
- Customize styling with Tailwind CSS

### Build-Time Content Loading

For better performance, you can implement build-time content loading:

1. Create a build script that reads all content files
2. Generate static data files
3. Import these files in your components

Example build script (`scripts/build-content.js`):
```javascript
const fs = require('fs');
const path = require('path');

// Read all posts and generate index
const postsDir = path.join(__dirname, '../content/posts');
const posts = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    // Parse frontmatter and return post data
    return { slug: file.replace('.md', ''), ...parsedData };
  });

fs.writeFileSync(
  path.join(__dirname, '../src/data/posts.json'),
  JSON.stringify(posts, null, 2)
);
```

## 🐛 Troubleshooting

### Common Issues

**"Invalid state parameter"**
- Check that cookies are enabled
- Verify the state parameter matches between auth and callback

**"Authorization code not provided"**
- GitHub OAuth might have been cancelled
- Check that callback URL is correct

**"Failed to get access token"**
- Verify Client ID and Secret are correct
- Check that environment variables are set in Vercel

**CMS not receiving token**
- Check browser console for postMessage errors
- Verify that the OAuth provider is deployed and accessible

**Content not loading**
- Check that content URLs are correct in `contentUtils.ts`
- Verify that files exist in the `content/` directory
- Check GitHub Pages deployment status

### Debug Mode

Enable debug mode in the CMS by adding to `public/admin/config.yml`:

```yaml
backend:
  # ... other config ...
  auth_type: implicit  # For debugging
```

## 📚 Additional Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions)
- [GitHub Pages with Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)

## 🎉 You're All Set!

Once everything is configured, you can:

1. Visit `/admin` to manage content
2. Create posts and pages through the CMS
3. Images will be uploaded to `/uploads`
4. Content will be automatically deployed to GitHub Pages
5. Your existing React UI will continue to work unchanged

Happy content creating! 🚀

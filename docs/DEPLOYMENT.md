# Deployment Guide

This guide covers deploying the BGS World Mineral Statistics Dashboard to GitHub Pages and GitLab Pages.

## Prerequisites

- Git repository (GitHub or GitLab)
- Project built locally (`bun run build` should work without errors)

## GitHub Pages Deployment

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
4. The workflow will automatically run on the next push

### Step 3: Configure Site URL (if needed)

If your repository is not at the root (e.g., `username.github.io/repo-name`):

Edit `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://YOUR-USERNAME.github.io',
  base: '/YOUR-REPO-NAME',
  // ... rest of config
});
```

Then commit and push:
```bash
git add astro.config.mjs
git commit -m "Configure site URL for GitHub Pages"
git push
```

### Step 4: Access Your Site

After the workflow completes (check Actions tab), your site will be available at:
- Root repository: `https://YOUR-USERNAME.github.io`
- Project repository: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME`

## GitLab Pages Deployment

### Step 1: Push to GitLab

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Add GitLab remote
git remote add origin https://gitlab.com/YOUR-USERNAME/YOUR-PROJECT-NAME.git
git branch -M main
git push -u origin main
```

### Step 2: CI/CD Pipeline

The `.gitlab-ci.yml` file is already configured. The pipeline will:
1. Install dependencies using Bun
2. Build the project
3. Deploy to GitLab Pages

Watch the pipeline progress:
- Go to CI/CD > Pipelines in your GitLab project

### Step 3: Configure Site URL (if needed)

If your project is not at the root:

Edit `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://YOUR-USERNAME.gitlab.io',
  base: '/YOUR-PROJECT-NAME',
  // ... rest of config
});
```

Then commit and push:
```bash
git add astro.config.mjs
git commit -m "Configure site URL for GitLab Pages"
git push
```

### Step 4: Access Your Site

After the pipeline succeeds, your site will be available at:
- `https://YOUR-USERNAME.gitlab.io/YOUR-PROJECT-NAME`

You can also find the URL in:
- Settings > Pages in your GitLab project

## Troubleshooting

### GitHub Pages

**Issue**: 404 errors on page routes
- **Solution**: Check that `base` in `astro.config.mjs` matches your repository name

**Issue**: Workflow fails
- **Solution**: Check the Actions tab for error logs
- Ensure repository has Pages enabled in Settings

**Issue**: CSS/JS not loading
- **Solution**: Verify `site` and `base` configuration in `astro.config.mjs`

### GitLab Pages

**Issue**: Pipeline fails at build step
- **Solution**: Check pipeline logs in CI/CD > Pipelines
- Ensure `.gitlab-ci.yml` is in the root directory

**Issue**: Assets not loading
- **Solution**: Check `base` configuration matches project name

**Issue**: Page shows 404
- **Solution**: Verify pipeline completed successfully
- Check that `public` directory was created and contains files

## Local Testing

Before deploying, test the production build locally:

```bash
# Build the project
bun run build

# Preview the production build
bun run preview
```

Open `http://localhost:4321` to verify everything works.

## Custom Domains

### GitHub Pages

1. Add a `CNAME` file to the `public/` directory:
   ```
   your-custom-domain.com
   ```

2. Configure DNS with your domain provider:
   - Add an `A` record pointing to GitHub's IPs
   - Or add a `CNAME` record pointing to `YOUR-USERNAME.github.io`

3. Update `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://your-custom-domain.com',
     // Remove or set base to '/'
   });
   ```

### GitLab Pages

1. Go to Settings > Pages in your GitLab project
2. Click "New Domain"
3. Enter your custom domain
4. Configure DNS as instructed by GitLab
5. Update `astro.config.mjs` with your custom domain

## Automated Deployments

Both platforms support automatic deployments:

- **GitHub**: Pushes to `main` trigger the workflow automatically
- **GitLab**: Pushes to `main` trigger the CI/CD pipeline automatically

To disable automatic deployments:
- **GitHub**: Delete or disable the workflow in `.github/workflows/deploy.yml`
- **GitLab**: Disable Auto DevOps in Settings > CI/CD

## Environment Variables

This project doesn't require environment variables for deployment. All API calls are handled client-side or through the included API route.

## Performance Optimization

The built site includes:
- Minified JavaScript and CSS
- Optimized assets
- Static HTML generation
- Code splitting for React components

Total bundle size: ~250-300KB (gzipped)

## Support

For deployment issues:
- GitHub: Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- GitLab: Check [GitLab Pages documentation](https://docs.gitlab.com/ee/user/project/pages/)

---

**Last Updated**: November 7, 2025

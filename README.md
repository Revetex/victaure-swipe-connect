# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/052296aa-8ca7-44bf-8824-632071249d15

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/052296aa-8ca7-44bf-8824-632071249d15) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment

This project is configured for optimal deployment on Vercel. Here are some key features:

- **Automatic deployments**: Every push to the main branch triggers a deployment
- **Preview deployments**: Pull requests automatically get preview deployments
- **Asset optimization**: Static assets are automatically optimized and cached
- **Smart CDN**: Content is served from edge locations worldwide

### Environment Variables

Make sure to set these environment variables in your Vercel project:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Performance Optimizations

The build process includes:

- Code splitting and lazy loading
- Automatic chunk optimization
- Asset compression and caching
- Tree shaking for smaller bundle sizes

### Monitoring

Monitor your deployment:

1. Check build logs in Vercel dashboard
2. Monitor performance in Vercel Analytics
3. Set up alerts for deployment failures

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Custom Domain Setup

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
# ResumeIQ - AI-Powered Interview Question Generator

A professional tool that analyzes resumes and generates tailored interview questions using AI.

## Project Info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Technologies Used

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Backend**: Supabase Edge Functions (hosted on Lovable Cloud)
- **AI**: Google Gemini via Lovable AI Gateway

## Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables

This project requires the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Yes |

---

## Deploying to DigitalOcean App Platform

This section provides step-by-step instructions to deploy ResumeIQ to DigitalOcean App Platform.

### Prerequisites

1. A [DigitalOcean account](https://cloud.digitalocean.com/)
2. A GitHub account with this repository connected
3. Your Supabase credentials (URL and publishable key)

### Deployment Steps

#### 1. Push Code to GitHub

Ensure your code is committed and pushed to the `main` branch:

```sh
git add .
git commit -m "Prepare for DigitalOcean deployment"
git push origin main
```

#### 2. Create App in DigitalOcean

1. Log in to [DigitalOcean Cloud Console](https://cloud.digitalocean.com/)
2. Navigate to **Apps** in the left sidebar
3. Click **Create App**
4. Select **GitHub** as the source
5. Authorize DigitalOcean to access your GitHub repositories
6. Select the repository containing this project
7. Choose the `main` branch

#### 3. Configure Build Settings

App Platform should auto-detect this as a Node.js app. Verify/configure:

| Setting | Value |
|---------|-------|
| **Source Directory** | `/` (root) |
| **Build Command** | `npm run build` |
| **Run Command** | `node server.js` |
| **HTTP Port** | `8080` |
| **HTTP Request Routes** | `/` |

#### 4. Configure Environment Variables

Before deploying, add these environment variables in App Platform:

1. In the app configuration, go to **Settings** → **App-Level Environment Variables**
2. Add the following variables:

| Key | Value | Encrypt |
|-----|-------|---------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | No |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOi...` | No |
| `NODE_ENV` | `production` | No |

> **Note**: These are publishable keys, so encryption is optional. The Edge Functions and secrets remain hosted on Lovable Cloud/Supabase.

#### 5. Configure Health Check

In the app settings, configure the health check:

| Setting | Value |
|---------|-------|
| **HTTP Path** | `/health` |
| **Initial Delay** | `10` seconds |
| **Period** | `10` seconds |
| **Timeout** | `5` seconds |
| **Success Threshold** | `1` |
| **Failure Threshold** | `3` |

#### 6. Review and Deploy

1. Review the configuration summary
2. Choose your plan (Basic or Pro)
3. Click **Create Resources**
4. Wait for the build and deployment to complete

#### 7. Post-Deployment

After successful deployment:

1. **Test the health endpoint**: Visit `https://your-app.ondigitalocean.app/health`
2. **Test the application**: Visit your app URL and try uploading a resume
3. **Add custom domain** (optional): Go to **Settings** → **Domains** → **Add Domain**

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DigitalOcean App Platform                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Web Service                         │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │  server.js  │───▶│  Static Files (React SPA)   │  │  │
│  │  │  (Express)  │    │  Built with Vite             │  │  │
│  │  └─────────────┘    └──────────────────────────────┘  │  │
│  │         │                                              │  │
│  │         ▼                                              │  │
│  │  /health endpoint                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Lovable Cloud (Supabase)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Edge Functions (analyze-resume)          │  │
│  │  • PDF parsing                                        │  │
│  │  • AI analysis via Lovable AI Gateway                │  │
│  │  • n8n webhook integration                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check that all dependencies are in `package.json` |
| App crashes on start | Verify `server.js` exists and `node server.js` is the run command |
| Health check fails | Ensure port 8080 is configured and `/health` returns JSON |
| API calls fail | Verify environment variables are set correctly |
| CORS errors | The Edge Functions are on Lovable Cloud; ensure CORS headers are configured |

### Alternative: Static Site Deployment

If you prefer to deploy as a Static Site (simpler, no server):

1. During app creation, change component type from **Web Service** to **Static Site**
2. Set **Output Directory** to `dist`
3. Set **Build Command** to `npm run build`
4. Remove the Run Command (not needed for static sites)
5. Note: Health checks work differently for static sites (just checks if site responds)

---

## Editing the Code

### Use Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

### Use Your Preferred IDE

Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

### Edit Directly in GitHub

Navigate to the desired file(s), click the "Edit" button, make changes, and commit.

## Custom Domain

To connect a custom domain in Lovable, navigate to Project > Settings > Domains and click Connect Domain.

For DigitalOcean, go to Settings > Domains in your app's dashboard.

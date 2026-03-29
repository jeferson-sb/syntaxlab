# Deployment Design: Cloudflare Pages + Render (Docker) + MongoDB Atlas

## Overview

Deploy SyntaxLab as a split architecture:
- **Frontend (Vue SPA):** Cloudflare Pages — global CDN, auto-deploy from Git
- **Backend (Elysia API):** Render free tier — Dockerized, auto-deploy from Git
- **Database:** MongoDB Atlas free tier (M0) — user's existing account

The backend is only needed for authentication and data sync, so Render's free tier cold starts (~50s after 15min inactivity) are acceptable.

## Frontend: Cloudflare Pages

### Setup

1. Connect GitHub repo to Cloudflare Pages
2. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `bun install && bun run build --filter=web`
   - **Build output directory:** `apps/web/dist`
   - **Root directory:** `/` (monorepo root)

### Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_BACKEND_URL` | `https://<your-app>.onrender.com` |

### Behavior

- Auto-deploys on push to `main`
- Preview deployments on pull requests
- Served from Cloudflare's global edge network

## Backend: Render with Docker

### Why Docker

The backend has no build step — Bun runs TypeScript directly. A Dockerfile gives explicit control over the runtime environment and makes the setup reproducible.

### Dockerfile

Multi-stage Dockerfile at repo root (`Dockerfile`):

- **Stage 1 (install):** `oven/bun` base, copy monorepo root `package.json`, `bun.lock`, and both app `package.json` files, run `bun install --frozen-lockfile`
- **Stage 2 (runtime):** Slim `oven/bun` image, copy `node_modules` and backend `src/`, run `bun run src/index.ts`

No build step needed — Bun executes `.ts` files natively.

### Render Configuration

- **Service type:** Web Service
- **Environment:** Docker
- **Dockerfile path:** `Dockerfile` (at repo root — Render uses repo root as Docker context)
- **Docker context:** Repository root (monorepo needs root context for workspace resolution)
- **Health check path:** `/api` (OpenAPI docs endpoint)

### Environment Variables (set in Render dashboard)

| Variable | Value |
|----------|-------|
| `SERVER_PORT` | `10000` (Render default) |
| `MONGODB_CONNECT_URL` | Atlas connection string |
| `GEMINI_API_KEY` | Your Gemini API key |
| `BETTER_AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://<your-app>.onrender.com` |
| `FRONTEND_URL` | `https://<your-app>.pages.dev` |
| `GITHUB_CLIENT_ID` | From GitHub OAuth app |
| `GITHUB_CLIENT_SECRET` | From GitHub OAuth app |
| `GOOGLE_CLIENT_ID` | From Google OAuth client |
| `GOOGLE_CLIENT_SECRET` | From Google OAuth client |

## MongoDB Atlas

### Network Access

Add `0.0.0.0/0` to the IP Access List. Render free tier uses dynamic IPs so a specific allowlist isn't possible. Use database user credentials as the security boundary.

### Connection String

Use the Atlas SRV format:
```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/syntaxlab_db?retryWrites=true&w=majority
```

Set as `MONGODB_CONNECT_URL` in Render environment variables.

## OAuth Provider Configuration

Create **separate OAuth apps for production** (keep existing ones for local dev).

### GitHub OAuth App

Location: github.com > Settings > Developer settings > OAuth Apps > New

| Field | Value |
|-------|-------|
| Homepage URL | `https://<your-app>.pages.dev` |
| Authorization callback URL | `https://<your-app>.onrender.com/api/auth/callback/github` |

### Google OAuth Client

Location: console.cloud.google.com > APIs & Services > Credentials > Create OAuth client ID

| Field | Value |
|-------|-------|
| Authorized JavaScript origins | `https://<your-app>.pages.dev` |
| Authorized redirect URIs | `https://<your-app>.onrender.com/api/auth/callback/google` |

## CORS & Auth URLs

No code changes needed. Everything is driven by environment variables:

- **CORS:** Elysia's CORS plugin reads `FRONTEND_URL` to set allowed origins
- **Better Auth:** `BETTER_AUTH_URL` defines the backend's public URL for constructing callbacks. `FRONTEND_URL` handles post-auth redirects
- **Eden client:** The frontend reads `VITE_BACKEND_URL` at build time to know where the API lives

## What Needs to Be Created

1. `Dockerfile` (repo root) — multi-stage Dockerfile for the Elysia backend
2. `.dockerignore` (repo root) — exclude unnecessary files from Docker context

No other code changes are anticipated. The app is already env-var driven for all deployment-relevant configuration.

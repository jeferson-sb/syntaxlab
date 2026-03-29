# Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Docker configuration needed to deploy the Elysia backend on Render, and update .gitignore for deployment artifacts.

**Architecture:** Multi-stage Dockerfile at repo root using `oven/bun` base image. No build step — Bun runs TypeScript directly. The Dockerfile copies only what the backend needs from the monorepo workspace.

**Tech Stack:** Docker, Bun, Elysia

**Spec:** `docs/superpowers/specs/2026-03-28-deployment-design.md`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `Dockerfile` | Multi-stage Docker image for the Elysia backend |
| Create | `.dockerignore` | Exclude unnecessary files from Docker build context |
| Modify | `.gitignore` | Add Docker-related ignores |

---

### Task 1: Create .dockerignore

**Files:**
- Create: `.dockerignore`

- [ ] **Step 1: Create `.dockerignore`**

```dockerignore
node_modules
.turbo
.git
.gitignore
*.md
docs
apps/web
.env
.env.*
docker-compose.yml
init
```

This excludes the frontend app, docs, git history, node_modules (we install fresh in Docker), and local env files from the build context.

- [ ] **Step 2: Commit**

```bash
git add .dockerignore
git commit -m "chore: add .dockerignore for backend deployment"
```

---

### Task 2: Create Dockerfile

**Files:**
- Create: `Dockerfile`

- [ ] **Step 1: Create the Dockerfile**

```dockerfile
FROM oven/bun:1.3.5-slim AS install

WORKDIR /app

# Copy workspace root files needed for dependency resolution
COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# --- Runtime stage ---
FROM oven/bun:1.3.5-slim

WORKDIR /app

COPY --from=install /app/node_modules node_modules
COPY --from=install /app/apps/backend/node_modules apps/backend/node_modules
COPY apps/backend/src apps/backend/src
COPY apps/backend/package.json apps/backend/package.json
COPY apps/backend/tsconfig.json apps/backend/tsconfig.json

ENV NODE_ENV=production

EXPOSE 10000

CMD ["bun", "run", "apps/backend/src/index.ts"]
```

Key decisions:
- `oven/bun:1.3.5-slim` matches the project's `packageManager` version
- `--production` flag skips devDependencies (only `typescript` which isn't needed at runtime since Bun strips types natively)
- Copies both root and backend `node_modules` because Bun workspace hoists some deps to root
- Exposes port 10000 (Render's default)
- No build step — Bun runs `.ts` files directly

- [ ] **Step 2: Build the image locally to verify it works**

```bash
docker build -t syntaxlab-backend .
```

Expected: Image builds successfully with no errors.

- [ ] **Step 3: Test the image runs (it will fail to connect to MongoDB, but should start)**

```bash
docker run --rm -e MONGODB_CONNECT_URL="mongodb://localhost:27017/test" -e SERVER_PORT=10000 -p 10000:10000 syntaxlab-backend
```

Expected: The process starts and logs an error about MongoDB connection (since localhost inside the container won't have MongoDB). This confirms Bun can resolve all imports and the entrypoint works. Press Ctrl+C to stop.

- [ ] **Step 4: Test with local MongoDB (full integration)**

Start the local MongoDB first if not running (`docker compose up -d`), then:

```bash
docker run --rm --network host -e MONGODB_CONNECT_URL="mongodb://syntaxlab:syntaxlab@127.0.0.1:27017/syntaxlab_db?authSource=admin&directConnection=true" -e SERVER_PORT=10000 syntaxlab-backend
```

Expected: `🦊 Elysia is running at localhost:10000`. Hit `http://localhost:10000/api` in a browser to see the OpenAPI docs page. Press Ctrl+C to stop.

- [ ] **Step 5: Commit**

```bash
git add Dockerfile
git commit -m "feat: add Dockerfile for backend deployment on Render"
```

---

### Task 3: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Append Docker-related entries to `.gitignore`**

Add to the end of `.gitignore`:

```gitignore

# Docker
docker-compose.override.yml
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: update .gitignore with docker entries"
```

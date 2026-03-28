FROM oven/bun:1.3.5-slim AS install

WORKDIR /app

# Copy workspace root files needed for dependency resolution
COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/web/package.json apps/web/package.json

# Install production dependencies only
RUN bun install --frozen-lockfile --production --ignore-scripts

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

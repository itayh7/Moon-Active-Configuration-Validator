# syntax=docker/dockerfile:1
# Multi-stage build: Fastify API + built React client served from one container.

# Stage 1 — compile the server (TS → dist/).
FROM node:20-alpine AS server-build
WORKDIR /app
COPY server/package.json ./
RUN npm install
COPY server/tsconfig.json ./
COPY server/src ./src
# tsc emits only .ts → .js; the runtime resolves prompts/system.md
# relative to dist, so copy that static file alongside the compiled JS.
RUN npm run build && cp -r src/prompts dist/prompts

# Stage 2 — build the client (Vite → dist/).
# VITE_API_URL is empty so the bundled axios client hits the same origin
# Fastify serves the page from (no CORS, single port).
FROM node:20-alpine AS client-build
WORKDIR /app
COPY client/package.json ./
RUN npm install
COPY client/tsconfig.json client/tsconfig.app.json client/tsconfig.node.json ./
COPY client/vite.config.ts client/index.html ./
COPY client/src ./src
ENV VITE_API_URL=""
RUN npm run build

# Stage 3 — runtime: server + client bundled together.
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CLIENT_DIST_DIR=/app/client-dist
COPY server/package.json ./
RUN npm install --omit=dev
COPY --from=server-build /app/dist ./dist
COPY --from=client-build /app/dist ./client-dist
COPY server/data ./data
EXPOSE 3000
CMD ["node", "dist/index.js"]

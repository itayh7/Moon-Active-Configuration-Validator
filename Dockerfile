# syntax=docker/dockerfile:1
# Two-stage build for the Configuration Validator server (Fastify + TS).
# The client is intended for local dev and is not packaged here.

FROM node:20-alpine AS build
WORKDIR /app
COPY server/package.json ./
RUN npm install
COPY server/tsconfig.json ./
COPY server/src ./src
# tsc emits only .ts → .js; the runtime resolves prompts/system.md
# relative to dist, so copy that static file alongside the compiled JS.
RUN npm run build && cp -r src/prompts dist/prompts

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY server/package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY server/data ./data
EXPOSE 3000
CMD ["node", "dist/index.js"]

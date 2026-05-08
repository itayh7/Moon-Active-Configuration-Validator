# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Moon Active **Configuration Validator** — currently a hello-world foundation for an upcoming game-config validation tool. It exercises the full stack (Fastify ↔ React ↔ OpenAI ↔ AJV) end to end so feature work can drop into a known-good shell.

## Architecture

Monorepo using **npm workspaces**. Two packages: `server/` and `client/`.

### Server (`server/`)
- **Runtime:** Node 20+ ESM (`"type": "module"`), Fastify 5.
- **Entry:** `server/src/index.ts` — bootstraps Fastify, registers `@fastify/cors`, installs a global error handler, mounts route modules, listens on `:3000`.
- **Routes:** one file per route module under `server/src/routes/` (e.g. `health.ts`). Each module exports a `register*Route(app)` function called from `index.ts`.
- **External integrations:** isolated under `server/src/lib/` (e.g. `openai.ts`). The OpenAI client is lazily constructed and falls back to a hard-coded message when `OPENAI_API_KEY` is missing — so the dev loop works without credentials.
- **Validation:** `ajv` + `ajv-formats` are wired in but not yet used. Future schemas live under `server/src/schemas/` and are compiled once at startup, not per-request.
- **Config:** `dotenv/config` is imported at the top of `index.ts`. Real secrets in `server/.env` (gitignored); shape documented in `server/.env.example`.

### Client (`client/`)
- **Build:** Vite 6 + React 19 + TypeScript.
- **State:** MobX (`mobx` + `mobx-react-lite`). Stores are plain classes using `makeAutoObservable`; instances are composed in `RootStore` and provided via React context (`stores/StoreContext.tsx`).
- **UI library:** Material UI (`@mui/material`). All visual primitives come from MUI — components in this repo never render raw HTML tags.
- **API:** axios instance in `src/api/`. Base URL is read from `VITE_API_URL` (default `http://localhost:3000`).

### Component organization rules (mandatory)

These rules are project conventions, not suggestions. New code must follow them:

1. **One component per file.** A file exports exactly one React component (plus its props type). No co-locating multiple components.
2. **`src/definitions/`** holds constants only — colors, theme, env-derived endpoints, magic numbers. No JSX, no logic.
3. **`src/common/`** holds reusable UI primitives (buttons, badges, cards, text wrappers). If a component is used in 2+ places, it belongs here.
4. **`src/stores/`** holds all mutable state. Components must not own state with `useState` for app data — read from a MobX store via `useRootStore()` / `useHealthStore()`. Local-only UI ephemera (e.g. an open/closed toggle for a menu) may stay in component state.
5. **No raw HTML in feature components.** Files under `src/components/` and `src/App.tsx` compose only React components — never `<div>`, `<span>`, `<h1>`, etc. directly. If a layout primitive is missing, add it to `src/common/` or `src/layout/` wrapping the necessary MUI/HTML, then import the wrapper.
6. **Components that read store state must be wrapped in `observer(...)`** from `mobx-react-lite`, otherwise MobX updates won't re-render them.

## Commands

Run from the repo root unless noted.

```bash
# install everything (workspaces handle server + client)
npm install

# dev (server :3000 + client :5173 concurrently)
npm run dev

# dev one side only
npm run dev:server
npm run dev:client

# typecheck both packages
npm run typecheck

# production build
npm run build
```

Workspace-scoped commands: `npm --workspace server run <script>` / `npm --workspace client run <script>`.

## Environment

Copy `server/.env.example` to `server/.env` and fill `OPENAI_API_KEY`. Without it, `/health` still responds 200 but returns a static fallback message instead of an LLM-generated one — useful for offline dev.

## Adding things

- **New route:** create `server/src/routes/<name>.ts` exporting `register<Name>Route(app)`, then call it from `index.ts`. Keep route handlers thin; push business logic into `server/src/lib/`.
- **New store:** add a class in `client/src/stores/`, instantiate it in `RootStore`, and export a `use<Name>Store()` hook from `StoreContext.tsx`.
- **New shared component:** add to `client/src/common/` and import where needed. Don't duplicate.
- **New constants:** add to `client/src/definitions/` — never inline magic strings/numbers in components.

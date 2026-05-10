# Moon Active — Configuration Validator

This README contains both my **insights** from this project and the **setup instructions**. Insights come first so they are not missed.

---

## Insights & key decisions

- **How I worked** - 
- **Zod over AJV** - Zod is the closest npm equivalent to Pydantic; it gives one source of truth for input validation, LLM structured output, and TypeScript types.
- **Static system prompt + dynamic user prompt** - `server/src/prompts/system.md` is loaded once at process start and never mutates; the user prompt is built per request from the current Reference Balancing Ranges and the validated configuration. This is the best practice I familiar with.
- **Persona = senior game economy and level designer** - focuses the LLM on balance, pacing, progression, and economy concerns rather than generic schema critique.
- **Soft anchors, qualitative reasoning** - Reference Balancing Ranges are framed as "usually / typically", not hard cutoffs, leaving room for designer intent.
- **Reference Balancing Ranges live server-side** - read and re-validated on every request so a corrupt edit surfaces immediately and clients do not have to ship them.
- **`total_levels` makes "higher levels are harder" concrete** - the assignment says "higher levels are harder" but never says higher relative to what; passing `total_levels` lets the LLM reason about early/mid/late progression.
- **No `overall_verdict` field** - OpenAI's `strict: true` cannot enforce cross-field invariants, so the verdict is derived from `findings.length` to avoid the model contradicting itself.
- **Confidence semantics shift between branches** - when `findings` is non-empty, `confidence` is the mean of per-finding confidences; when empty, it is `verdict_confidence` (how sure the model is that nothing is wrong).
- **Model dropdown only allows OpenAI structured-output models** - `gpt-3.5-turbo` is intentionally excluded because it lacks JSON-Schema structured outputs.
- **`temperature` is intentionally not sent** - `gpt-5` and the o-series reasoning models reject any non-default value; omitting `temperature`/`top_p` keeps the allowlist open without per-model branching.
- **Browser console prints input/output JSONs** - every `POST /validate-config` from the UI logs its request payload and the server response so a reviewer can inspect the wire data directly in DevTools.
- **Game-economy context is abstract by design** - a real deployment would inject coin value and IAP price ladders so "economy risk" reasoning could refer to actual revenue impact.
- **Process is in `specs/`** - the `specs/` folder contains the assignment, brainstorming, and the iterated plans that produced this implementation.

---

## Setup

### 1. Prerequisites

- Node.js 20+ (`node --version`)
- npm
- An OpenAI API key

### 2. Install (root + workspaces in one go)

```bash
npm install
```

### 3. Configure the LLM API key

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set:

```
OPENAI_API_KEY=sk-...
```

`server/.env` is git-ignored. Without a key, `POST /validate-config` returns **502**.

### 4. Run

```bash
npm run dev          # server (:3000) + client (:5173)
npm run dev:server   # server only
npm run dev:client   # client only
```

| What                | URL                                         |
| ------------------- | ------------------------------------------- |
| Client UI           | http://localhost:5173                       |
| Health              | http://localhost:3000/health                |
| Validate a config   | http://localhost:3000/validate-config       |

### 5. Docker (optional)

The repo ships a `Dockerfile` that builds and runs the **server** alone (the client still runs locally with `npm run dev:client` if you want the UI):

```bash
docker build -t config-validator .
docker run --rm -p 3000:3000 -e OPENAI_API_KEY=sk-... config-validator
```

The container exposes the API on `localhost:3000` (`/validate-config`, `/models`, `/reference-ranges`, `/health`).

---

## Examples

End-to-end input/output examples (the three assignment cases plus five additional ones covering the rules in `server/src/prompts/system.md`) live in [`notebooks/validate_config_examples.ipynb`](./notebooks/validate_config_examples.ipynb). Open the notebook to see the full request/response JSON for each case.

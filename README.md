# Moon Active — Configuration Validator

A small Node.js microservice that validates a single game level configuration
two ways:

1. **Schema validation** — strict shape check on the request body.
2. **LLM analysis** — an OpenAI model reasons about balance, pacing,
   progression, and economy risks the schema cannot catch, returning a
   short analysis, suggested actions, and a confidence score.

The repo is a monorepo (`server/` + `client/`) wired with npm workspaces.
This README focuses on the service. The React/MUI client is included in
the same repo; project conventions for both packages live in
[`CLAUDE.md`](./CLAUDE.md).

---

## Prerequisites

- **Node.js 20 or newer** (`node --version`)
- npm (ships with Node)
- An **OpenAI API key** with access to `gpt-4o-mini` and/or `gpt-4o`
  (structured-output models)

## Install

From the repo root:

```bash
npm install
```

This installs the root, `server`, and `client` workspaces in one go.

## Configure the LLM API key

Copy the example env file and add your key:

```bash
cp server/.env.example server/.env
```

Then open `server/.env` and set:

```
OPENAI_API_KEY=sk-...
```

`server/.env` is git-ignored. If `OPENAI_API_KEY` is missing, `/health`
still serves a static fallback string, but `POST /validate-config`
returns **502** because the LLM call cannot be made.

Optional env vars (defaults shown):

```
PORT=3000
HOST=0.0.0.0
```

## Run

From the repo root:

```bash
# server (:3000) + client (:5173) together
npm run dev

# server only
npm run dev:server

# client only
npm run dev:client
```

Other workspace scripts:

```bash
npm run typecheck     # both packages
npm run build         # production build, both packages
```

Endpoints once running:

| What                        | URL                                       |
| --------------------------- | ----------------------------------------- |
| Health                      | `GET  http://localhost:3000/health`       |
| Validate a config           | `POST http://localhost:3000/validate-config` |
| Client (UI scaffold)        | `http://localhost:5173`                   |

---

## API: `POST /validate-config`

### Request

`Content-Type: application/json`

Body — exactly the four fields, no extras:

```json
{
  "level": 12,
  "time_limit": 60,
  "reward": 5000,
  "difficulty": "easy"
}
```

Optional query string for **model selection**:

```
?model=gpt-4o-mini   # default
?model=gpt-4o
```

The server enforces a small allowlist of models that support OpenAI
structured outputs. Unknown values fall back to the default.

### Success response (200)

```json
{
  "schema_validation": { "valid": true, "errors": [] },
  "llm_feedback": {
    "analysis": "<one short paragraph>",
    "suggested_actions": ["...", "..."],
    "confidence": 0.0
  }
}
```

- `analysis` — 1–4 sentence plain-language read of the configuration.
- `suggested_actions` — one entry per finding; if the configuration is
  fine, the array is `["No action needed"]`.
- `confidence` — `[0, 1]`, rounded to 2 decimals. When findings exist,
  it is the **mean** of per-finding confidences. When findings are
  empty, it is the model's **verdict confidence** (how sure it is that
  nothing is wrong). See [Confidence semantics](#confidence-semantics).

### Error responses

| Status | When                                                                 | Body                                                                 |
| ------ | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **400** | Body fails the input schema (Zod). LLM is **not** called.            | `{ "schema_validation": { "valid": false, "errors": [...] } }`       |
| **500** | `server/data/reference-ranges.json` is missing/empty/malformed.      | `{ "status": "error", "message": "..." }`                            |
| **502** | LLM API error, missing API key, or malformed structured output.      | `{ "status": "error", "message": "..." }`                            |

---

## Example commands

The three canonical examples from `specs/assignment.md`. Run with the
server up.

### 1) Reward too high for an easy level

```bash
curl -s -X POST http://localhost:3000/validate-config \
  -H "Content-Type: application/json" \
  -d '{"level":12,"time_limit":60,"reward":5000,"difficulty":"easy"}'
```

### 2) Time limit too tight for a hard level

```bash
curl -s -X POST http://localhost:3000/validate-config \
  -H "Content-Type: application/json" \
  -d '{"level":5,"time_limit":10,"reward":500,"difficulty":"hard"}'
```

### 3) Reasonable starting level (expect empty findings)

```bash
curl -s -X POST http://localhost:3000/validate-config \
  -H "Content-Type: application/json" \
  -d '{"level":1,"time_limit":120,"reward":100,"difficulty":"easy"}'
```

### Pick a different model

```bash
curl -s -X POST 'http://localhost:3000/validate-config?model=gpt-4o' \
  -H "Content-Type: application/json" \
  -d '{"level":1,"time_limit":120,"reward":100,"difficulty":"easy"}'
```

### Trigger a 400 (schema failure)

```bash
curl -s -i -X POST http://localhost:3000/validate-config \
  -H "Content-Type: application/json" \
  -d '{"level":"oops"}'
```

---

## Reference Balancing Ranges

The reference ranges referenced in the assignment live server-side, not
in the request body, so a deployment can tune them per game without
clients sending them every call. They are read and re-validated on
**every** `POST /validate-config` so a corrupt edit surfaces
immediately.

File: `server/data/reference-ranges.json`

```json
{
  "difficulties": {
    "easy":   { "reward_min": 100,  "reward_max": 500,  "time_limit_min": 30 },
    "medium": { "reward_min": 500,  "reward_max": 2000, "time_limit_min": 20, "time_limit_max": 60 },
    "hard":   { "reward_min": 2000, "reward_max": 5000, "time_limit_min": 10, "time_limit_max": 30 }
  },
  "total_levels": 150
}
```

Required fields:
- `difficulties.{easy,medium,hard}.reward_min` and `.reward_max` — both required.
- For each difficulty: at least one of `time_limit_min` / `time_limit_max`.
- `total_levels` — integer ≥ 1; anchors the level-vs-difficulty
  progression rule.

The ranges are passed to the LLM as **soft anchors** ("usually",
"typically"), not hard cutoffs. The system prompt instructs the model
to reason about violations qualitatively.

---

## How the LLM call is structured

- **System prompt** — `server/src/prompts/system.md`. Loaded once at
  process start. Defines the persona, the six universal rules, the
  confidence rubric, and the output format. Never mutates per request.
- **User prompt** — built per request from the reference ranges and the
  validated configuration. Contains only data, no instructions.
- **Structured output** — OpenAI structured outputs via Zod
  (`zodResponseFormat`). The Zod schema in
  `server/src/schemas/llm-output.ts` is the single source of truth: it
  constrains the model and types the parsed result.
- **Parameters** — `temperature: 0`, `top_p: 1` for deterministic
  output.

The LLM returns:

```ts
{
  analysis: string,
  findings: Array<{
    rule: 'reward_vs_difficulty' | 'time_vs_difficulty' | 'reward_per_second'
        | 'level_vs_difficulty' | 'economy_risk' | 'frustration_risk',
    suggested_action: string,
    confidence: number   // 0..1
  }>,
  verdict_confidence: number  // 0..1
}
```

The route then maps this to the public `llm_feedback` shape (see
[Post-processing](#post-processing)).

### Confidence semantics

- **`findings.length > 0`** → `confidence` is the mean of per-finding
  confidences, rounded to 2 decimals.
- **`findings.length === 0`** → `confidence` is `verdict_confidence`:
  how sure the model is that there is nothing to flag.

There is intentionally **no** separate `overall_verdict` field — the
verdict is derived from `findings.length`. An empty `findings` array
means "configuration is fine." See
[Why no `overall_verdict`](#why-no-overall_verdict).

### Post-processing

| Internal LLM output            | Public `llm_feedback` field |
| ------------------------------ | --------------------------- |
| `analysis`                     | `analysis`                  |
| `findings[].suggested_action`  | `suggested_actions`         |
| `findings[].confidence` mean   | `confidence` (when findings non-empty) |
| `verdict_confidence`           | `confidence` (when findings empty)     |

When `findings` is empty, `suggested_actions` is set to
`["No action needed"]`.

---

## File layout (relevant pieces)

```
server/
  src/
    index.ts                          # Fastify bootstrap
    routes/
      health.ts
      validate-config.ts              # POST /validate-config
    lib/
      reference-ranges-store.ts       # read+validate ranges per request
      llm-config-validator/
        index.ts                      # orchestrate prompt/LLM/post-process
        user-prompt.ts                # render user-prompt markdown
        post-process.ts               # LLM output → public response
    schemas/
      config.ts                       # Zod schema for the request body
      reference-ranges.ts             # Zod schema for the ranges file
      llm-output.ts                   # Zod schema for the LLM output
    prompts/
      system.md                       # static system prompt
    utils/
      openai.ts                       # generic callLLM<T>(...) helper
  data/
    reference-ranges.json             # editable; soft anchors
```

---

## Notes / design choices

### Zod was chosen instead of AJV

The assignment says *"use a JSON schema validator (e.g., ajv)."* This
service uses **Zod** instead. The reason is developer-side: the author
is most familiar with Python's **Pydantic**, and **Zod is the closest
npm equivalent** — schemas-as-classes, TypeScript types via
`z.infer<...>`, and first-class integration with the OpenAI Node SDK
through `zodResponseFormat`. Picking Zod gives a single source of truth
for input validation, LLM structured-output validation, and TS types.

What AJV would give that Zod does not: strict JSON Schema spec
compliance, faster compiled validators, JSON-Schema-format errors. None
of these matter at this scale. The *"e.g."* in the assignment signals
example, not mandate.

### Why no `overall_verdict`

OpenAI's structured-output `strict: true` mode cannot enforce
cross-field invariants like *"`findings` is empty if and only if the
verdict is fine."* Adding a separate `overall_verdict` field would
create a new failure mode where the model contradicts itself
(`overall_verdict: "fine"` with non-empty `findings`, or vice versa).
Deriving the verdict from `findings.length` removes the conflict by
construction. The system prompt makes the equivalence explicit:
*empty findings means the configuration is fine.*

### No game-economy context

The system prompt judges *"economy risk"* and *"monetization risk"* in
the abstract because this service is not wired into a real game's
store/coin economy. A production deployment would inject context like
coin value, IAP price ladders, and active sales so the model could
reason about reward magnitudes against actual revenue impact. Out of
scope for the assignment.

### Out of scope for this iteration

- The React client UI for editing configurations.
- A reference-ranges editor screen (the file shape is the contract).
- A Dockerfile.

---

## Troubleshooting

- **Port 3000 or 5173 in use:** stop the conflicting process or change
  `PORT` in `server/.env` (and `server.port` in `client/vite.config.ts`
  for the client).
- **CORS errors in the browser:** confirm the server is running and
  `VITE_API_URL` (if you set it) matches the server URL.
- **`502` from `/validate-config`:** either `OPENAI_API_KEY` is missing
  or the OpenAI request failed. Check the server logs for details.
- **`500` from `/validate-config`:** `server/data/reference-ranges.json`
  is missing, empty, or fails the Zod schema. The error message names
  the offending field.

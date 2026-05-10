# Moon Active — Configuration Validator

This README contains both my **insights** from this project and the **setup instructions**. Insights come first so they are not missed.

---

## Project's folders
- 'specs' - my prompts in markdown format to Claude Code
- 'server' - the core logic of this task:
  - 'server\src\lib' - core llm logic
  - 'server\src\prompts' - system prompt of the validator
  - 'server\src\schemas' - definitions of Zod schemas
  - 'server\src\utils' - llm caller
- 'notebooks' - contains running examples
- 'client' - the UI

---

## Insights & key decisions

- **Working with specs** - the spec files in 'specs' folder are the files I gave prompts to Claude Code. You can see how in the core logic of the LLM call I created 3 plans ("config_llm_call_plan*.md") until I was satisfied with the last plan, and then executed it in Claude Code.
- **Zod over AJV** - Zod is the closest npm equivalent to Pydantic; it gives one source of truth for input validation, LLM structured output, and TypeScript types.
- **Static system prompt + dynamic user prompt** - `server/src/prompts/system.md` is loaded once at process start and never mutates, and gives instructions about the input in the user prompt; the user prompt is built per request from the current Reference Balancing Ranges and the validated configuration. This is the best practice I familiar with.
- **Defined role in system prompt** - Persona = senior game economy and level designer. This focuses the LLM on the user's experience and economy concerns rather than generic schema critique. I chose the game economy expert because I understand that this is the final goal - to make the user happy and satisfied.
- **Coin value can be assessed with game's store prices** - a real deployment would inject the prices in game's store to assess game's coin value so "economy risk" reasoning could refer to actual business revenue impact.
- **Added `total_levels` parameter** - the assignment says "higher levels are harder" but never says higher relative to what; passing `total_levels` lets the LLM reason about early/mid/late progression.
- **Confidence output field** - the LLM output contains `confidence` field for each issue found, and then does unweighted average between them. If no issue found (No action required) then the `verdict_confidence` will be the final confidence. See in the system prompt how I instruct to output this field.
- **Model dropdown only allows OpenAI structured-output models** - `gpt-3.5-turbo` is intentionally excluded because it lacks JSON-Schema structured outputs.
- **`temperature` is intentionally not sent** - `gpt-5` and the o-series reasoning models reject any non-default value; omitting `temperature`/`top_p` keeps the allowlist open without per-model branching.
- **Browser console prints input/output JSONs** - every `POST /validate-config` from the UI logs its request payload and the server response so a reviewer can inspect the wire data directly in DevTools.

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

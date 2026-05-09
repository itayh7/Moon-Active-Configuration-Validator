# Quickstart

Spin up the full stack (Fastify server + React client) in three steps.

## 1. Prerequisites

- **Node.js 20 or newer** (`node --version`)
- npm (ships with Node)

## 2. Install

From the repo root:

```bash
npm install
```

This installs dependencies for the root, the `server` workspace, and the `client` workspace in one go.

## 3. Configure the server

Copy the example env file and add your OpenAI key:

```bash
cp server/.env.example server/.env
```

Then open `server/.env` and set `OPENAI_API_KEY`.

## 4. Run

From the repo root:

```bash
npm run dev
```

This starts both processes concurrently:

| Service | URL                              |
| ------- | -------------------------------- |
| Server  | http://localhost:3000            |
| Client  | http://localhost:5173            |
| Health  | http://localhost:3000/health     |

Open http://localhost:5173 in a browser.


## Troubleshooting

- **Port 3000 / 5173 in use:** stop the conflicting process or change `PORT` in `server/.env` and the `server.port` field in `client/vite.config.ts`.
- **CORS errors in the browser:** confirm the server is running and `VITE_API_URL` (if you set it) matches the server URL.
- **OpenAI errors:** the request bubbles up as a 500 from `/health`. Either remove `OPENAI_API_KEY` to use the fallback message, or check the key is valid.

# Task: Setup Foundation for Moon Active Configuration Validator

ultrathink
The goal here is to build an "hello world" app with the required technologies in this file.
Based on this, I will be able later to build the full app based on this - but now let's focus on the technicals.

## CLAUDE.md
Init CLAUDE.md for this project according to my instructions here

## Technical Requirements
- Backend: Node.js with TypeScript using Fastify (for high performance).
- Frontend: Simple UI using React with TypeScript (Vite).
- Validation: ajv.
- AI: OpenAI SDK integration.
- Structure: Clear separation between server and client.
**Note:** use the newest libraries - search in web if you need to.

## Instructions:

1. **Project Initialization:**
   - Create a root directory with a `package.json` that manages both `server` and `client`.
   - Create a `server/` directory:
     - Initialize a TypeScript Node.js project.
     - Install dependencies: `fastify`, `@fastify/cors`, `@fastify/static`, `ajv`, `ajv-formats`, `openai`, `dotenv`.
     - Install dev dependencies: `typescript`, `tsx`, `@types/node`.
   - Create a `client/` directory:
     - Initialize a Vite + React + TypeScript project.
     - Install `axios` for API calls.

2. **Backend Implementation (server/src/index.ts):**
   - Setup a Fastify server running on port 3000.
   - Register `@fastify/cors` to allow requests from the frontend.
   - Create a `GET /health` endpoint that:
     - Calls OpenAI (using an environment variable `OPENAI_API_KEY`).
     - Asks the LLM to "Generate a short, creative welcome message for a game configuration validator."
     - Returns: `{ status: "ok", message: <LLM_RESPONSE>, timestamp: <ISO_DATE> }`.
   - Implement a basic error handler.
   - Create a `.env.example` file with `OPENAI_API_KEY` placeholder.

3. **Frontend Implementation (client/src/App.tsx):**
   - Create a simple dashboard.
   - Implement a "Connection Status" indicator that calls the `/health` endpoint on mount.
   - Display the random welcome message returned from the AI.
   - Use React with MobX - update the CLAUDE.md to:
    * Each component will be in a separated file
    * Definitions like colors/constants will be in a dedicated file in folder named "definitions"
    * Components which are used a lot (like buttons) will be in a dedicated file "common"
    * Vars/States will be stored in the MobX's stores
    * Make the rendered components be clean from html components - this should be only React component. If needed html - do it in a separated file and expose this as a React component. Use a basic React library for components that you familiar with.

4. **Scripts:**
   - Add a `dev` script in the root `package.json` to run both the server and client concurrently (you might need to install `concurrently`).
   - provide a QUICKSTART.md file with instructions of how to init the server and the client.

Please proceed with creating the folder structure, installing dependencies, and writing the boilerplate code for the health check and UI connection.
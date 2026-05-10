# Finishes
Ok we are about to finish this assignment, we need to complete steps which are not done yet or not fully aligned with the requirements in 'specs\assignment.md'.
I've modified project's files from the last time we have talked in this session so be aware.

## Remove AJV Lib
We preferred Zod over AJV for schema validation, so this library is no longer in use. Remove it from this project's libraries.

## Print Input/Output JSONs from Client
I want the input/output jsons to be visible to the reviewer in the browser's console.
Mention this in 'README.md'

## Compact the README.md
The README.md seems to be very long. It should be a very short and readable file. Keep only architectural and key decisions in one sentence for each, and the setup steps from 'QUICKSTART.md' in a very concise and readable version (keep all of the steps we have there, including the llm api key configuration).
For input/output examples, refer to the 'notebooks\validate_config_examples.ipynb'. Add 5 examples to this notebook according to the codebase, requirements in 'specs\assignment.md' and to the system prompt in 'server\src\prompts\system.md'.

Mention in the beginning of the README.md that this contains both setup instructions and my insights from this project. Start from the insights so the reviewer will not miss them.

## Inconsistent error-response Shape

Schema-validation failures return { schema_validation: { valid:false, errors: [...] } } (good), but the model
query-param check throws InvalidModelError which is caught by theglobal error handler in index.ts:17-24 and
returned as { status: 'error', message: '...' }. Two different errorshapes from the same endpoint. Fastest
fix: catch InvalidModelError in the route handler and return it in the same shape as the schema-validation
error (or document this asymmetry).

## Remove LLM Call from Health Endpoint
Remove greeting LLM call from endpoint in 'server\src\routes\health.ts'.

## Finally
Finally you will re-asses the issues in this project and what are the gaps between the current code-base (after your changes) and the requirements in 'specs\assignment.md'.
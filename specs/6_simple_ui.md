# Simple UI
Now we will create a very simple UI for this configuration validator by the following:

## Configuration Validator
This will invoke the 'server\src\routes\validate-config.ts' endpoint and will show the result in the UI (no alert, show the result in the UI itself).

## Game Settings
This will allow the user to set the values in 'server\data\reference-ranges.json'. No need for range or any complication - just a input fields with type of number.

## Model ID Dropdown
This will allow the user to choose model id from ALLOWED_MODELS in 'server\src\routes\validate-config.ts' (use this variable, don't create a parallel list of allowed models in the client side).
Then it will send the request to the 'server\src\routes\validate-config.ts' with this llm model id.


## Notes
- USE CLAUDE.md rules (stores, components, constants like colors)
- new endpoints will be created under 'server\src\routes'
- make this very simple
- ultrathink
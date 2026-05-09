
## Home Assignment
Configuration Validator with AI Review

### Background
Our team develops internal tools, including systems to validate feature configurations in a game (such as level parameters, reward tables, and more). We are interested in exploring the use of a Large Language Model (LLM) to improve the validation process by identifying logical or game-design issues beyond simple schema checks.

### Configuration Field Descriptions:
level — the game level number, representing progression (higher levels are harder).
difficulty — a string indicating the level’s difficulty, e.g., “easy”, “medium”, or “hard”.
reward — the amount of in-game currency or points granted for completing the level.
time_limit — the time (in seconds) allocated to complete the level. This controls pacing and challenge.

### Reference Balancing Ranges
 For reference, you can assume that:
Easy levels generally have rewards in the range of 100–500 and time limits of at least 30 seconds.
Medium levels typically offer rewards between 500–2000 with time limits around 20–60 seconds.
Hard levels usually grant rewards of 2000–5000 with tighter time limits, often between 10–30 seconds.
These are only suggested guidelines. You are encouraged to design your prompt and logic so the LLM can reason about similar patterns, rather than hard-coding these thresholds.

### Task
Build a Node.js microservice that does the following:
1. Accepts a POST request with a JSON configuration file as input.
2. Performs basic schema validation on the JSON (using a tool like ajv).
3. Sends the same JSON to an LLM API to obtain recommendations or identify logical/game-design risks, such as “reward too high” or “time too short.”
4. Returns a structured JSON response that includes:
 *  The results of the schema validation
 * The LLM’s analysis and recommendations
5. Include a README.md with the following details:
 * How to install and run the service
 * How to configure the LLM API key
 * Example commands to test the service

### Technical Requirements
Node.js
Use a JSON schema validator (e.g., ajv)
Integrate with an LLM API (OpenAI, Anthropic, or similar)
Provide clear, well-structured, and readable code

### Bonus Points
Simple UI
Ability to select between different models (gpt-4 / gpt-3.5 / local model)
Return a scoring or confidence measure on the LLM’s response
Include a Dockerfile for easier deployment

### Submission
Please deliver:
A working Node.js codebase in a public or private Git repository
A README.md with clear setup instructions
Working examples of input and the service output

### LLM Provider
You can use OpenAI’s GPT-3.5-turbo as the LLM provider. It is simple to integrate and offers free credits for new accounts.
You may use other providers, such as:
Hugging Face Inference API (e.g., Mistral, Gemma)
A local LLM via Ollama (e.g., LLaMA 3, Mistral)
As long as you clearly document the setup instructions in your README, any of these options is acceptable.


### Example Inputs and Outputs

1.
Input:
{
  "level": 12,
  "time_limit": 60,
  "reward": 5000,
  "difficulty": "easy"
}
Output:
{
  "schema_validation": {
    "valid": true,
    "errors": []
  },
  "llm_feedback": {
    "analysis": "The reward value of 5000 seems disproportionately high for an easy level with a generous 60-second time limit.",
    "suggested_actions": [
      "Reduce reward to 100-500 for easy difficulty",
      "Increase difficulty if you wish to keep a high reward"
    ]
  }
}

2.
Input:
{
  "level": 5,
  "time_limit": 10,
  "reward": 500,
  "difficulty": "hard"
}
Output:
{
  "schema_validation": {
    "valid": true,
    "errors": []
  },
  "llm_feedback": {
    "analysis": "A 10-second time limit on a hard level may be too strict and frustrate players for 500 reward amount.",
    "suggested_actions": [
      "Increase time_limit to 20–30 seconds",
      "Balance reward if keeping a very short time limit"
    ]
  }
}

3.
Input:
{
  "level": 1,
  "time_limit": 120,
  "reward": 100,
  "difficulty": "easy"
}

Output:
{
  "schema_validation": {
    "valid": true,
    "errors": []
  },
  "llm_feedback": {
    "analysis": "This configuration seems reasonable for a starting level with plenty of time and a modest reward.",
    "suggested_actions": [
      "No action needed"
    ]

  }
}
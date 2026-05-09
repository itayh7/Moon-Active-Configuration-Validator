# Brainstorm
Now I will provide you my full home assignment given by Moon Active in 'specs\assignment.md'.
I want you to read it and answer my questions/brainstorming insights under section "## My Questions / Brainstorming" based on the task requirements, and based on your top-level GenAI Software Engineering levels.
DONT edit anything, **just answer**.

## My Questions / Brainstorming
In my questions, we will try to understand better the assignment and think about a strategy for the LLM call we will create.

### System Prompt
Those are points that I was thinking about:
 * define criterias for the grade: what's good? what's bad? the confidence grade is based on what?
 * generate a grade by pre-defined conditions (if reward is x times higher than reference, ...) and then sum the conditions' grades? how much freedom 
 should we give here?
 * how should we treat harder levels differently than easier levels? harder level should expect low grade?
 * mindset - should we find how much the configuration is reasonable? suggest
 * maybe raise product questions: how much this will frustrate the player? when it's too easy so the user can gain too much money fastly? what will provoke the user to pay and buy game's money?
Notes: this should be static and pre-defined. No dynamic injection.
 * is there any meaning to the level number? for example the first level should be the easiest? and not close to the maximum difficulty of easy levels?

### User Prompt
Those are the points that I was thinking about:
 * dynamic "Reference Balancing Ranges" - the user will set them in UI
 * user input: "Configuration Fields" - the required input of this assignment

### Confidence
What the confidence score here is about? How can we connect it to the strategy we agreed on in the system prompt? What it should represent here? 
 * maybe the confidence level is an evaluation for what are the changes that the programmer of the game is wrong here? 
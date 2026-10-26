
const { generateAgentResponse } = require("../services/ai.service");

function buildCareerPlannerPrompt({ resumeAnalysis, jobMatch }) {
    return `
You are the Career Planner Agent in a multi-agent career assistance system.

Create a personalized learning roadmap based on the candidate's
resume analysis and job match results.

RESUME ANALYSIS:
${JSON.stringify(resumeAnalysis, null, 2)}

JOB MATCH ANALYSIS:
${JSON.stringify(jobMatch, null, 2)}

Return valid JSON only, without Markdown fences, using this structure:

{
  "agent": "Career Planner",
  "prioritySkills": [
    {
      "skill": "Skill to improve",
      "reason": "Why it matters for the target role",
      "priority": "high"
    }
  ],
  "roadmap": [
    {
      "day": 1,
      "focus": "Learning objective",
      "tasks": [
        "Specific task 1",
        "Specific task 2",
        "Specific task 3"
      ]
    }
  ],
  "nextSteps": [
    "Actionable career recommendation"
  ]
}

Requirements:
- Create a 7-day learning roadmap.
- Number roadmap days consecutively from 1 to 7.
- Include 2 to 4 actionable tasks per day.
- Use priority values: low, medium, or high.
- Prioritize job-relevant skills that are missing or unverified.
- Do not assume an unverified skill is definitely absent.
- Keep recommendations realistic for a beginner.
- Return JSON only.
`;
}

async function runCareerPlanner(input) {
    if (!input?.resumeAnalysis || !input?.jobMatch) {
        throw new Error(
            "Resume analysis and job match results are required."
        );
    }

    const prompt = buildCareerPlannerPrompt(input);
    const result = await generateAgentResponse(prompt);

    if (
        !result ||
        !Array.isArray(result.prioritySkills) ||
        !Array.isArray(result.roadmap) ||
        !Array.isArray(result.nextSteps)
    ) {
        throw new Error(
            "Career Planner returned an invalid response structure."
        );
    }

    return result;
}

module.exports = {
    buildCareerPlannerPrompt,
    runCareerPlanner,
};

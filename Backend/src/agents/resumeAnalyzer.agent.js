
const { generateAgentResponse } = require("../services/ai.service");

function buildResumeAnalyzerPrompt({
    resume,
    selfDescription = "",
}) {
    return `
You are the Resume Analyzer Agent in a career assistance system.

Analyze the candidate's resume and self-description.

RESUME:
${resume || "No resume provided"}

SELF-DESCRIPTION:
${selfDescription || "No self-description provided"}

Return valid JSON only, without Markdown fences, using this structure:

{
  "agent": "Resume Analyzer",
  "skills": ["skill 1"],
  "experience": ["experience summary"],
  "projects": [
    {
      "name": "project name",
      "description": "project description",
      "technologies": ["technology 1"]
    }
  ],
  "strengths": ["strength 1"],
  "missingInformation": ["information not available"]
}

Rules:
- Do not invent candidate qualifications or experience.
- Use empty arrays when information is unavailable.
- Extract skills only when supported by the input.
- Return JSON only.
`;
}

async function runResumeAnalyzer(input) {
    if (!input || (!input.resume?.trim() && !input.selfDescription?.trim())) {
        throw new Error(
            "Provide a resume or self-description for analysis."
        );
    }

    const prompt = buildResumeAnalyzerPrompt(input);
    const result = await generateAgentResponse(prompt);

    if (
        !result ||
        !Array.isArray(result.skills) ||
        !Array.isArray(result.experience) ||
        !Array.isArray(result.projects) ||
        !Array.isArray(result.strengths) ||
        !Array.isArray(result.missingInformation)
    ) {
        throw new Error("Resume Analyzer returned an invalid response structure.");
    }

    return result;
}

module.exports = {
    buildResumeAnalyzerPrompt,
    runResumeAnalyzer,
};

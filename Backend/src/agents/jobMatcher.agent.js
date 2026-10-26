
const { generateAgentResponse } = require("../services/ai.service");

function buildJobMatcherPrompt({ resumeAnalysis, jobDescription }) {
    return `
You are the Job Matching Agent in a multi-agent career assistance system.

Compare the candidate's resume analysis with the target job description.

RESUME ANALYSIS:
${JSON.stringify(resumeAnalysis, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Return valid JSON only, without Markdown fences, using this structure:

{
  "agent": "Job Matcher",
  "matchScore": 75,
  "matchedSkills": ["skill supported by the resume"],
  "missingOrUnverifiedSkills": ["skill to verify or improve"],
  "strengths": ["relevant candidate strength"],
  "recommendations": ["actionable recommendation"],
  "reasoning": "Brief explanation of the match score"
}

Rules:
- matchScore must be a number from 0 to 100.
- Match skills using evidence from the supplied resume analysis.
- Distinguish genuinely missing skills from skills that are simply unverified.
- Do not invent qualifications or experience.
- Give practical, job-relevant recommendations.
- Return JSON only.
`;
}

async function runJobMatcher(input) {
    if (
        !input?.resumeAnalysis ||
        typeof input.jobDescription !== "string" ||
        !input.jobDescription.trim()
    ) {
        throw new Error(
            "Resume analysis and job description are required."
        );
    }

    const prompt = buildJobMatcherPrompt(input);
    const result = await generateAgentResponse(prompt);

    if (
        !result ||
        typeof result.matchScore !== "number" ||
        result.matchScore < 0 ||
        result.matchScore > 100 ||
        !Array.isArray(result.matchedSkills) ||
        !Array.isArray(result.missingOrUnverifiedSkills) ||
        !Array.isArray(result.strengths) ||
        !Array.isArray(result.recommendations) ||
        typeof result.reasoning !== "string"
    ) {
        throw new Error("Job Matcher returned an invalid response structure.");
    }

    return result;
}

module.exports = {
    buildJobMatcherPrompt,
    runJobMatcher,
};

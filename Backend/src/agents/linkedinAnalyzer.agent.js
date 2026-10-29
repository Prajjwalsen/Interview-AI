
const { generateAgentResponse } = require("../services/ai.service");

async function runLinkedInAnalyzer({ profileUrl = "", profileText = "" }) {
    const url = typeof profileUrl === "string" ? profileUrl.trim() : "";
    const content = typeof profileText === "string" ? profileText.trim() : "";

    const validLinkedInUrl =
        /^https?:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?(?:[?#].*)?$/i;

    if (!url && !content) {
        throw new Error("Please provide a LinkedIn URL or profile content.");
    }

    if (url && !validLinkedInUrl.test(url)) {
        throw new Error("Please provide a valid LinkedIn profile URL.");
    }

    // A URL alone does not reveal the profile's private or full content.
    if (!content || content.length < 50) {
        throw new Error(
            "Profile content is required for analysis because profile data could not be retrieved from the URL. Please paste at least 50 characters."
        );
    }

    const prompt = `
You are LinkedInator, a professional LinkedIn profile reviewer.

Analyze ONLY the profile content supplied below.
Do not claim you accessed LinkedIn directly.
Do not invent qualifications, experience, skills, or achievements.
If information is missing, mention that it was not provided.

Analyze only the information explicitly provided by the user.

If only the headline is provided:
- Evaluate the headline and its keyword relevance.
- Clearly state that the assessment is based on limited profile content.
- Do not claim that the About section, work experience, projects,
  or achievements are missing from the actual LinkedIn profile.
- Do not assign arbitrary identical percentages to every skill.
- Explain the evidence behind the overall score.
- Recommend providing the About section, skills, experience,
  projects, and measurable achievements for a fuller assessment.

PROFILE URL:
${url || "Not provided"}

PROFILE CONTENT:
${content}

Return one valid JSON object only, without Markdown fences, using this structure:
{
  "profileUrl": ${JSON.stringify(url)},
  "overallScore": 70,
  "headline": {
    "currentAssessment": "Assessment based on supplied content",
    "suggestion": "Suggested headline"
  },
  "summary": "Short overall assessment",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "skillsAnalysis": [
    {
      "skill": "A skill actually mentioned",
      "assessment": "Brief assessment"
    }
  ],
  "actionPlan": [
    {
      "priority": "High",
      "task": "Specific improvement",
      "reason": "Why this improvement matters"
    }
  ]
}

Requirements:
- overallScore must be an integer from 0 to 100.
- Include 3 to 5 strengths and 3 to 5 improvements.
- Include 3 to 8 skills actually mentioned in the content.
- Include 3 to 5 actionable tasks.
- Use priority values High, Medium, or Low.
- Keep recommendations practical and specific.
- Return valid JSON only.
`;

    const result = await generateAgentResponse(prompt);

    if (
        !result ||
        typeof result !== "object" ||
        !Number.isFinite(Number(result.overallScore)) ||
        !Array.isArray(result.strengths) ||
        !Array.isArray(result.improvements) ||
        !Array.isArray(result.actionPlan)
    ) {
        throw new Error(
            "The AI returned an incomplete LinkedIn report. Please try again."
        );
    }

    result.profileUrl = url;
    result.overallScore = Math.max(
        0,
        Math.min(100, Math.round(Number(result.overallScore)))
    );

    return result;
}

module.exports = { runLinkedInAnalyzer };

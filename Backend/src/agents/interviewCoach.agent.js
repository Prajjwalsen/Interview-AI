
const { generateAgentResponse } = require("../services/ai.service");

function buildInterviewCoachPrompt({
    resumeAnalysis,
    jobDescription,
    jobMatch,
}) {
    return `
You are the Interview Coach Agent in a multi-agent career assistance system.

Prepare personalized technical and behavioral interview questions.

CANDIDATE ANALYSIS:
${JSON.stringify(resumeAnalysis, null, 2)}

JOB DESCRIPTION:
${jobDescription}

JOB MATCH ANALYSIS:
${JSON.stringify(jobMatch, null, 2)}

Return valid JSON only, without Markdown fences, using this structure:

{
  "agent": "Interview Coach",
  "technicalQuestions": [
    {
      "question": "Interview question",
      "intention": "What the interviewer evaluates",
      "answer": "Detailed sample answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Behavioral question",
      "intention": "What the interviewer evaluates",
      "answer": "Sample answer guidance"
    }
  ],
  "practiceRecommendations": [
    "Specific recommendation"
  ]
}

Requirements:
- Generate 10 technical and 5 behavioral questions.
- Include questions relevant to the job description.
- Include questions about the candidate's listed projects and skills.
- Provide clear, technically accurate sample answers.
- Do not invent candidate experiences or achievements.
- For behavioral questions, use hypothetical examples or answer frameworks
  when actual candidate experiences are unavailable.
- Return JSON only.
`;
}

async function runInterviewCoach(input) {
    if (
        !input?.resumeAnalysis ||
        !input?.jobMatch ||
        typeof input.jobDescription !== "string" ||
        !input.jobDescription.trim()
    ) {
        throw new Error(
            "Resume analysis, job match, and job description are required."
        );
    }

    const prompt = buildInterviewCoachPrompt(input);
    const result = await generateAgentResponse(prompt);

    if (
        !result ||
        !Array.isArray(result.technicalQuestions) ||
        !Array.isArray(result.behavioralQuestions) ||
        !Array.isArray(result.practiceRecommendations)
    ) {
        throw new Error(
            "Interview Coach returned an invalid response structure."
        );
    }

    return result;
}

module.exports = {
    buildInterviewCoachPrompt,
    runInterviewCoach,
};

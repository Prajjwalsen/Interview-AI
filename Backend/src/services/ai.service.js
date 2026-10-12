
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function generateWithRetry(request, attempts = 2) {
    const modelsToTry = [
        request.model || "gemini-3.1-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash",
    ];

    const uniqueModels = [...new Set(modelsToTry)];
    let lastError;

    for (const model of uniqueModels) {
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                console.log(
                    `Trying Gemini model: ${model} (attempt ${attempt}/${attempts})`
                );

                const response = await ai.models.generateContent({
                    ...request,
                    model,
                });

                console.log(`Gemini succeeded with model: ${model}`);
                return response;
            } catch (error) {
                lastError = error;

                const status = Number(error.status || error.code);
                const retryable = [429, 500, 502, 503, 504].includes(status);

                console.error(
                    `Model ${model} failed with status ${status}:`,
                    error.message
                );

                if (!retryable) {
                    throw error;
                }

                if (attempt < attempts) {
                    await sleep(attempt * 3000);
                }
            }
        }

        console.log(`Switching from ${model} to the next model...`);
    }

    throw lastError || new Error("All Gemini models failed.");
}

// Interview report validation schema
const interviewReportSchema = z.object({
    title: z.string(),
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string().min(1),
            intention: z.string().min(1),
            answer: z.string().min(1),
        })
    ).min(1),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().min(1),
            intention: z.string().min(1),
            answer: z.string().min(1),
        })
    ).min(1),

    skillGaps: z.array(
        z.object({
            skill: z.string().min(1),
            severity: z.enum(["low", "medium", "high"]),
        })
    ).min(1),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string().min(1),
            tasks: z.array(z.string()).min(1),
        })
    ).min(1),
});

// Return the first non-empty array, ignoring null-only arrays.
function getArray(...values) {
    return (
        values.find(
            (value) =>
                Array.isArray(value) &&
                value.some((item) => item !== null && item !== undefined)
        ) ||
        values.find(Array.isArray) ||
        []
    );
}

// Convert different question formats into a consistent object.
function normalizeQuestion(item, type) {
    if (item === null || item === undefined) {
        return null;
    }

    if (Array.isArray(item)) {
        const obj = {};

        for (let i = 0; i < item.length - 1; i += 2) {
            obj[String(item[i]).toLowerCase()] = item[i + 1];
        }

        item = obj;
    }

    if (typeof item === "string") {
        return {
            question: item,
            intention: `To assess relevant ${type} knowledge.`,
            answer: "Prepare an answer with clear reasoning and a relevant example.",
        };
    }

    if (typeof item !== "object") {
        return null;
    }

    const question = item.question ?? item.Question;
    const intention = item.intention ?? item.Intention;
    const answer = item.answer ?? item.Answer;

    if (!question || !answer) {
        return null;
    }

    return {
        question: String(question),
        intention: String(
            intention || `To assess relevant ${type} knowledge.`
        ),
        answer: String(answer),
    };
}

function normalizeQuestions(items, type) {
    if (!Array.isArray(items)) {
        return [];
    }

    // Handle an array of normal question objects or nested arrays.
    if (
        items.some(
            (item) =>
                item &&
                typeof item === "object"
        )
    ) {
        return items
            .map((item) => normalizeQuestion(item, type))
            .filter(Boolean);
    }

    // Handle a flat key/value sequence:
    // ["question", "...", "intention", "...", "answer", "..."]
    const result = [];
    let current = {};

    for (let i = 0; i < items.length; i++) {
        const key = String(items[i] ?? "").toLowerCase();

        if (["question", "intention", "answer"].includes(key)) {
            current[key] = items[++i];
        }

        if (current.question && current.answer) {
            result.push(normalizeQuestion(current, type));
            current = {};
        }
    }

    return result.filter(Boolean);
}

function normalizeSkillGaps(items) {
    return items
        .filter((item) => item !== null && item !== undefined)
        .map((item) => {
            if (typeof item === "string") {
                return {
                    skill: item,
                    severity: "medium",
                };
            }

            const severity = ["low", "medium", "high"].includes(
                item?.severity
            )
                ? item.severity
                : "medium";

            return {
                skill: String(item?.skill ?? ""),
                severity,
            };
        })
        .filter((item) => item.skill);
}

function normalizeRoadmap(items) {
    return items
        .filter((item) => item !== null && item !== undefined)
        .map((item, index) => {
            const day = Number(item?.day) || index + 1;

            let tasks = item?.tasks ?? item?.tasks教授;

            if (typeof tasks === "string") {
                tasks = [tasks];
            }

            return {
                day,
                focus: String(
                    item?.focus ?? `Preparation Day ${day}`
                ),
                tasks: Array.isArray(tasks)
                    ? tasks
                        .filter((task) => task !== null && task !== undefined)
                        .map(String)
                    : [],
            };
        });
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw new Error("GOOGLE_GENAI_API_KEY is missing in backend environment.");
    }

    if (!jobDescription || !jobDescription.trim()) {
        throw new Error("Job description is required.");
    }

    const prompt = `
You are an expert technical interviewer, HR interviewer, and career coach.

Analyze the candidate information below and create a personalized interview preparation report.

RESUME:
${resume || "No resume provided"}

SELF-DESCRIPTION:
${selfDescription || "No self-description provided"}

JOB DESCRIPTION:
${jobDescription}

Return ONE valid JSON object only. Do not use Markdown fences.
Do not return null values or null array entries.

Use exactly these fields and structures:

{
  "title": "Target job role",
  "matchScore": 75,
  "technicalQuestions": [
    {
      "question": "A relevant technical interview question",
      "intention": "What the interviewer wants to evaluate",
      "answer": "A detailed sample answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "A relevant HR or behavioral question",
      "intention": "What the interviewer wants to evaluate",
      "answer": "A personalized sample answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "A relevant skill to improve",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Daily learning objective",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3"
      ]
    }
  ]
}

Requirements:

1. Generate exactly 20 technical questions:
   - 5 fundamental questions.
   - 5 intermediate questions.
   - 5 advanced or scenario-based questions.
   - 5 questions based on the resume, projects, or job description.

2. Generate exactly 12 HR and behavioral questions:
   - Tell me about yourself.
   - Why do you want this job?
   - Why should we hire you?
   - What are your strengths?
   - What is your weakness?
   - Where do you see yourself in five years?
   - Describe a challenging situation.
   - Describe a failure and what you learned.
   - How do you handle pressure and deadlines?
   - Describe a teamwork experience.
   - How do you handle disagreements?
   - What do you know about this role?

3. Every question must have a meaningful question, intention, and detailed answer.
   Use the STAR method for behavioral answers where appropriate.
   Do not invent candidate experiences or achievements.

4. Generate 5 to 8 relevant skill gaps. Use severity "low", "medium", or "high".
   Do not assume a skill is missing merely because it is not mentioned.

5. Generate exactly 30 preparation-plan entries, numbered consecutively from 1 to 30.
   Every day must have a focus and 3 to 5 specific tasks.
   Personalize the plan to the job, resume, and identified skill gaps.

6. Match score must be a number from 0 to 100.

7. Every array entry must be a complete object matching the example structure.
   Never return null entries, missing answers, or placeholder questions.

8. Use only these exact top-level field names:
   title, matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan.

Return JSON only.
`;

    try {
        const response = await generateWithRetry({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        if (!response.text) {
            throw new Error("Gemini returned an empty response.");
        }

        console.log("RAW GEMINI RESPONSE:", response.text);

        let parsedReport;

        try {
            parsedReport = JSON.parse(response.text);
        } catch (error) {
            console.error("Invalid Gemini JSON:", error.message);
            throw new Error("Gemini returned invalid JSON.");
        }

        const technicalQuestions = normalizeQuestions(
            getArray(
                parsedReport.technicalQuestions,
                parsedReport.technical_questions
            ),
            "technical"
        );

        const behavioralQuestions = normalizeQuestions(
            getArray(
                parsedReport.behavioralQuestions,
                parsedReport.behavioral_questions,
                parsedReport.hrQuestions,
                parsedReport.hr_questions
            ),
            "behavioral"
        );

        const skillGaps = normalizeSkillGaps(
            getArray(
                parsedReport.skillGaps,
                parsedReport.skill_gaps
            )
        );

        const preparationPlan = normalizeRoadmap(
            getArray(
                parsedReport.preparationPlan,
                parsedReport.preparation_plan,
                parsedReport.preparationRoadmap,
                parsedReport.preparation_roadmap
            )
        );

        const normalizedReport = {
            title: String(
                parsedReport.title ??
                parsedReport.targetJobTitle ??
                "Interview Preparation Plan"
            ),

            matchScore: Number(
                parsedReport.matchScore ??
                parsedReport.match_score ??
                parsedReport.overallScore ??
                0
            ),

            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan,
        };
        console.log("HR DEBUG:", {
            rawHrQuestions: parsedReport.hrQuestions,
            rawBehavioralQuestions: parsedReport.behavioralQuestions,
            normalizedBehavioralCount: behavioralQuestions.length,
        });

        // Reject incomplete responses rather than saving a broken report.
        if (
            normalizedReport.technicalQuestions.length < 1 ||
            normalizedReport.behavioralQuestions.length < 1 ||
            normalizedReport.skillGaps.length < 1 ||
            normalizedReport.preparationPlan.length < 1
        ) {
            console.error("Normalized report is incomplete:", {
                technicalQuestions: normalizedReport.technicalQuestions.length,
                behavioralQuestions: normalizedReport.behavioralQuestions.length,
                skillGaps: normalizedReport.skillGaps.length,
                preparationPlan: normalizedReport.preparationPlan.length,
            });

            throw new Error(
                "Gemini returned an incomplete report. Please try again."
            );
        }

        const validatedReport = interviewReportSchema.parse(normalizedReport);

        // Check expected counts so the UI receives a complete report.
        if (
            validatedReport.technicalQuestions.length !== 20 ||
            validatedReport.behavioralQuestions.length !== 12 ||
            validatedReport.preparationPlan.length !== 30
        ) {
            console.warn("Report generated with unexpected item counts:", {
                technical: validatedReport.technicalQuestions.length,
                behavioral: validatedReport.behavioralQuestions.length,
                roadmapDays: validatedReport.preparationPlan.length,
            });
        }

        return validatedReport;
    } catch (error) {
        console.error("AI interview report generation failed:", error);
        throw error;
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0",
        });

        return await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm",
            },
        });
    } finally {
        await browser.close();
    }
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
}) {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw new Error("GOOGLE_GENAI_API_KEY is missing in backend environment.");
    }

    const resumePdfSchema = z.object({
        html: z.string(),
    });

    const prompt = `
Create a professional, ATS-friendly resume tailored to the job description.

Candidate resume:
${resume || "No resume provided"}

Candidate self-description:
${selfDescription || "No self-description provided"}

Job description:
${jobDescription || "No job description provided"}

Return a JSON object with one field, "html", containing a complete HTML document.
Use a simple professional design suitable for printing on A4 paper.
Do not invent qualifications, employers, dates, or achievements.
`;

    const response = await generateWithRetry({
        model: "gemini-3.1-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        },
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty resume response.");
    }

    const jsonContent = JSON.parse(response.text);
    const validated = resumePdfSchema.parse(jsonContent);

    return generatePdfFromHtml(validated.html);
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
};

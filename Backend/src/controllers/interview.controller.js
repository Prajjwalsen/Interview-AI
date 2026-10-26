const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const { runCareerOrchestrator } = require("../services/orchestrator.service");




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription = "", jobDescription = "" } = req.body;

        if (!jobDescription.trim()) {
            return res.status(400).json({
                message: "Job description is required."
            });
        }

        if (!req.file && !selfDescription.trim()) {
            return res.status(400).json({
                message: "Please upload a resume or provide a self description."
            });
        }

        let resumeText = "";

        if (req.file) {
            const resumeContent = await (
                new pdfParse.PDFParse(
                    Uint8Array.from(req.file.buffer)
                )
            ).getText();

            resumeText = resumeContent.text || "";
        }

        // Run the multi-agent orchestration pipeline
        const agentResults = await runCareerOrchestrator({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const {
            resumeAnalysis,
            jobMatch,
            interviewCoaching,
            careerPlan
        } = agentResults;

        // Convert agent outputs to the existing MongoDB schema
        const technicalQuestions =
            interviewCoaching.technicalQuestions.map(item => ({
                question: item.question,
                intention: item.intention || "Assess technical knowledge",
                answer: item.answer || item.sampleAnswer || "Prepare an answer based on your experience."
            }));

        const behavioralQuestions =
            interviewCoaching.behavioralQuestions.map(item => ({
                question: item.question,
                intention: item.intention || "Assess behavioral competencies",
                answer: item.answer || item.sampleAnswer || "Prepare a genuine example from your experience."
            }));

        const skillGapSource = [
            ...(jobMatch.missingOrUnverifiedSkills || []),
            ...(careerPlan.prioritySkills || [])
        ];

        const skillGaps = [
            ...new Set(
                skillGapSource.map(item =>
                    typeof item === "string" ? item : item.skill
                ).filter(Boolean)
            )
        ].map(skill => ({
            skill,
            severity: "medium"
        }));

        const preparationPlan = careerPlan.roadmap.map((item, index) => ({
            day: item.day || index + 1,
            focus: item.focus || item.title || `Preparation Day ${index + 1}`,
            tasks: Array.isArray(item.tasks)
                ? item.tasks
                : [item.description || item.focus || "Practice relevant skills"]
        }));

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title: "AI Interview Preparation Report",
            jobDescription,
            resume: resumeText,
            selfDescription,
            matchScore: jobMatch.matchScore,
            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport,
            agentSummary: {
                resumeAnalyzer: Boolean(resumeAnalysis),
                jobMatcher: Boolean(jobMatch),
                interviewCoach: Boolean(interviewCoaching),
                careerPlanner: Boolean(careerPlan)
            }
        });

    } catch (error) {
        console.error("Multi-agent interview report error:", error);

        return res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
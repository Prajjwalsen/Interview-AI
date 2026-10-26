
const {
    runResumeAnalyzer,
} = require("../agents/resumeAnalyzer.agent");

const {
    runJobMatcher,
} = require("../agents/jobMatcher.agent");

const {
    runInterviewCoach,
} = require("../agents/interviewCoach.agent");

const {
    runCareerPlanner,
} = require("../agents/careerPlanner.agent");

async function runCareerOrchestrator({
    resume,
    selfDescription = "",
    jobDescription,
}) {
    if (!jobDescription?.trim()) {
        throw new Error("Job description is required.");
    }

    if (!resume?.trim() && !selfDescription?.trim()) {
        throw new Error(
            "A resume or self-description is required."
        );
    }

    console.log("[Orchestrator] Starting Resume Analyzer...");
    const resumeAnalysis = await runResumeAnalyzer({
        resume,
        selfDescription,
    });

    console.log("[Orchestrator] Starting Job Matcher...");
    const jobMatch = await runJobMatcher({
        resumeAnalysis,
        jobDescription,
    });

    console.log("[Orchestrator] Starting Interview Coach...");
    const interviewCoaching = await runInterviewCoach({
        resumeAnalysis,
        jobDescription,
        jobMatch,
    });

    console.log("[Orchestrator] Starting Career Planner...");
    const careerPlan = await runCareerPlanner({
        resumeAnalysis,
        jobMatch,
    });

    console.log("[Orchestrator] All agents completed.");

    return {
        resumeAnalysis,
        jobMatch,
        interviewCoaching,
        careerPlan,
    };
}

module.exports = {
    runCareerOrchestrator,
};

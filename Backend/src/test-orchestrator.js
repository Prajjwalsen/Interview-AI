
require("dotenv").config();

const {
    runCareerOrchestrator,
} = require("./services/orchestrator.service");

async function main() {
    try {
        const result = await runCareerOrchestrator({
            resume: `
                Python developer and computer science student.
                Skills: Python, Pandas, NumPy, Scikit-learn.
                Project: Fake News Detection using TF-IDF and Logistic Regression.
            `,
            selfDescription:
                "I am interested in machine learning and software development.",
            jobDescription: `
                Junior Machine Learning Engineer.

                Requirements:
                - Python programming
                - Machine learning fundamentals
                - Pandas and NumPy
                - Scikit-learn
                - Model evaluation
                - Git and GitHub
            `,
        });

        console.log("\n========== ORCHESTRATOR RESULT ==========");
        console.log(JSON.stringify(result, null, 2));

        console.log("\n========== AGENT SUMMARY ==========");
        console.log("Resume Analyzer:", Boolean(result.resumeAnalysis));
        console.log("Job Matcher:", Boolean(result.jobMatch));
        console.log("Interview Coach:", Boolean(result.interviewCoaching));
        console.log("Career Planner:", Boolean(result.careerPlan));
    } catch (error) {
        console.error("Orchestrator test failed:", error.message);
        process.exitCode = 1;
    }
}

main();

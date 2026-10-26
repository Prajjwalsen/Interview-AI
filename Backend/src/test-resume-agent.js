
require("dotenv").config();

const {
    runResumeAnalyzer,
} = require("./agents/resumeAnalyzer.agent");

async function main() {
    try {
        const result = await runResumeAnalyzer({
            resume: `
                Python developer.
                Skills: Python, Pandas, NumPy, Scikit-learn.
                Project: Fake News Detection using TF-IDF and Logistic Regression.
            `,
            selfDescription:
                "I am a computer science student interested in machine learning.",
        });

        console.log("\nResume Analyzer output:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Agent test failed:", error.message);
        process.exitCode = 1;
    }
}

main();


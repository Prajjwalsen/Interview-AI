
const { runGitHubAnalyzer } = require("../agents/githubAnalyzer.agent");

async function analyzeGitHubController(req, res) {
    try {
        const { username, profileUrl } = req.body;

        const input = username || profileUrl;

        if (!input || typeof input !== "string" || !input.trim()) {
            return res.status(400).json({
                message: "Please provide a GitHub username or profile URL."
            });
        }

        const result = await runGitHubAnalyzer(input);

        return res.status(200).json({
            message: "GitHub profile analyzed successfully.",
            result
        });
    } catch (error) {
        console.error("GitHub Analyzer error:", error);

        const clientErrorMessages = [
            "Please enter a GitHub username or profile URL.",
            "Invalid GitHub profile URL.",
            "Please provide a valid github.com profile URL.",
            "Invalid GitHub username.",
            "GitHub profile not found. Check the username.",
            "GitHub API rate limit reached. Please try again later."
        ];

        const isClientError = clientErrorMessages.includes(error.message);

        return res.status(isClientError ? 400 : 500).json({
            message: isClientError
                ? error.message
                : "Failed to analyze GitHub profile.",
            error: error.message
        });
    }
}

module.exports = { analyzeGitHubController };

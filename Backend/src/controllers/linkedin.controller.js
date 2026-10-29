
const { runLinkedInAnalyzer } = require("../agents/linkedinAnalyzer.agent");

async function analyzeLinkedInController(req, res) {
    try {
        const { profileUrl = "", profileText = "" } = req.body || {};

        if (typeof profileUrl !== "string" || typeof profileText !== "string") {
            return res.status(400).json({
                message: "Profile URL and content must be text values."
            });
        }

        const url = profileUrl.trim();
        const content = profileText.trim();

        if (!url && !content) {
            return res.status(400).json({
                message: "Please provide a LinkedIn URL or profile content."
            });
        }

        const validLinkedInUrl =
            /^https?:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?(?:[?#].*)?$/i;

        if (url && !validLinkedInUrl.test(url)) {
            return res.status(400).json({
                message: "Please provide a valid LinkedIn profile URL."
            });
        }

        const result = await runLinkedInAnalyzer({
            profileUrl: url,
            profileText: content
        });

        return res.status(200).json({
            message: "LinkedIn profile analyzed successfully.",
            result
        });
    } catch (error) {
        console.error("LinkedIn Analyzer error:", error);

        const clientErrors = [
            "Please provide a LinkedIn URL or profile content.",
            "Please provide a valid LinkedIn profile URL.",
            "Profile content is required for analysis because profile data could not be retrieved from the URL. Please paste at least 50 characters.",
            "The AI returned an incomplete LinkedIn report. Please try again."
        ];

        const isClientError = clientErrors.includes(error.message);

        return res.status(isClientError ? 400 : 500).json({
            message: isClientError
                ? error.message
                : "Failed to analyze LinkedIn profile. Check the backend terminal for details."
        });
    }
}

module.exports = { analyzeLinkedInController };

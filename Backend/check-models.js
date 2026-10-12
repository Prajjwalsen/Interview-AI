
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function main() {
    const modelsToTest = [
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash"
    ];

    for (const model of modelsToTest) {
        try {
            console.log(`\nTesting ${model}...`);

            const response = await ai.models.generateContent({
                model,
                contents: "Reply with exactly: MODEL WORKS"
            });

            console.log("SUCCESS:", model, response.text);
            return;
        } catch (error) {
            console.log(
                "FAILED:",
                model,
                "Status:",
                error.status || error.code,
                error.message
            );
        }
    }

    console.log("\nNone of the tested models worked.");
}

main();

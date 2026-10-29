
export async function analyzeLinkedInProfile(
    profileUrl = "",
    profileText = "",
    options = {}
) {
    const url = typeof profileUrl === "string" ? profileUrl.trim() : "";
    const content = typeof profileText === "string" ? profileText.trim() : "";

    if (!url && !content) {
        throw new Error("Please enter a LinkedIn URL or profile content.");
    }

    const response = await fetch(
        "http://localhost:3000/api/linkedin/analyze",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            signal: options.signal,
            body: JSON.stringify({
                profileUrl: url,
                profileText: content
            })
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to analyze LinkedIn profile."
        );
    }

    if (!data.result) {
        throw new Error("The server returned no LinkedIn analysis report.");
    }

    return data.result;
}

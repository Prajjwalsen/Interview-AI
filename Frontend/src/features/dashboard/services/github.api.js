
export async function analyzeGitHubProfile(input) {
    const response = await fetch("http://localhost:3000/api/github/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            username: input.trim()
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to analyze GitHub profile."
        );
    }

    return data.result;
}
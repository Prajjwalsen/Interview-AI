
const { generateAgentResponse } = require("../services/ai.service");

const GITHUB_API = "https://api.github.com";

function extractGitHubUsername(input) {
    if (typeof input !== "string" || !input.trim()) {
        throw new Error("Please enter a GitHub username or profile URL.");
    }

    const value = input.trim();
    let username = value;

    if (value.includes("://") || value.startsWith("www.")) {
        let url;

        try {
            url = new URL(
                value.startsWith("www.") ? `https://${value}` : value
            );
        } catch {
            throw new Error("Invalid GitHub profile URL.");
        }

        if (
            url.protocol !== "https:" ||
            !["github.com", "www.github.com"].includes(url.hostname)
        ) {
            throw new Error("Please provide a valid github.com profile URL.");
        }

        username = url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
        throw new Error("Invalid GitHub username.");
    }

    return username;
}

async function fetchGitHubJson(url) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "Interview-AI-Analyzer"
        },
        signal: AbortSignal.timeout(15000)
    });

    if (response.status === 404) {
        throw new Error("GitHub profile not found. Check the username.");
    }

    if (response.status === 403 || response.status === 429) {
        throw new Error(
            "GitHub API rate limit reached. Please try again later."
        );
    }

    if (!response.ok) {
        throw new Error(`GitHub API request failed (${response.status}).`);
    }

    return response.json();
}

function buildGitHubAnalyzerPrompt({ profile, repositories }) {
    return `
You are a GitHub portfolio reviewer and career mentor.

Analyze the real GitHub data below. Base your conclusions only on
the supplied evidence. Do not invent skills, projects, contributions,
code quality findings, or achievements.

PROFILE:
${JSON.stringify(profile)}

PUBLIC REPOSITORIES:
${JSON.stringify(repositories)}

Return valid JSON only, using exactly this structure:

{
  "overallSummary": "A concise evidence-based portfolio summary",
  "strengths": ["Evidence-based strength"],
  "improvements": ["Specific improvement"],
  "recommendedProjects": ["Relevant project idea"],
  "skillInsights": [
    {
      "skill": "Skill name",
      "evidence": "Evidence in the supplied repository data"
    }
  ],
  "topRepositories": [
    {
      "name": "Repository name",
      "reason": "Why it may be worth highlighting"
    }
  ],
  "actionPlan": [
    {
      "priority": "high",
      "task": "Specific action",
      "reason": "Why it matters"
    }
  ]
}

Rules:
- Use up to 5 topRepositories from the supplied repository list.
- Use priority values only: high, medium, low.
- Clearly distinguish observed facts from reasonable suggestions.
- Repository language alone does not prove expertise.
- Do not claim to have inspected source code or README files.
- If repository information is limited, mention that limitation.
- Give practical, constructive advice for a developer's portfolio.
`;
}

async function runGitHubAnalyzer(input) {
    const username = extractGitHubUsername(
        typeof input === "string"
            ? input
            : input?.username || input?.profileUrl
    );

    const [githubProfile, githubRepositories] = await Promise.all([
        fetchGitHubJson(`${GITHUB_API}/users/${username}`),
        fetchGitHubJson(
            `${GITHUB_API}/users/${username}/repos?sort=updated&direction=desc&per_page=30&type=owner`
        )
    ]);

    const profile = {
        username: githubProfile.login,
        name: githubProfile.name,
        profileUrl: githubProfile.html_url,
        bio: githubProfile.bio,
        publicRepos: githubProfile.public_repos,
        followers: githubProfile.followers,
        following: githubProfile.following,
        createdAt: githubProfile.created_at
    };

    const repositories = githubRepositories.map(repo => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isFork: repo.fork,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        topics: repo.topics || []
    }));

    const languageCounts = {};

    for (const repo of repositories) {
        if (repo.language && !repo.isFork) {
            languageCounts[repo.language] =
                (languageCounts[repo.language] || 0) + 1;
        }
    }

    const analysis = await generateAgentResponse(
        buildGitHubAnalyzerPrompt({ profile, repositories })
    );

    const requiredArrays = [
        "strengths",
        "improvements",
        "recommendedProjects",
        "skillInsights",
        "topRepositories",
        "actionPlan"
    ];

    for (const field of requiredArrays) {
        if (!Array.isArray(analysis?.[field])) {
            throw new Error(
                `GitHub AI analysis returned an invalid "${field}" field. Please try again.`
            );
        }
    }

    if (typeof analysis.overallSummary !== "string") {
        throw new Error("GitHub AI analysis returned an invalid summary.");
    }

    return {
        profile,
        stats: {
            publicRepos: githubProfile.public_repos,
            followers: githubProfile.followers,
            totalStars: repositories.reduce(
                (sum, repo) => sum + repo.stars, 0
            ),
            languages: languageCounts,
            analyzedRepositories: repositories.length
        },
        repositories,
        analysis
    };
}

module.exports = {
    extractGitHubUsername,
    buildGitHubAnalyzerPrompt,
    runGitHubAnalyzer
};

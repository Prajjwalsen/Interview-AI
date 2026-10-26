
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./GitHubAnalyzer.scss";

export default function GitHubAnalyzer() {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [result, setResult] = useState(location.state?.result || null);
    const [error, setError] = useState("");

    function handleAnalyze(event) {
        event.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Enter a GitHub username or profile URL first.");
            return;
        }

        setResult(null);

        navigate("/github-analyzer/loading", {
            state: { username: username.trim() }
        });
    }

    return (
        <main className="github-analyzer">
            <button
                className="github-analyzer__back"
                type="button"
                onClick={() => navigate("/")}
            >
                <span aria-hidden="true">←</span> Dashboard
            </button>

            {/* Two-column GitHub Analyzer hero */}

            <section className="github-analyzer__hero">
                <div className="github-analyzer__visual">
                    <img
                        className="github-analyzer__gif"
                        src="/github-scan.gif"
                        alt="Animated GitHub logo"
                    />
                </div>

                <div className="github-analyzer__content">
                    
                    <div className="github-analyzer__corner-bot" aria-label="GitSherlock AI agent">
                        <div className="github-analyzer__corner-bot-antenna" />
                        <div className="github-analyzer__corner-bot-head">
                            <span />
                            <span />
                            <i />
                        </div>
                        <div className="github-analyzer__corner-bot-body">
                            <b>GS</b>
                        </div>
                    </div>

                    <span className="github-analyzer__eyebrow">
                        INTERVIEW AI MASTER
                    </span>

                    <h1>
                        GitHub <span>Analyzer</span>
                    </h1>

                    <p className="github-analyzer__description">
                        Investigate your repositories. Discover your strengths.
                        Find out what your code says about you.
                    </p>

                    <form
                        className="github-analyzer__form"
                        onSubmit={handleAnalyze}
                    >
                        <label
                            className="github-analyzer__input-label"
                            htmlFor="github-username"
                        >
                            GitHub username or profile URL
                        </label>

                        <input
                            id="github-username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="e.g. octocat"
                            required
                        />

                        <button type="submit">
                            Analyze Profile
                        </button>

                        <p className="github-analyzer__hint">
                            Public repositories · AI-powered portfolio insights
                        </p>
                    </form>

                    {error && (
                        <p className="github-analyzer__error" role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </section>


            {/* Analysis results */}
            {result && (
                <section className="github-analyzer__results">
                    <div className="github-analyzer__profile">
                        <div
                            className="github-analyzer__profile-avatar"
                            aria-hidden="true"
                        >
                            {result.profile.username.slice(0, 1).toUpperCase()}
                        </div>

                        <div className="github-analyzer__profile-info">
                            <span className="github-analyzer__eyebrow">
                                ANALYSIS COMPLETE
                            </span>

                            <h2>
                                {result.profile.name || result.profile.username}
                            </h2>

                            <a
                                href={result.profile.profileUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                @{result.profile.username} ↗
                            </a>

                            {result.profile.bio && <p>{result.profile.bio}</p>}
                        </div>

                        <span className="github-analyzer__complete-badge">
                            ✓ Analyzed
                        </span>
                    </div>

                    <div className="github-analyzer__stats">
                        <Stat
                            label="Public repositories"
                            value={result.stats.publicRepos}
                            icon="▤"
                        />
                        <Stat
                            label="Followers"
                            value={result.stats.followers}
                            icon="♙"
                        />
                        <Stat
                            label="Stars in fetched repos"
                            value={result.stats.totalStars}
                            icon="☆"
                        />
                        <Stat
                            label="Repos analyzed"
                            value={result.stats.analyzedRepositories}
                            icon="⌘"
                        />
                    </div>

                    <section className="github-analyzer__section github-analyzer__summary">
                        <SectionHeading
                            eyebrow="THE VERDICT"
                            title="AI Portfolio Review"
                        />
                        <p>{result.analysis.overallSummary}</p>
                    </section>

                    <div className="github-analyzer__insights-grid">
                        <InsightSection
                            title="Your strengths"
                            icon="✦"
                            items={result.analysis.strengths}
                            kind="strength"
                        />

                        <InsightSection
                            title="Room to improve"
                            icon="↗"
                            items={result.analysis.improvements}
                            kind="improvement"
                        />
                    </div>

                    <Section
                        title="Recommended projects"
                        eyebrow="LEVEL UP"
                        items={result.analysis.recommendedProjects}
                    />

                    <section className="github-analyzer__section">
                        <SectionHeading
                            eyebrow="SKILL DETECTIVE"
                            title="Skill Insights"
                        />

                        <div className="github-analyzer__skill-grid">
                            {result.analysis.skillInsights.map((item, index) => (
                                <article
                                    className="github-analyzer__item"
                                    key={`${item.skill}-${index}`}
                                >
                                    <span className="github-analyzer__item-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h3>{item.skill}</h3>
                                    <p>{item.evidence}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="github-analyzer__section">
                        <SectionHeading
                            eyebrow="YOUR BEST WORK"
                            title="Repositories to Highlight"
                        />

                        <div className="github-analyzer__repository-grid">
                            {result.analysis.topRepositories.map((repo, index) => {
                                const repository = result.repositories.find(
                                    (item) => item.name === repo.name
                                );

                                return (
                                    <article
                                        className="github-analyzer__item github-analyzer__repo-card"
                                        key={`${repo.name}-${index}`}
                                    >
                                        <span className="github-analyzer__repo-symbol">
                                            ⌘
                                        </span>

                                        <h3>
                                            <a
                                                href={
                                                    repository?.url ||
                                                    `https://github.com/${result.profile.username}/${encodeURIComponent(repo.name)}`
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {repo.name} ↗
                                            </a>
                                        </h3>

                                        <p>{repo.reason}</p>

                                        {repository && (
                                            <span className="github-analyzer__repo-language">
                                                {repository.language || "Language not specified"}
                                            </span>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className="github-analyzer__section">
                        <SectionHeading
                            eyebrow="THE GAME PLAN"
                            title="Your Action Plan"
                        />

                        <div className="github-analyzer__action-list">
                            {result.analysis.actionPlan.map((item, index) => {
                                const priority = ["high", "medium", "low"].includes(
                                    item.priority?.toLowerCase()
                                )
                                    ? item.priority.toLowerCase()
                                    : "medium";

                                return (
                                    <article
                                        className="github-analyzer__action"
                                        key={`${item.task}-${index}`}
                                    >
                                        <span className="github-analyzer__action-index">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div>
                                            <span
                                                className={`github-analyzer__priority github-analyzer__priority--${priority}`}
                                            >
                                                {priority} priority
                                            </span>

                                            <h3>{item.task}</h3>
                                            <p>{item.reason}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className="github-analyzer__section">
                        <SectionHeading
                            eyebrow="THE RECEIPTS"
                            title="Public Repositories"
                        />

                        <div className="github-analyzer__repository-list">
                            {result.repositories.map((repo) => (
                                <article
                                    className="github-analyzer__repository-row"
                                    key={repo.name}
                                >
                                    <div className="github-analyzer__repo-symbol">
                                        ⌘
                                    </div>

                                    <div className="github-analyzer__repository-info">
                                        <h3>
                                            <a
                                                href={repo.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {repo.name} ↗
                                            </a>
                                        </h3>

                                        <p>
                                            {repo.description ||
                                                "No description yet. The README team is crying. 😭"}
                                        </p>

                                        <div className="github-analyzer__repo-meta">
                                            <span>
                                                {repo.language || "Unknown language"}
                                            </span>
                                            <span>☆ {repo.stars}</span>
                                            <span>⑂ {repo.forks} forks</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <div className="github-analyzer__footer-note">
                        <span aria-hidden="true">🤖</span>
                        <p>
                            Audit complete. Ab jao, README update karo,
                            aur main character bano.
                        </p>
                    </div>
                </section>
            )}
        </main>
    );
}

function Stat({ label, value, icon }) {
    return (
        <article className="github-analyzer__stat-card">
            <span className="github-analyzer__stat-icon" aria-hidden="true">
                {icon}
            </span>
            <p>{label}</p>
            <h2>{value ?? 0}</h2>
        </article>
    );
}

function SectionHeading({ eyebrow, title }) {
    return (
        <header className="github-analyzer__section-heading">
            <span>{eyebrow}</span>
            <h2>{title}</h2>
        </header>
    );
}

function InsightSection({ title, icon, items = [], kind }) {
    return (
        <section
            className={`github-analyzer__section github-analyzer__insight github-analyzer__insight--${kind}`}
        >
            <SectionHeading
                eyebrow={kind === "strength" ? "GOOD STUFF" : "NO CAP"}
                title={title}
            />

            <span className="github-analyzer__insight-icon" aria-hidden="true">
                {icon}
            </span>

            {items.length ? (
                <ul className="github-analyzer__list">
                    {items.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>No insights returned.</p>
            )}
        </section>
    );
}

function Section({ title, eyebrow, items = [] }) {
    return (
        <section className="github-analyzer__section">
            <SectionHeading eyebrow={eyebrow} title={title} />

            {items.length ? (
                <ul className="github-analyzer__list github-analyzer__list--card">
                    {items.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>No suggestions returned.</p>
            )}
        </section>
    );
}

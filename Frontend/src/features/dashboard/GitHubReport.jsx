
import { useLocation, useNavigate } from "react-router";
import "./GitHubReport.scss";

export default function GitHubReport() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const result = state?.result;

    if (!result) {
        return (
            <main className="gh-report">
                <p className="gh-report__eyebrow">GITHUB INTELLIGENCE</p>
                <h1>Report unavailable</h1>
                <p>Run a new analysis to generate your report.</p>
                <button onClick={() => navigate("/github-analyzer")}>
                    Back to Analyzer
                </button>
            </main>
        );
    }

    const { profile, stats, repositories = [], analysis } = result;

    const languages = Object.entries(stats.languages || {})
        .sort((a, b) => b[1] - a[1]);

    const metrics = [
        ["PUBLIC REPOS", stats.publicRepos],
        ["REPOS ANALYZED", stats.analyzedRepositories],
        ["TOTAL STARS", stats.totalStars],
        ["FOLLOWERS", stats.followers]
    ];

    return (
        <main className="gh-report">
            <header className="gh-report__topbar">
                <button
                    className="gh-report__back"
                    onClick={() => navigate("/github-analyzer")}
                >
                    ← Analyzer
                </button>

                <span className="gh-report__brand">
                    git<span>[a]</span>nalyzer
                </span>

                <span className="gh-report__status">
                    <i /> REPORT READY
                </span>
            </header>

            <section className="gh-report__profile">
                <div className="gh-report__avatar">
                    {(profile.name || profile.username).slice(0, 1).toUpperCase()}
                </div>

                <div className="gh-report__identity">
                    <span className="gh-report__eyebrow">
                        GITHUB PORTFOLIO REPORT
                    </span>

                    <h1>{profile.name || profile.username}</h1>

                    <a href={profile.profileUrl} target="_blank" rel="noreferrer">
                        @{profile.username} ↗
                    </a>

                    <p>{profile.bio || "No public profile bio provided."}</p>

                    <span className="gh-report__account-date">
                        ACCOUNT CREATED:{" "}
                        {profile.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString()
                            : "NOT AVAILABLE"}
                    </span>
                </div>

                <div className="gh-report__verified">
                    <i /> PUBLIC PROFILE
                </div>
            </section>

            <section className="gh-report__metrics">
                {metrics.map(([label, value]) => (
                    <article className="gh-report__metric" key={label}>
                        <span>{label}</span>
                        <strong>{(value ?? 0).toLocaleString()}</strong>
                    </article>
                ))}
            </section>

            <section className="gh-report__section">
                <SectionTitle number="01" title="TOP LANGUAGES" />

                {languages.length ? (
                    <div className="gh-report__languages">
                        {languages.map(([language, count]) => (
                            <article className="gh-report__language" key={language}>
                                <span className="gh-report__language-dot" />
                                <span>{language}</span>
                                <strong>{count} repos</strong>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="gh-report__muted">
                        No language information available.
                    </p>
                )}

                <p className="gh-report__footnote">
                    Counts are based on the fetched public repositories, not all-time
                    coding activity.
                </p>
            </section>

            <section className="gh-report__section">
                <SectionTitle number="02" title="ANALYSIS REPORT" />

                <article className="gh-report__summary">
                    <span className="gh-report__eyebrow">PORTFOLIO SUMMARY</span>
                    <p>{analysis.overallSummary}</p>
                </article>

                <div className="gh-report__analysis-grid">
                    <InsightPanel
                        title="Strengths"
                        items={analysis.strengths}
                        variant="positive"
                    />

                    <InsightPanel
                        title="Areas to improve"
                        items={analysis.improvements}
                        variant="attention"
                    />
                </div>

                <div className="gh-report__analysis-grid">
                    <InsightPanel
                        title="Skill insights"
                        items={analysis.skillInsights.map(
                            item => `${item.skill}: ${item.evidence}`
                        )}
                    />

                    <InsightPanel
                        title="Recommended projects"
                        items={analysis.recommendedProjects}
                    />
                </div>
            </section>

            <section className="gh-report__section">
                <SectionTitle number="03" title="TOP REPOSITORIES" />

                <div className="gh-report__repositories">
                    {(analysis.topRepositories || []).map((repo, index) => {
                        const original = repositories.find(
                            item => item.name === repo.name
                        );

                        return (
                            <article className="gh-report__repo" key={`${repo.name}-${index}`}>
                                <div className="gh-report__repo-number">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="gh-report__repo-info">
                                    <a
                                        href={original?.url ||
                                            `https://github.com/${profile.username}/${encodeURIComponent(repo.name)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {repo.name} ↗
                                    </a>
                                    <p>{repo.reason}</p>

                                    {original && (
                                        <span>
                                            {original.language || "Language not specified"}
                                            {" · "}★ {original.stars}
                                            {" · "}Forks {original.forks}
                                        </span>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="gh-report__section">
                <SectionTitle number="04" title="PUBLIC REPOSITORY INVENTORY" />

                <div className="gh-report__table-wrap">
                    <table className="gh-report__table">
                        <thead>
                            <tr>
                                <th>Repository</th>
                                <th>Language</th>
                                <th>Stars</th>
                                <th>Forks</th>
                                <th>Last updated</th>
                            </tr>
                        </thead>

                        <tbody>
                            {repositories.map(repo => (
                                <tr key={repo.name}>
                                    <td>
                                        <a href={repo.url} target="_blank" rel="noreferrer">
                                            {repo.name}
                                        </a>
                                    </td>
                                    <td>{repo.language || "—"}</td>
                                    <td>{repo.stars}</td>
                                    <td>{repo.forks}</td>
                                    <td>
                                        {repo.updatedAt
                                            ? new Date(repo.updatedAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="gh-report__section">
                <SectionTitle number="05" title="RECOMMENDED ACTION PLAN" />

                <div className="gh-report__actions">
                    {(analysis.actionPlan || []).map((item, index) => (
                        <article className="gh-report__action" key={`${item.task}-${index}`}>
                            <span className="gh-report__action-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <div>
                                <span className={`gh-report__priority gh-report__priority--${["high", "medium", "low"].includes(item.priority?.toLowerCase()) ? item.priority.toLowerCase() : "medium"}`}>
                                    {item.priority || "medium"} priority
                                </span>
                                <h3>{item.task}</h3>
                                <p>{item.reason}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className="gh-report__footer">
                GITHUB INTELLIGENCE REPORT · GENERATED FROM PUBLIC PROFILE DATA
            </footer>
        </main>
    );
}

function SectionTitle({ number, title }) {
    return (
        <div className="gh-report__section-title">
            <span>[{number}]</span>
            <h2>{title}</h2>
        </div>
    );
}

function InsightPanel({ title, items = [], variant = "" }) {
    return (
        <article className={`gh-report__panel ${variant}`}>
            <h3>{title}</h3>

            {items.length ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="gh-report__muted">No insights available.</p>
            )}
        </article>
    );
}

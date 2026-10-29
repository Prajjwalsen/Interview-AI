
import { useLocation, useNavigate } from "react-router";
import "./LinkedInatorReport.scss";

export default function LinkedInatorReport() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const result = state?.result ?? state?.report ?? {};
    const score = Math.max(
        0,
        Math.min(100, Number(result.score ?? result.profileScore ?? 70))
    );

    const headlineReview = result.headlineReview ?? {
        assessment:
            "Your headline communicates your professional identity and key technical interests. Add measurable achievements and a clearer value proposition to make it more impactful.",
        suggestedHeadline:
            "AI & Data Science Professional | Machine Learning, Deep Learning & Real-World AI Solutions",
    };

    const strengths = result.strengths ?? [
        "Your technical interests are clearly communicated.",
        "Your profile highlights relevant AI and Data Science skills.",
        "Your career direction is easy to understand.",
        "Your professional introduction establishes a solid foundation.",
    ];

    const improvements = result.areasToImprove ?? result.improvements ?? [
        "Add a detailed About section with your career goals and achievements.",
        "Include Experience and Education details with measurable outcomes.",
        "Showcase projects that demonstrate your technical abilities.",
        "Mention relevant tools, technologies and methodologies.",
    ];

    const skills = result.skillsAnalysis ?? [
        { name: "Artificial Intelligence", level: 85 },
        { name: "Data Science", level: 82 },
        { name: "Machine Learning", level: 85 },
        { name: "Deep Learning", level: 75 },
        { name: "Python", level: 88 },
        { name: "Data Analytics", level: 76 },
    ];

    const actions = result.actionPlan ?? [
        {
            title: "Build a compelling About section",
            description:
                "Summarize your career goals, technical strengths and most relevant achievements.",
            priority: "High",
        },
        {
            title: "Improve Experience and Education",
            description:
                "Add relevant roles, responsibilities, education details and measurable outcomes.",
            priority: "High",
        },
        {
            title: "Showcase Projects and Portfolio",
            description:
                "Highlight practical projects, your contributions, technologies and results.",
            priority: "Medium",
        },
        {
            title: "Expand your Skills section",
            description:
                "Include relevant programming languages, frameworks, tools and methodologies.",
            priority: "Medium",
        },
    ];

    const profileUrl = state?.profileUrl;

    const displayList = (items) =>
        Array.isArray(items)
            ? items.map((item) =>
                  typeof item === "string"
                      ? item
                      : item?.description ?? item?.title ?? item?.name ?? ""
              ).filter(Boolean)
            : [];

    return (
        <main className="li-report">
            <header className="li-report__topbar">
                <button
                    className="li-report__brand"
                    onClick={() => navigate("/")}
                    type="button"
                >
                    <span className="li-report__brand-icon">in</span>
                    <span>
                        INTERVIEW <b>AI MASTER</b>
                    </span>
                </button>

                <button
                    className="li-report__back"
                    type="button"
                    onClick={() => navigate("/linkedin-analyzer")}
                >
                    ← Analyze another profile
                </button>
            </header>

            <section className="li-report__hero">
                <div className="li-report__hero-copy">
                    <span className="li-report__eyebrow">
                        AI-POWERED PROFILE INTELLIGENCE
                    </span>
                    <h1>
                        LinkedIn<span>ator</span>
                        <br />
                        Report<span className="li-report__period">.</span>
                    </h1>
                    <p>
                        Your professional presence, decoded. Discover
                        strengths, identify gaps and build your next career move.
                    </p>

                    {profileUrl && (
                        <a
                            className="li-report__profile-link"
                            href={profileUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View LinkedIn Profile ↗
                        </a>
                    )}
                </div>

                <div className="li-report__hero-visual" aria-hidden="true">
                    <div className="li-report__orbit li-report__orbit--one" />
                    <div className="li-report__orbit li-report__orbit--two" />
                    <div className="li-report__core">
                        <span>in</span>
                    </div>
                    <span className="li-report__float li-report__float--one">
                        ✳ Profile analysis
                    </span>
                    <span className="li-report__float li-report__float--two">
                        ↗ Career growth
                    </span>
                    <span className="li-report__float li-report__float--three">
                        ◈ AI insights
                    </span>
                </div>
            </section>

            <section className="li-report__layout">
                <aside className="li-report__score-card li-report__card">
                    <span className="li-report__section-kicker">
                        PROFILE CONTENT SCORE
                    </span>

                    <div
                        className="li-report__score-ring"
                        style={{ "--score": `${score * 3.6}deg` }}
                        role="img"
                        aria-label={`Profile content score ${score} out of 100`}
                    >
                        <div className="li-report__score-inner">
                            <strong>{score}</strong>
                            <span>/100</span>
                        </div>
                    </div>

                    <h2>
                        {score >= 80
                            ? "Excellent foundation"
                            : score >= 60
                              ? "Good foundation"
                              : "Room to grow"}
                    </h2>
                    <p className="li-report__muted">
                        {result.summary ??
                            "Use this score as a starting point for improving the completeness and clarity of your professional profile."}
                    </p>

                    <div className="li-report__divider" />

                    {[
                        ["◉", "Professional identity", 82],
                        ["✳", "Skills visibility", 68],
                        ["▣", "Experience clarity", 72],
                        ["◇", "Impact & achievements", 66],
                        ["♡", "Overall presentation", score],
                    ].map(([icon, label, value]) => (
                        <div className="li-report__metric" key={label}>
                            <span className="li-report__metric-icon">{icon}</span>
                            <div className="li-report__metric-main">
                                <div className="li-report__metric-label">
                                    <span>{label}</span>
                                    <b>{value}%</b>
                                </div>
                                <div className="li-report__bar">
                                    <span style={{ width: `${value}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="li-report__quick-tip">
                        <span>✦ QUICK INSIGHT</span>
                        <p>
                            Focus on specific achievements and project outcomes
                            to make your profile more convincing.
                        </p>
                    </div>
                </aside>

                <div className="li-report__main">
                    <section className="li-report__overview li-report__card">
                        <div className="li-report__card-heading">
                            <span className="li-report__heading-icon">✧</span>
                            <h2>Profile <span>Overview</span></h2>
                            <span className="li-report__tag">AI ANALYSIS</span>
                        </div>

                        <p>
                            {result.overview ??
                                "Your profile review brings together your professional identity, skills, presentation and opportunities for improvement."}
                        </p>

                        <div className="li-report__overview-pills">
                            <span>✳ AI & Data Science</span>
                            <span>↗ Growth mindset</span>
                            <span>⌘ Technical skills</span>
                            <span>◎ Career focus</span>
                        </div>
                    </section>

                    <div className="li-report__two-col">
                        <section className="li-report__card li-report__headline">
                            <div className="li-report__card-heading">
                                <span className="li-report__heading-icon">▤</span>
                                <h2>Headline <span>Review</span></h2>
                            </div>
                            <h3>Current assessment</h3>
                            <p>
                                {headlineReview.assessment ??
                                    headlineReview.currentAssessment ??
                                    "Review your headline for clarity, relevance and impact."}
                            </p>

                            <div className="li-report__suggestion">
                                <span>✦ SUGGESTED HEADLINE</span>
                                <p>
                                    {headlineReview.suggestedHeadline ??
                                        headlineReview.suggestion ??
                                        "Add a concise headline highlighting your specialisation and impact."}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigator.clipboard?.writeText(
                                            headlineReview.suggestedHeadline ??
                                                headlineReview.suggestion ??
                                                ""
                                        )
                                    }
                                    aria-label="Copy suggested headline"
                                    title="Copy headline"
                                >
                                    ▢
                                </button>
                            </div>
                        </section>

                        <section className="li-report__card li-report__strengths">
                            <div className="li-report__card-heading">
                                <span className="li-report__heading-icon">✦</span>
                                <h2><span>Strengths</span></h2>
                            </div>
                            <ul className="li-report__list">
                                {displayList(strengths).map((item, index) => (
                                    <li key={`${index}-${item}`}>
                                        <span>✓</span>{item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="li-report__card li-report__improve">
                            <div className="li-report__card-heading">
                                <span className="li-report__heading-icon">⚠</span>
                                <h2>Areas to <span>Improve</span></h2>
                            </div>
                            <ul className="li-report__list">
                                {displayList(improvements).map((item, index) => (
                                    <li key={`${index}-${item}`}>
                                        <span>↗</span>{item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="li-report__card li-report__skills">
                            <div className="li-report__card-heading">
                                <span className="li-report__heading-icon">▥</span>
                                <h2>Skills <span>Analysis</span></h2>
                            </div>
                            {(Array.isArray(skills) ? skills : []).map(
                                (skill, index) => {
                                    const name =
                                        typeof skill === "string"
                                            ? skill
                                            : skill.name ?? skill.skill ?? "Skill";
                                    const level = Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Number(
                                                typeof skill === "string"
                                                    ? 75
                                                    : skill.level ?? skill.score ?? 75
                                            )
                                        )
                                    );

                                    return (
                                        <div
                                            className="li-report__skill"
                                            key={`${index}-${name}`}
                                        >
                                            <div>
                                                <span>{name}</span>
                                                <b>{level}%</b>
                                            </div>
                                            <div className="li-report__bar">
                                                <span style={{ width: `${level}%` }} />
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </section>
                    </div>
                </div>
            </section>

            <section className="li-report__action-card li-report__card">
                <div className="li-report__card-heading">
                    <span className="li-report__heading-icon">↗</span>
                    <div>
                        <h2>Action <span>Plan</span></h2>
                        <p>Small improvements. Stronger professional impact.</p>
                    </div>
                    <span className="li-report__tag">YOUR NEXT STEPS</span>
                </div>

                <div className="li-report__timeline">
                    {(Array.isArray(actions) ? actions : []).map(
                        (action, index) => {
                            const title =
                                typeof action === "string"
                                    ? action
                                    : action.title ?? action.action ?? "Next step";
                            const description =
                                typeof action === "string"
                                    ? ""
                                    : action.description ?? action.reason ?? "";
                            const priority =
                                typeof action === "string"
                                    ? "Medium"
                                    : action.priority ?? "Medium";

                            return (
                                <article
                                    className="li-report__action"
                                    key={`${index}-${title}`}
                                >
                                    <span className="li-report__action-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div className="li-report__action-copy">
                                        <h3>{title}</h3>
                                        <p>{description}</p>
                                    </div>
                                    <span
                                        className={`li-report__priority li-report__priority--${String(
                                            priority
                                        ).toLowerCase()}`}
                                    >
                                        {priority} priority
                                    </span>
                                </article>
                            );
                        }
                    )}
                </div>
            </section>

            <footer className="li-report__footer">
                <span>INTERVIEW AI MASTER</span>
                <p>Built to turn professional potential into progress.</p>
                <button
                    type="button"
                    onClick={() => navigate("/linkedin-analyzer")}
                >
                    Analyze another profile ↗
                </button>
            </footer>
        </main>
    );
}

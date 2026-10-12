
import { useState } from "react";
import { useNavigate } from "react-router";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";

const NAV_ITEMS = [
    {
        id: "technical",
        label: "Technical Questions",
        icon: "code",
    },
    {
        id: "hr",
        label: "HR Questions",
        icon: "users",
    },
    {
        id: "behavioral",
        label: "Behavioral Questions",
        icon: "message",
    },
    {
        id: "roadmap",
        label: "Learning Roadmap",
        icon: "roadmap",
    },
];

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false);

    return (
        <article className="q-card">
            <button
                type="button"
                className="q-card__header"
                onClick={() => setOpen((previous) => !previous)}
                aria-expanded={open}
            >
                <span className="q-card__index">
                    Q{index + 1}
                </span>

                <span className="q-card__question">
                    {item.question || "Question unavailable"}
                </span>

                <span
                    className={`q-card__chevron ${
                        open ? "q-card__chevron--open" : ""
                    }`}
                    aria-hidden="true"
                >
                    {open ? "−" : "+"}
                </span>
            </button>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">
                            Interviewer's Intention
                        </span>

                        <p>
                            {item.intention ||
                                "The intention has not been provided."}
                        </p>
                    </div>

                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">
                            Suggested Answer
                        </span>

                        <p>
                            {item.answer ||
                                "A sample answer is not available."}
                        </p>
                    </div>
                </div>
            )}
        </article>
    );
};

const RoadMapDay = ({ day }) => {
    const tasks = Array.isArray(day.tasks) ? day.tasks : [];

    return (
        <article className="roadmap-day">
            <div className="roadmap-day__header">
                <span className="roadmap-day__badge">
                    Day {day.day}
                </span>

                <h3 className="roadmap-day__focus">
                    {day.focus || "Preparation"}
                </h3>
            </div>

            {tasks.length > 0 ? (
                <ul className="roadmap-day__tasks">
                    {tasks.map((task, index) => (
                        <li key={`${day.day}-${index}`}>
                            <span className="roadmap-day__bullet" />
                            {task}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No preparation tasks are available for this day.</p>
            )}
        </article>
    );
};

const Interview = () => {
    const [activeNav, setActiveNav] = useState("technical");

    const {
        report,
        loading,
        getResumePdf,
    } = useInterview();

    const navigate = useNavigate();

    // Protect the UI when optional fields are missing.
    const technicalQuestions = Array.isArray(report?.technicalQuestions)
        ? report.technicalQuestions
        : [];

    const hrQuestions = Array.isArray(report?.hrQuestions)
        ? report.hrQuestions
        : [];

    const behavioralQuestions = Array.isArray(report?.behavioralQuestions)
        ? report.behavioralQuestions
        : [];

    const preparationPlan = Array.isArray(report?.preparationPlan)
        ? report.preparationPlan
        : [];

    const skillGaps = Array.isArray(report?.skillGaps)
        ? report.skillGaps
        : [];

    const score = Number(report?.matchScore);

    const hasMatchScore =
        report?.matchScore !== null &&
        report?.matchScore !== undefined &&
        Number.isFinite(score) &&
        score >= 0 &&
        score <= 100;

    const scoreColor = !hasMatchScore
        ? ""
        : score >= 80
        ? "score--high"
        : score >= 60
        ? "score--mid"
        : "score--low";

    const scoreDescription = !hasMatchScore
        ? "Match score is not available"
        : score >= 80
        ? "Strong profile alignment"
        : score >= 60
        ? "Moderate profile alignment"
        : "Improvement opportunities identified";

    const questionsBySection = {
        technical: technicalQuestions,
        hr: hrQuestions,
        behavioral: behavioralQuestions,
    };

    const activeQuestions = questionsBySection[activeNav];

    const handleDownloadResume = async () => {
        try {
            await getResumePdf(report._id);
        } catch (error) {
            console.error("Resume download failed:", error);
            window.alert(
                "Unable to download the resume. Please try again."
            );
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
                <p>
                    Please wait while your report is being loaded.
                </p>
            </main>
        );
    }

    if (!report) {
        return (
            <main className="loading-screen">
                <h1>Interview report not found</h1>

                <p>
                    The report could not be loaded. It may not exist
                    or may no longer be accessible.
                </p>

                <button
                    type="button"
                    className="button primary-button"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </main>
        );
    }

    return (
        <div className="interview-page">
            <div className="interview-layout">

                {/* Left Navigation */}
                <nav className="interview-nav">
                    <div className="nav-content">
                        <p className="interview-nav__label">
                            Interview Preparation
                        </p>

                        {NAV_ITEMS.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                className={`interview-nav__item ${
                                    activeNav === item.id
                                        ? "interview-nav__item--active"
                                        : ""
                                }`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="interview-nav__icon">
                                    {item.icon === "code" && "‹ / ›"}
                                    {item.icon === "users" && "♙"}
                                    {item.icon === "message" && "☏"}
                                    {item.icon === "roadmap" && "↗"}
                                </span>

                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleDownloadResume}
                        className="button primary-button"
                    >
                        Download Resume
                    </button>
                </nav>

                <div className="interview-divider" />

                {/* Main Content */}
                <main className="interview-content">

                    {questionsBySection[activeNav] && (
                        <section>
                            <div className="content-header">
                                <h2>
                                    {NAV_ITEMS.find(
                                        (item) => item.id === activeNav
                                    )?.label}
                                </h2>

                                <span className="content-header__count">
                                    {activeQuestions.length} questions
                                </span>
                            </div>

                            {activeQuestions.length > 0 ? (
                                <div className="q-list">
                                    {activeQuestions.map((question, index) => (
                                        <QuestionCard
                                            key={`${activeNav}-${index}`}
                                            item={question}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <h3>No questions available yet</h3>

                                    <p>
                                        This section contains no saved
                                        questions. Generate a new report
                                        after the AI question generator
                                        has been configured.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}

                    {activeNav === "roadmap" && (
                        <section>
                            <div className="content-header">
                                <h2>Personalized Learning Roadmap</h2>

                                <span className="content-header__count">
                                    {preparationPlan.length} days
                                </span>
                            </div>

                            {preparationPlan.length > 0 ? (
                                <div className="roadmap-list">
                                    {preparationPlan.map((day, index) => (
                                        <RoadMapDay
                                            key={day.day ?? index}
                                            day={day}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <h3>No learning roadmap available</h3>

                                    <p>
                                        The saved report does not contain
                                        a preparation plan yet.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}
                </main>

                <div className="interview-divider" />

                {/* Right Sidebar */}
                <aside className="interview-sidebar">
                    <div className="match-score">
                        <p className="match-score__label">
                            Resume–Job Match Score
                        </p>

                        <div
                            className={`match-score__ring ${scoreColor}`}
                        >
                            <span className="match-score__value">
                                {hasMatchScore ? score : "—"}
                            </span>

                            {hasMatchScore && (
                                <span className="match-score__pct">
                                    %
                                </span>
                            )}
                        </div>

                        <p className="match-score__sub">
                            {scoreDescription}
                        </p>
                    </div>

                    <div className="sidebar-divider" />

                    <div className="skill-gaps">
                        <p className="skill-gaps__label">
                            Skills to Improve
                        </p>

                        {skillGaps.length > 0 ? (
                            <div className="skill-gaps__list">
                                {skillGaps.map((gap, index) => {
                                    const severity = [
                                        "low",
                                        "medium",
                                        "high",
                                    ].includes(gap.severity)
                                        ? gap.severity
                                        : "medium";

                                    return (
                                        <span
                                            key={`${gap.skill}-${index}`}
                                            className={`skill-tag skill-tag--${severity}`}
                                        >
                                            {gap.skill}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="empty-state__text">
                                No skill-gap data is available in this report.
                            </p>
                        )}
                    </div>

                    <div className="sidebar-divider" />

                    <div className="report-summary">
                        <p className="skill-gaps__label">
                            Target Role
                        </p>

                        <p>
                            {report.title || "Interview Preparation"}
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Interview;

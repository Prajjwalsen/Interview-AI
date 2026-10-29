
import { useNavigate } from "react-router";
import "./AnalyzerDashboard.scss";

const analyzers = [
    {
        id: "resume",
        title: "Resume Analyzer",
        description:
            "Analyze your resume, identify skill gaps, and prepare for your next opportunity.",
        gif: "/Resume.gif",
        path: "/resume-analyzer",
    },
    {
        id: "linkedin",
        title: "LinkedIn Profile Analyzer",
        description:
            "Review your professional profile and discover opportunities to improve it.",
        gif: "/Linkedin.gif",
        path: "/linkedin-analyzer",
    },
    {
        id: "github",
        title: "GitHub Profile Analyzer",
        description:
            "Evaluate your developer profile, repositories, and project presentation.",
        gif: "/Github.gif",
        path: "/github-analyzer",
    },
];

export default function AnalyzerDashboard() {
    const navigate = useNavigate();

    return (
        <main className="analyzer-dashboard">
            <header className="analyzer-header">
                <span className="analyzer-eyebrow">
                    INTERVIEW AI MASTER
                </span>

                <h1>
                    Choose Your <span>Analyzer</span>
                </h1>

                <p>
                    Choose a profile to get started. Your career,
                    your next opportunity.
                </p>
            </header>

            <section className="analyzer-grid">
                {analyzers.map((item) => (
                    <article
                        className={`analyzer-card analyzer-card--${item.id}`}
                        key={item.id}
                    >
                        <img
                            src={item.gif}
                            alt=""
                            aria-hidden="true"
                            className="analyzer-card__background-gif"
                        />

                        <div className="analyzer-card__overlay" />

                        <div className="analyzer-card__content">
                            {item.tag && (
                                <span className="analyzer-tag">
                                    {item.tag}
                                </span>
                            )}

                            <h2>{item.title}</h2>

                            <p>{item.description}</p>

                            <button
                                type="button"
                                onClick={() => navigate(item.path)}
                            >
                                Open Analyzer <span>→</span>
                            </button>
                        </div>
                    </article>
                ))}
            </section>

            <footer className="analyzer-footer">
                POWERED BY INTERVIEW AI MASTER
            </footer>
        </main>
    );
}

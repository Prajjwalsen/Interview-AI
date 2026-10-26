
import { useState } from "react";
import { useNavigate } from "react-router";
import "./AnalyzerPlaceholder.scss";

export default function AnalyzerPlaceholder({ platform }) {
    const navigate = useNavigate();
    const [profileUrl, setProfileUrl] = useState("");
    const [error, setError] = useState("");

    const isLinkedIn = platform === "LinkedIn";


    function handleAnalyze(event) {
        
        event.preventDefault();
        setError("");

        const rawValue = profileUrl.trim();

        if (!rawValue) {
            setError("Please enter your LinkedIn profile URL.");
            return;
        }

        const value = /^https?:\/\//i.test(rawValue)
            ? rawValue
            : `https://${rawValue}`;

        let parsedUrl;

        try {
            parsedUrl = new URL(value);
        } catch {
            setError("Please enter a valid LinkedIn profile URL.");
            return;
        }

        const hostname = parsedUrl.hostname.toLowerCase();
        const isLinkedIn =
            hostname === "linkedin.com" ||
            hostname === "www.linkedin.com";

        const isProfileUrl = /^\/in\/[^/]+\/?$/.test(parsedUrl.pathname);

        if (!isLinkedIn || !isProfileUrl) {
            setError(
                "Enter a valid profile URL, such as linkedin.com/in/your-profile"
            );
            return;
        }

        navigate("/linkedin-analyzer/loading", {
            state: { profileUrl: value }
        });
    }


    if (!isLinkedIn) {
        return (
            <main className="analyzer-dashboard">
                <section className="analyzer-header">
                    <h1>
                        {platform} <span>Analyzer</span>
                    </h1>
                    <p>This analyzer is being prepared.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Dashboard
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="linkedin-analyzer">
            <button
                className="linkedin-analyzer__back"
                type="button"
                onClick={() => navigate("/")}
            >
                <span aria-hidden="true">←</span> Dashboard
            </button>

            <section className="linkedin-analyzer__hero">
                <div className="linkedin-analyzer__visual">
                    <img
                        src="/linkedin-scan.png"
                        alt="AI robots analyzing a LinkedIn profile"
                        className="linkedin-analyzer__image"
                    />

                    <div className="linkedin-analyzer__visual-label">
                        <span className="linkedin-analyzer__live-dot" />
                        AI PROFILE INTELLIGENCE
                    </div>
                </div>

                <div className="linkedin-analyzer__content">
                    <span className="linkedin-analyzer__eyebrow">
                        INTERVIEW AI MASTER 
                    </span>

                    <h1>
                        LinkedIn <span>Analyzer</span>
                    </h1>

                    <p className="linkedin-analyzer__description">
                        Turn your LinkedIn profile into a stronger
                        professional presence. Review your profile and
                        discover opportunities to improve your career story.
                    </p>

                    <form
                        className="linkedin-analyzer__form"
                        onSubmit={handleAnalyze}
                        noValidate 
                    >
                        <label htmlFor="linkedin-profile-url">
                            LINKEDIN PROFILE URL
                        </label>

                        <div className="linkedin-analyzer__input-wrap">
                            <span aria-hidden="true">in</span>
                            <input
                                id="linkedin-profile-url"
                                type="text"
                                value={profileUrl}
                                onChange={(event) =>
                                    setProfileUrl(event.target.value)
                                }
                                placeholder="https://www.linkedin.com/in/your-profile"
                                autoComplete="url"
                            />
                        </div>

                        {error && (
                            <p
                                className="linkedin-analyzer__error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            className="linkedin-analyzer__submit"
                            type="submit"
                        >
                            Analyze Profile
                            <span aria-hidden="true">↗</span>
                        </button>
                    </form>

                    <div className="linkedin-analyzer__features">
                        <div>
                            <span>01</span>
                            <p>Profile overview</p>
                        </div>
                        <div>
                            <span>02</span>
                            <p>Skills & experience</p>
                        </div>
                        <div>
                            <span>03</span>
                            <p>Improvement insights</p>
                        </div>
                    </div>

                    <p className="linkedin-analyzer__note">
                        Only analyze profiles and information you are
                        authorized to access.
                    </p>
                </div>
            </section>
        </main>
    );
}


import { useState } from "react";
import { useNavigate } from "react-router";
import "./AnalyzerPlaceholder.scss";

export default function AnalyzerPlaceholder({ platform }) {
    const navigate = useNavigate();

    const [profileUrl, setProfileUrl] = useState("");
    const [profileText, setProfileText] = useState("");
    const [error, setError] = useState("");

    const isLinkedIn = platform === "LinkedIn";


    function handleAnalyze(event) {
        event.preventDefault();
        setError("");

        const rawValue = profileUrl.trim();
        const content = profileText.trim();

        // Both fields are mandatory.
        if (!rawValue) {
            setError("Please enter your LinkedIn profile URL.");
            return;
        }

        if (!content) {
            setError("Please paste your LinkedIn profile content.");
            return;
        }

        // Profile content must contain at least 50 characters.
        if (content.length < 50) {
            setError(
                "Please paste at least 50 characters of your LinkedIn profile content."
            );
            return;
        }

        const normalizedValue = /^https?:\/\//i.test(rawValue)
            ? rawValue
            : `https://${rawValue}`;

        let parsedUrl;

        try {
            parsedUrl = new URL(normalizedValue);
        } catch {
            setError("Please enter a valid LinkedIn profile URL.");
            return;
        }

        const hostname = parsedUrl.hostname.toLowerCase();

        const validHost =
            hostname === "linkedin.com" ||
            hostname === "www.linkedin.com";

        const validProfilePath = /^\/in\/[^/]+\/?$/.test(
            parsedUrl.pathname
        );

        if (!validHost || !validProfilePath) {
            setError(
                "Enter a valid profile URL, such as linkedin.com/in/your-profile"
            );
            return;
        }

        navigate("/linkedin-analyzer/loading", {
            state: {
                profileUrl: parsedUrl.href,
                profileText: content
            }
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
                </div>

                <div className="linkedin-analyzer__content">
                    <span className="linkedin-analyzer__eyebrow">
                        INTERVIEW AI MASTER
                    </span>

                    <h1>
                        LinkedIn<span>ator</span>
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
                                onChange={(event) => {
                                    setProfileUrl(event.target.value);
                                    setError("");
                                }}
                                placeholder="https://www.linkedin.com/in/your-profile"
                                autoComplete="url"
                            />
                        </div>

                        <label htmlFor="linkedin-profile-content">
                            PROFILE CONTENT
                        </label>

                        <textarea
                            id="linkedin-profile-content"
                            className="linkedin-analyzer__textarea"
                            value={profileText}
                            onChange={(event) => {
                                setProfileText(event.target.value);
                                setError("");
                            }}
                            placeholder="Paste your LinkedIn headline, About section, skills, experience, and projects here..."
                            rows={7}
                            required
                        />

                        <p className="linkedin-analyzer__note">
                            You can provide a LinkedIn URL, profile content,
                            or both. For more useful recommendations, include
                            your headline, About section, skills, experience,
                            or projects.
                        </p>

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
                        Only submit profile information you are authorized
                        to share.
                    </p>
                </div>
            </section>
        </main>
    );
}

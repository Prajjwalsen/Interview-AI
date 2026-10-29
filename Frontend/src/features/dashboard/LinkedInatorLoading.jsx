
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { analyzeLinkedInProfile } from "./services/linkedin.api";
import "./LinkedInatorLoading.scss";

export default function LinkedInatorLoading() {
    const location = useLocation();
    const navigate = useNavigate();

    const profileUrl =
        typeof location.state?.profileUrl === "string"
            ? location.state.profileUrl
            : "";

    const profileText =
        typeof location.state?.profileText === "string"
            ? location.state.profileText
            : "";

    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();


        async function runAnalysis() {
            const url = profileUrl.trim();
            const content = profileText.trim();

            if (!url || !content) {
                setError(
                    "Both LinkedIn profile URL and profile content are required. Please go back and provide both."
                );
                return;
            }

            if (content.length < 50) {
                setError(
                    "Please provide at least 50 characters of LinkedIn profile content."
                );
                return;
            }

            const validLinkedInUrl =
                /^https?:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?(?:[?#].*)?$/i;

            if (!validLinkedInUrl.test(url)) {
                setError("Please provide a valid LinkedIn profile URL.");
                return;
            }

            setError("");

            try {
                const result = await analyzeLinkedInProfile(
                    url,
                    content,
                    { signal: controller.signal }
                );

                if (!cancelled) {
                    navigate("/linkedin-analyzer/report", {
                        replace: true,
                        state: {
                            result,
                            profileUrl: url
                        }
                    });
                }
            } catch (err) {
                if (!cancelled && err.name !== "AbortError") {
                    console.error("LinkedInator analysis failed:", err);
                    setError(
                        err.message || "Unable to analyze this LinkedIn profile."
                    );
                }
            }
        }


        runAnalysis();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [profileUrl, profileText, navigate, retryCount]);

    function goBack() {
        navigate("/linkedin-analyzer", { replace: true });
    }


    function retryAnalysis() {
        const url = profileUrl.trim();
        const content = profileText.trim();

        if (!url || !content || content.length < 50) {
            goBack();
            return;
        }

        const validLinkedInUrl =
            /^https?:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?(?:[?#].*)?$/i;

        if (!validLinkedInUrl.test(url)) {
            goBack();
            return;
        }

        setError("");
        setRetryCount((count) => count + 1);
    }


    return (
        <main className="linkedinator-loading">
            <section className="linkedinator-loading__card">
                <div className="linkedinator-loading__scanner">
                    <img
                        src="/linkedin-logo.gif"
                        alt="LinkedIn logo"
                        className="linkedinator-loading__logo"
                    />
                    <span className="linkedinator-loading__scan-line" />
                </div>

                <p className="linkedinator-loading__eyebrow">
                    INTERVIEW AI MASTER
                </p>

                <h1>
                    LinkedIn<span>ator</span>
                </h1>

                {error ? (
                    <div
                        className="linkedinator-loading__error"
                        role="alert"
                    >
                        <h2>Analysis interrupted</h2>
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={retryAnalysis}
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>Analyzing your professional profile...</h2>

                        <p className="linkedinator-loading__description">
                            LinkedInator is reviewing the information you
                            provided and preparing your AI insights.
                        </p>

                        {profileUrl.trim() && (
                            <p className="linkedinator-loading__url">
                                {profileUrl.trim()}
                            </p>
                        )}

                        <div
                            className="linkedinator-loading__progress"
                            role="progressbar"
                            aria-label="LinkedIn analysis in progress"
                        >
                            <span />
                        </div>
                    </>
                )}

                <button
                    type="button"
                    onClick={goBack}
                >
                    Back to LinkedIn Analyzer
                </button>
            </section>
        </main>
    );
}

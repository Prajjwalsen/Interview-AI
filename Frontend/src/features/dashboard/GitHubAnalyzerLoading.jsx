
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { analyzeGitHubProfile } from "./services/github.api";
import "./GitHubAnalyzerLoading.scss";

export default function GitHubAnalyzerLoading() {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username;

    const [error, setError] = useState("");

    useEffect(() => {
        if (!username) return;

        let cancelled = false;

        async function runAnalysis() {
            try {
                const data = await analyzeGitHubProfile(username);

                if (!cancelled) {
                    navigate("/github-analyzer/report", {
                        replace: true,
                        state: { result: data }
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Unable to analyze this GitHub profile."
                    );
                }
            }
        }

        runAnalysis();

        return () => {
            cancelled = true;
        };
    }, [username, navigate]);

    return (
        <main className="github-loading">
            <div className="github-loading__content">
                <img
                    src="/github-logo.gif"
                    alt="GitHub logo"
                    className="github-loading__logo"
                />

                <p className="github-loading__brand">
                    Git<span>Sherlock</span>
                </p>

                <p className="github-loading__eyebrow">
                    GITHUB PORTFOLIO ANALYSIS
                </p>

                {error ? (
                    <div className="github-loading__error" role="alert">
                        <h1>Analysis interrupted</h1>
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/github-analyzer", {
                                    replace: true
                                })
                            }
                        >
                            Back to GitHub Analyzer
                        </button>
                    </div>
                ) : !username ? (
                    <div className="github-loading__error" role="alert">
                        <h1>Profile not provided</h1>
                        <p>Return to the analyzer and enter a GitHub username.</p>

                        <button
                            type="button"
                            onClick={() => navigate("/github-analyzer", { replace: true })}
                        >
                            Back to GitHub Analyzer
                        </button>
                    </div>
                ) : (
                    <>
                        <h1>GitSherlock is on the case</h1>

                        <p className="github-loading__description">
                            Fetching public repositories and preparing your AI portfolio review.
                        </p>

                        <div
                            className="github-loading__progress"
                            role="progressbar"
                            aria-label="GitHub analysis in progress"
                        >
                            <span />
                        </div>

                        <div className="github-loading__steps">
                            <p><span /> Fetching GitHub profile</p>
                            <p><span /> Reviewing public repositories</p>
                            <p><span /> Generating AI insights</p>
                        </div>

                        <p className="github-loading__note">
                            Analysis may take a little while. Please keep this page open.
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}

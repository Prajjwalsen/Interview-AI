
import { useNavigate } from "react-router";

export default function AnalyzerPlaceholder({ platform }) {
    const navigate = useNavigate();

    const isLinkedIn = platform === "LinkedIn";

    return (
        <main className="analyzer-dashboard">
            <section className="analyzer-header">
                <span className="analyzer-eyebrow">
                    INTERVIEW AI MASTER
                </span>

                <h1>
                    {platform} <span>Analyzer</span>
                </h1>

                <p>
                    {isLinkedIn
                        ? "Your professional profile analysis workspace."
                        : "Your developer profile and repository analysis workspace."}
                </p>

                <div style={{ marginTop: "32px" }}>
                    <span className="analyzer-tag">
                        COMING SOON
                    </span>

                    <p style={{ marginTop: "18px" }}>
                        This analyzer is being prepared. The analysis
                        features will be added in a future update.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/analyzers")}
                        style={{
                            marginTop: "16px",
                            padding: "12px 20px",
                            border: 0,
                            borderRadius: "10px",
                            background: "#ff2d78",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: 700,
                        }}
                    >
                        ← Back to Analyzers
                    </button>
                </div>
            </section>
        </main>
    );
}

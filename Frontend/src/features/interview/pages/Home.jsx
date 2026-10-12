
import { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

const Home = () => {
    const { loading, generateReport, reports } = useInterview();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const resumeInputRef = useRef(null);
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        setErrorMessage("");

        const resumeFile = resumeInputRef.current?.files?.[0];

        // Validate job description
        if (!jobDescription.trim()) {
            setErrorMessage(
                "Please enter the target job description."
            );
            return;
        }

        // Require either a resume or self-description
        if (!resumeFile && !selfDescription.trim()) {
            setErrorMessage(
                "Please upload a resume or enter your self-description."
            );
            return;
        }

        // Validate file type
        if (resumeFile) {
            const isPdf =
                resumeFile.type === "application/pdf" ||
                resumeFile.name.toLowerCase().endsWith(".pdf");

            if (!isPdf) {
                setErrorMessage("Please upload a PDF file only.");
                return;
            }

            // Validate file size (5 MB maximum)
            if (resumeFile.size > 5 * 1024 * 1024) {
                setErrorMessage(
                    "Resume size must not exceed 5 MB."
                );
                return;
            }
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            if (!data?._id) {
                throw new Error(
                    "The report was not saved successfully. Please try again."
                );
            }

            // Navigate to the generated report
            navigate(`/interview/${data._id}`);
        } catch (error) {
            console.error(
                "Report generation failed:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                "Unable to generate your interview report. Please try again."
            );
        }
    };

    
    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loader-content">
                    <div className="ribbon-loader" aria-label="Generating interview strategy">
                        <svg
                            className="ribbon-loader__svg"
                            viewBox="0 0 240 200"
                            role="img"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient
                                    id="ribbonGradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#ff2d78" />
                                    <stop offset="50%" stopColor="#ff6b9d" />
                                    <stop offset="100%" stopColor="#7d8590" />
                                </linearGradient>
                            </defs>

                            <g className="ribbon-loader__ribbon">
                                <path d="M75 30 C75 10 165 10 165 30 C165 50 75 50 75 70 C75 90 165 90 165 70 C165 50 75 50 75 90 C75 110 165 110 165 130 C165 150 75 150 75 130 C75 110 165 110 165 150 C165 170 75 170 75 150" />
                                <path d="M75 30 C75 50 165 50 165 70 C165 90 75 90 75 70 C75 50 165 50 165 90 C165 110 75 110 75 130 C75 150 165 150 165 130 C165 110 75 110 75 150 C75 170 165 170 165 150" />
                            </g>
                        </svg>
                    </div>

                    <h1 className="loader-title">
                        Building Your <span>Interview Strategy</span>
                    </h1>

                    <p className="loader-description">
                        Our AI is analyzing your profile to create a
                        personalized interview roadmap.
                    </p>

                    <div className="analysis-cards">
                        <div className="analysis-card">
                            <span>📄</span>
                            <span>Resume Analysis</span>
                            <i />
                        </div>

                        <div className="analysis-card">
                            <span>📊</span>
                            <span>Skill Matching</span>
                            <i />
                        </div>

                        <div className="analysis-card">
                            <span>✨</span>
                            <span>Interview Prep</span>
                            <i />
                        </div>
                    </div>

                    <div className="loader-progress">
                        <div className="loader-progress__bar" />
                    </div>

                    <p className="loader-wait">
                        <span className="loader-spinner" />
                        Analyzing your career potential...
                    </p>

                    <p className="loader-footer">
                        PERSONALIZED FOR YOUR NEXT OPPORTUNITY
                    </p>
                </div>
            </main>
        );
    }


    return (
        <div className="home-page">

            {/* Page Header */}
            <header className="page-header">
                <h1>
                    Create Your Custom{" "}
                    <span className="highlight">
                        Interview Plan
                    </span>
                </h1>

                <p>
                    Let our AI analyze the job requirements and
                    your unique profile to build a winning strategy.
                </p>
            </header>

            {/* Main Card */}
            <div className="interview-card">
                <div className="interview-card__body">

                    {/* Left Panel - Job Description */}
                    <div className="panel panel--left">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="2"
                                        y="7"
                                        width="20"
                                        height="14"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>

                            <h2>Target Job Description</h2>

                            <span className="badge badge--required">
                                Required
                            </span>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => {
                                setJobDescription(e.target.value);
                                setErrorMessage("");
                            }}
                            className="panel__textarea"
                            placeholder="Paste the full job description here..."
                            maxLength={5000}
                        />

                        <div className="char-counter">
                            {jobDescription.length} / 5000 chars
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="panel-divider" />

                    {/* Right Panel - Profile */}
                    <div className="panel panel--right">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>

                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className="upload-section">
                            <label className="section-label">
                                Upload Resume

                                <span className="badge badge--best">
                                    Best Results
                                </span>
                            </label>

                            <label
                                className="dropzone"
                                htmlFor="resume"
                            >
                                <span className="dropzone__icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="16 16 12 12 8 16" />
                                        <line
                                            x1="12"
                                            y1="12"
                                            x2="12"
                                            y2="21"
                                        />
                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                    </svg>
                                </span>

                                <p className="dropzone__title">
                                    Click to upload
                                </p>

                                <p className="dropzone__subtitle">
                                    PDF only (Max 5 MB)
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] || null;

                                        setSelectedResume(file);
                                        setErrorMessage("");
                                    }}
                                />
                            </label>

                            {/* Selected File Confirmation */}
                            {selectedResume && (
                                <div className="upload-success">
                                    <strong>Selected resume:</strong>
                                    <p>{selectedResume.name}</p>

                                    <p>
                                        {(selectedResume.size / 1024).toFixed(1)} KB
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedResume(null);

                                            if (resumeInputRef.current) {
                                                resumeInputRef.current.value = "";
                                            }

                                            setErrorMessage("");
                                        }}
                                    >
                                        Remove resume
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className="or-divider">
                            <span>OR</span>
                        </div>

                        {/* Quick Self-Description */}
                        <div className="self-description">
                            <label
                                className="section-label"
                                htmlFor="selfDescription"
                            >
                                Quick Self-Description
                            </label>

                            <textarea
                                value={selfDescription}
                                onChange={(e) => {
                                    setSelfDescription(e.target.value);
                                    setErrorMessage("");
                                }}
                                id="selfDescription"
                                name="selfDescription"
                                className="panel__textarea panel__textarea--short"
                                placeholder="Briefly describe your experience, key skills, projects, and background..."
                            />
                        </div>

                        {/* Information Box */}
                        <div className="info-box">
                            <span className="info-box__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line
                                        x1="12"
                                        y1="8"
                                        x2="12"
                                        y2="12"
                                        stroke="#1a1f27"
                                        strokeWidth="2"
                                    />
                                    <line
                                        x1="12"
                                        y1="16"
                                        x2="12.01"
                                        y2="16"
                                        stroke="#1a1f27"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </span>

                            <p>
                                Either a <strong>Resume</strong> or a{" "}
                                <strong>Self Description</strong> is required
                                to generate a personalized plan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="interview-card__footer">
                    <span className="footer-info">
                        AI-Powered Strategy Generation • Approx 30s
                    </span>

                    {/* Error Message */}
                    {errorMessage && (
                        <p
                            className="error-message"
                            role="alert"
                        >
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleGenerateReport}
                        className="generate-btn"
                        disabled={loading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L2 9.4h7.6z" />
                        </svg>

                        {loading
                            ? "Generating Your Report..."
                            : "Generate My Interview Strategy"}
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
                <section className="recent-reports">
                    <h2>My Recent Interview Plans</h2>

                    <ul className="reports-list">
                        {reports.map((report) => (
                            <li
                                key={report._id}
                                className="report-item"
                                onClick={() =>
                                    navigate(`/interview/${report._id}`)
                                }
                            >
                                <h3>
                                    {report.title || "Untitled Position"}
                                </h3>

                                <p className="report-meta">
                                    Generated on{" "}
                                    {new Date(
                                        report.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <p
                                    className={`match-score ${
                                        report.matchScore >= 80
                                            ? "score--high"
                                            : report.matchScore >= 60
                                            ? "score--mid"
                                            : "score--low"
                                    }`}
                                >
                                    Match Score:{" "}
                                    {Number.isFinite(report.matchScore)
                                        ? `${report.matchScore}%`
                                        : "Not available"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className="page-footer">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#help">Help Center</a>
            </footer>
        </div>
    );
};

export default Home;

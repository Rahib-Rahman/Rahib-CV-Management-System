import React, { useState, useEffect } from "react";
import { createSupportTicket } from "../services/api";

function SupportTicket({ positionTitle }) {
    const [summary, setSummary] = useState("");
    const [priority, setPriority] = useState("Average");
    const [pageLink, setPageLink] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageLink(window.location.href);
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const res = await createSupportTicket({
                summary,
                priority,
                positionTitle,
                pageLink,
            });

            setResult(res.data);
        } catch (err) {
            console.error("Support ticket error:", err);
            setError(err.response?.data?.error || "Failed to submit ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Support Ticket</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {result?.success && (
                <div className="alert alert-success">
                    Ticket uploaded successfully! File: {result.fileName}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Summary</label>
                <textarea
                    className="form-control"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Describe the issue briefly..."
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Priority</label>
                <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option>High</option>
                    <option>Average</option>
                    <option>Low</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Page Link</label>
                <input
                    type="text"
                    className="form-control"
                    value={pageLink}
                    onChange={(e) => setPageLink(e.target.value)}
                    readOnly
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit Ticket"}
            </button>
        </div>
    );
}

export default SupportTicket;

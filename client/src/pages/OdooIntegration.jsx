import React, { useState } from "react";
import { generateToken, getAggregatedResults } from "../services/api";

function OdooIntegration() {
    const [positionId, setPositionId] = useState("");
    const [token, setToken] = useState("");
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateToken = async () => {
        if (!positionId) return;
        try {
            setError(null);
            setLoading(true);
            const res = await generateToken(positionId);
            setToken(res.data.token);
        } catch (err) {
            console.error("Token generation error:", err);
            setError("Failed to generate token");
        } finally {
            setLoading(false);
        }
    };

    const handleFetchResults = async () => {
        if (!token) return;
        try {
            setError(null);
            setLoading(true);
            const res = await getAggregatedResults(token);
            setResults(res.data);
        } catch (err) {
            console.error("Aggregation fetch error:", err);
            setError("Failed to fetch aggregated results");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Odoo Integration Demo</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Position ID</label>
                <input
                    type="text"
                    className="form-control"
                    value={positionId}
                    onChange={(e) => setPositionId(e.target.value)}
                />
                <button
                    className="btn btn-primary mt-2"
                    onClick={handleGenerateToken}
                    disabled={loading || !positionId}
                >
                    {loading ? "Processing..." : "Generate Token"}
                </button>
            </div>

            {token && (
                <div className="mb-3">
                    <p><strong>Generated Token:</strong> {token}</p>
                    <button
                        className="btn btn-success"
                        onClick={handleFetchResults}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Fetch Aggregated Results"}
                    </button>
                </div>
            )}

            {results && (
                <div className="mt-4">
                    <h4>Aggregated Results</h4>
                    <p><strong>Position:</strong> {results.position}</p>

                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Applications</td>
                            <td>{results.aggregated.applications}</td>
                        </tr>
                        <tr>
                            <td>Shortlisted</td>
                            <td>{results.aggregated.shortlisted}</td>
                        </tr>
                        <tr>
                            <td>Hired</td>
                            <td>{results.aggregated.hired}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default OdooIntegration;

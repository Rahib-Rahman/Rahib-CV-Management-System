import React, { useState } from "react";
import { syncUserToSalesforce } from "../services/api";

function SalesforceSync() {
    const [userId, setUserId] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const res = await syncUserToSalesforce(userId, { extraInfo });
            setResult(res.data);
        } catch (err) {
            console.error("Salesforce sync error:", err);
            setError(err.response?.data?.error || "Failed to sync");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Salesforce Sync</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {result?.success && (
                <div className="alert alert-success">
                    Synced successfully! <br />
                    <strong>Account ID:</strong> {result.accountId} <br />
                    <strong>Contact ID:</strong> {result.contactId}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">User ID</label>
                <input
                    type="text"
                    className="form-control"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Extra Info (optional)</label>
                <input
                    type="text"
                    className="form-control"
                    value={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSync}
                disabled={loading || !userId}
            >
                {loading ? "Syncing..." : "Sync to Salesforce"}
            </button>
        </div>
    );
}

export default SalesforceSync;

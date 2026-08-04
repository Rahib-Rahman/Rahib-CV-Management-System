import axios from "axios";
import { useState } from "react";

function SalesforceSyncButton({ userId }) {
    const [extraInfo, setExtraInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSync = async () => {
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const res = await axios.post(`/api/salesforce/salesforce-sync/${userId}`, { extraInfo });
            setResult(res.data);
        } catch (err) {
            console.error("Salesforce sync error:", err);
            setError(err.response?.data?.details || err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3">
            <h5>Sync Profile to Salesforce</h5>
            <input
                type="text"
                placeholder="Extra info"
                className="form-control mb-2"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
            />
            <button
                className="btn btn-primary"
                onClick={handleSync}
                disabled={loading}
            >
                {loading ? "Syncing..." : "Sync to Salesforce"}
            </button>

            {result && result.success && (
                <div className="mt-3 alert alert-success">
                    <p>✅ Synced successfully!</p>
                    <p><strong>Account ID:</strong> {result.accountId}</p>
                    <p><strong>Contact ID:</strong> {result.contactId}</p>
                </div>
            )}

            {error && (
                <div className="mt-3 alert alert-danger">
                    <p>❌ Sync failed</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default SalesforceSyncButton;



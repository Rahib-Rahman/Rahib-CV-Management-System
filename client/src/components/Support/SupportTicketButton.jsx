import axios from "axios";
import { useState } from "react";

function SupportTicketButton({ user }) {
    const [summary, setSummary] = useState("");
    const [priority, setPriority] = useState("Average");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const res = await axios.post("/api/support-ticket", {
                summary,
                priority,
                userId: user.id,
                role: user.role,
                pageLink: window.location.href,
            });

            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <h5>Create Support Ticket</h5>
            <input
                type="text"
                placeholder="Summary"
                className="form-control mb-2"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <select
                className="form-select mb-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="High">High</option>
                <option value="Average">Average</option>
                <option value="Low">Low</option>
            </select>
            <button
                className="btn btn-warning"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit Ticket"}
            </button>

            {result && result.success && (
                <div className="mt-3 alert alert-success">
                    <p>✅ Ticket created successfully!</p>
                    {result.ticketId && <p><strong>Ticket ID:</strong> {result.ticketId}</p>}
                </div>
            )}

            {error && (
                <div className="mt-3 alert alert-danger">
                    <p>❌ Failed to create ticket</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default SupportTicketButton;


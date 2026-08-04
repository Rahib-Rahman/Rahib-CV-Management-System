import axios from "axios";
import { useState } from "react";

function PositionTokenButton({ positionId }) {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateToken = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.post(`/api/positions/${positionId}/token`);
            setToken(res.data.token);
        } catch (err) {
            console.error("Token generation error:", err);
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <button
                className="btn btn-info"
                onClick={generateToken}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate API Token"}
            </button>

            {token && (
                <p className="mt-2">
                    Token: <code>{token}</code>
                </p>
            )}

            {error && (
                <p className="mt-2 text-danger">
                    ❌ Failed to generate token: {error}
                </p>
            )}
        </div>
    );
}

export default PositionTokenButton;


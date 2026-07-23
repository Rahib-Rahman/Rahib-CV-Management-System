import React, { useState } from "react";
import { searchPositions, searchCVs } from "../services/api";

function Search() {
    const [query, setQuery] = useState("");
    const [positions, setPositions] = useState([]);
    const [cvs, setCVs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (type) => {
        if (!query.trim()) {
            setError("Please enter a search query");
            return;
        }
        try {
            setLoading(true);
            setError("");
            if (type === "positions") {
                const res = await searchPositions(query);
                setPositions(res.data);
                setCVs([]);
            } else {
                const res = await searchCVs(query);
                setCVs(res.data);
                setPositions([]);
            }
        } catch (err) {
            console.error("Search error:", err);
            setError("No results found");
            setPositions([]);
            setCVs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Search</h2>
            <div className="input-group mb-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="form-control"
                    placeholder="Enter search query"
                />
                <button
                    className="btn btn-primary"
                    onClick={() => handleSearch("positions")}
                    disabled={loading}
                >
                    Search Positions
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleSearch("cvs")}
                    disabled={loading}
                >
                    Search CVs
                </button>
            </div>

            {loading && <div>Searching...</div>}
            {error && <div className="text-danger">{error}</div>}

            {positions.length > 0 && (
                <div className="mt-4">
                    <h4>Positions</h4>
                    <ul className="list-group">
                        {positions.map((p) => (
                            <li key={p.id} className="list-group-item">
                                <strong>{p.title}</strong> — {p.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {cvs.length > 0 && (
                <div className="mt-4">
                    <h4>CVs</h4>
                    <ul className="list-group">
                        {cvs.map((cv) => (
                            <li key={cv.id} className="list-group-item">
                                Candidate: {cv.User?.name || "N/A"} | Position:{" "}
                                {cv.Position?.title || "N/A"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Search;

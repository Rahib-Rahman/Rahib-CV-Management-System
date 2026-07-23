import React, { useEffect, useState } from "react";
import { getCVs, createCV, publishCV, deleteCV } from "../services/api";

function CVs() {
    const [cvs, setCVs] = useState([]);
    const [positionId, setPositionId] = useState("");

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const res = await getCVs();
                setCVs(res.data);
            } catch (err) {
                console.error("Failed to fetch CVs:", err);
                alert("Error loading CVs");
            }
        };
        fetchCVs();
    }, []);

    const handleCreate = async () => {
        if (!positionId) {
            alert("Please enter a position ID");
            return;
        }
        try {
            const res = await createCV({ positionId });
            setCVs((prev) => [...prev, res.data]);
            setPositionId("");
        } catch (err) {
            console.error("Create CV error:", err);
            alert("Failed to create CV");
        }
    };

    const handlePublish = async (id) => {
        try {
            const res = await publishCV(id);
            setCVs((prev) =>
                prev.map((cv) =>
                    cv.id === id ? { ...cv, published: true, version: res.data.version } : cv
                )
            );
            alert("CV published!");
        } catch (err) {
            console.error("Publish CV error:", err);
            if (err.response?.data?.missing) {
                alert("Missing attributes: " + err.response.data.missing.join(", "));
            } else {
                alert("Failed to publish CV");
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCV(id);
            setCVs((prev) => prev.filter((cv) => cv.id !== id));
        } catch (err) {
            console.error("Delete CV error:", err);
            alert("Failed to delete CV");
        }
    };

    return (
        <div className="container mt-5">
            <h2>CVs</h2>
            <input
                type="text"
                placeholder="Position ID"
                className="form-control mt-2"
                value={positionId}
                onChange={(e) => setPositionId(e.target.value)}
            />
            <button onClick={handleCreate} className="btn btn-primary mt-3">
                Add CV
            </button>

            <ul className="list-group mt-4">
                {cvs.map((cv) => (
                    <li key={cv.id} className="list-group-item d-flex justify-content-between">
                        <div>
                            <strong>CV #{cv.id}</strong> — Position ID: {cv.positionId}
                            {cv.position?.title && <span> ({cv.position.title})</span>}
                            <br />
                            Published: {cv.published ? "Yes" : "No"} | Version: {cv.version || 0}
                        </div>
                        <div>
                            {!cv.published && (
                                <button
                                    onClick={() => handlePublish(cv.id)}
                                    className="btn btn-success btn-sm me-2"
                                >
                                    Publish
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(cv.id)}
                                className="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CVs;



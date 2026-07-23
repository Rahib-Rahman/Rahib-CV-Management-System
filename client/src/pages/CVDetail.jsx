import React, { useEffect, useState } from "react";
import { getCV, getLikes, addLike, removeLike } from "../services/api";
import ExportCVToPDF from "../components/ExportCVToPDF";

function CVDetail({ cvId }) {
    const [cv, setCV] = useState(null);
    const [likes, setLikes] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCV = await getCV(cvId);
                const resLikes = await getLikes(cvId);
                setCV(resCV.data);
                setLikes(resLikes.data.count);
            } catch (err) {
                console.error("Error fetching CV detail:", err);
                setError("Failed to load CV details");
            }
        };
        fetchData();
    }, [cvId]);

    const handleLike = async () => {
        try {
            await addLike(cvId);
            setLikes((prev) => prev + 1);
        } catch (err) {
            console.error("Like error:", err);
            alert("Failed to like CV");
        }
    };

    const handleUnlike = async () => {
        try {
            await removeLike(cvId);
            setLikes((prev) => Math.max(prev - 1, 0));
        } catch (err) {
            console.error("Unlike error:", err);
            alert("Failed to unlike CV");
        }
    };

    if (error) return <div className="container mt-5 text-danger">{error}</div>;
    if (!cv) return <div className="container mt-5">Loading CV details...</div>;

    return (
        <div className="container mt-5">
            <h2>CV #{cv.id}</h2>
            <p>
                <strong>Position ID:</strong> {cv.positionId}
            </p>
            <p>
                <strong>Status:</strong> {cv.published ? "Published" : "Draft"}
            </p>
            <p>
                <strong>Version:</strong> {cv.version || 0}
            </p>

            <h4 className="mt-4">Likes: {likes}</h4>
            <button onClick={handleLike} className="btn btn-success me-2">
                Like
            </button>
            <button onClick={handleUnlike} className="btn btn-danger">
                Unlike
            </button>

            <div className="mt-4">
                <ExportCVToPDF cvId={cvId} />
            </div>
        </div>
    );
}

export default CVDetail;

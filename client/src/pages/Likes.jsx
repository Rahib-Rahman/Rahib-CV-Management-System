import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLikes, addLike, removeLike } from "../services/api";
import { io } from "socket.io-client";

function Likes() {
    const { id } = useParams();
    const cvId = parseInt(id, 10);
    const [likes, setLikes] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikes = async () => {
            if (!cvId) return;
            try {
                const res = await getLikes(cvId);
                setLikes(res.data.likes);
            } catch (err) {
                console.error("Failed to fetch likes:", err);
                setError("Error loading likes");
            }
        };
        fetchLikes();
    }, [cvId]);

    useEffect(() => {
        const API_URL = "https://rahib-cv-management-system.onrender.com";
        const socket = io(API_URL);

        socket.on("likeUpdated", (likeData) => {
            if (likeData.cvId === cvId) {
                setLikes(likeData.likes);
            }
        });

        return () => socket.disconnect();
    }, [cvId]);

    const handleAdd = async () => {
        try {
            const res = await addLike(cvId);
            setLikes(res.data.likes ?? likes + 1);
            setError(null);
        } catch (err) {
            console.error("Add like error:", err);
            setError("You may have already liked this CV");
        }
    };

    const handleRemove = async () => {
        try {
            const res = await removeLike(cvId);
            setLikes(res.data.likes ?? Math.max(0, likes - 1));
            setError(null);
        } catch (err) {
            console.error("Remove like error:", err);
            setError("Failed to remove like");
        }
    };

    return (
        <div className="mt-3">
            <h4>Likes</h4>
            <p>Total Likes: {likes}</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <button onClick={handleAdd} className="btn btn-success me-2">
                👍 Like
            </button>
            <button onClick={handleRemove} className="btn btn-danger">
                👎 Unlike
            </button>
        </div>
    );
}

export default Likes;

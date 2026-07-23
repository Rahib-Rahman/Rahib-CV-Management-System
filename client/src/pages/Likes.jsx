import React, { useEffect, useState } from "react";
import { getLikes, addLike, removeLike } from "../services/api";

function Likes({ cvId }) {
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await getLikes(cvId);
                setLikes(res.data.likes);
            } catch (err) {
                console.error("Failed to fetch likes:", err);
                alert("Error loading likes");
            }
        };
        fetchLikes();
    }, [cvId]);

    const handleAdd = async () => {
        try {
            await addLike(cvId);
            setLikes((prev) => prev + 1);
        } catch (err) {
            console.error("Add like error:", err);
            alert("You may have already liked this CV");
        }
    };

    const handleRemove = async () => {
        try {
            await removeLike(cvId);
            setLikes((prev) => Math.max(prev - 1, 0));
        } catch (err) {
            console.error("Remove like error:", err);
            alert("Failed to remove like");
        }
    };

    return (
        <div className="mt-3">
            <p>Total Likes: {likes}</p>
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


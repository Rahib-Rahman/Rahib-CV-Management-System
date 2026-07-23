import React, { useEffect, useState } from "react";
import { getDiscussions, addDiscussion } from "../services/api";

function Discussions({ positionId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await getDiscussions(positionId);
                setComments(res.data);
            } catch (err) {
                console.error("Failed to fetch discussions:", err);
            }
        };
        fetchComments();
    }, [positionId]);

    const handleAdd = async () => {
        if (!newComment) return;
        try {
            const res = await addDiscussion(positionId, { content: newComment });
            setComments((prev) => [...prev, res.data]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    return (
        <div className="mt-4">
            <h4>Discussions</h4>
            <ul className="list-group">
                {comments.map((c) => (
                    <li key={c.id} className="list-group-item">
                        {c.content}
                    </li>
                ))}
            </ul>
            <div className="mt-3">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="form-control"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAdd} className="btn btn-primary mt-2">
                    Add Comment
                </button>
            </div>
        </div>
    );
}

export default Discussions;

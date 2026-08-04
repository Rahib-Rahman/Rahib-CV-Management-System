import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDiscussions, addDiscussion } from "../services/api";
import { io } from "socket.io-client";

function Discussions() {
    const { id } = useParams();
    const positionId = Number(id);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            if (!positionId) {
                setLoading(false);
                return;
            }
            try {
                const res = await getDiscussions(positionId);
                setComments(res.data || []);
            } catch (err) {
                console.error("Failed to fetch discussions:", err);
                setError("Error loading discussions");
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [positionId]);

    useEffect(() => {
        const API_URL = "https://rahib-cv-management-system.onrender.com";
        const socket = io(API_URL);

        socket.on("newPost", (post) => {
            if (post.positionId === positionId) {
                setComments((prev) => [...prev, post]);
            }
        });

        return () => socket.disconnect();
    }, [positionId]);

    const handleAdd = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await addDiscussion(positionId, { content: newComment });
            setComments((prev) => [...prev, res.data]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
            setError("Failed to add comment");
        }
    };

    if (loading) return <div>Loading discussions...</div>;

    return (
        <div className="mt-4">
            <h4>Discussions</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <ul className="list-group">
                    {comments.map((c) => (
                        <li key={c.id} className="list-group-item">
                            <strong>{c.user?.name || "Anonymous"}:</strong> {c.content}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-3">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="form-control"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    onClick={handleAdd}
                    className="btn btn-primary mt-2"
                    disabled={!newComment}
                >
                    Add Comment
                </button>
            </div>
        </div>
    );
}

export default Discussions;

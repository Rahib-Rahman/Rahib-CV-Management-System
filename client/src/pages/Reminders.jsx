import React, { useEffect, useState } from "react";
import {getReminders, createReminder, deleteReminder,} from "../services/api";

function Reminders() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [text, setText] = useState("");

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const res = await getReminders();
            setReminders(res.data || []);
            setError("");
        } catch (err) {
            console.error("Fetch reminders error:", err);
            setError("Failed to load reminders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await createReminder({ text });
            setText("");
            fetchReminders();
        } catch (err) {
            console.error("Create reminder error:", err);
            setError("Failed to create reminder");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reminder?")) return;
        try {
            await deleteReminder(id);
            fetchReminders();
        } catch (err) {
            console.error("Delete reminder error:", err);
            setError("Failed to delete reminder");
        }
    };

    if (loading) return <div className="container mt-5">Loading reminders...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Your Reminders</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="form-control"
                        placeholder="Enter reminder text"
                        required
                    />
                    <button type="submit" className="btn btn-primary">
                        Add Reminder
                    </button>
                </div>
            </form>

            {reminders.length > 0 ? (
                <ul className="list-group">
                    {reminders.map((r) => (
                        <li
                            key={r.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>{r.text}</span>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(r.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No reminders yet.</p>
            )}
        </div>
    );
}

export default Reminders;


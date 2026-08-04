import React, { useEffect, useState } from "react";
import { getReminders, createReminder, deleteReminder } from "../services/api";

function Reminders() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [text, setText] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [reminderType, setReminderType] = useState("popup");

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
        if (!text.trim() || !dueDate) return;
        try {
            const res = await createReminder({ text, dueDate, type: reminderType });
            setReminders((prev) => [...prev, res.data]);
            setText("");
            setDueDate("");
            setSuccess("Reminder added successfully!");
            setError("");
        } catch (err) {
            console.error("Create reminder error:", err);
            setError("Failed to create reminder");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reminder?")) return;
        try {
            await deleteReminder(id);
            setReminders((prev) => prev.filter((r) => r.id !== id));
            setSuccess("Reminder deleted successfully!");
            setError("");
        } catch (err) {
            console.error("Delete reminder error:", err);
            setError("Failed to delete reminder");
        }
    };

    if (loading) return <div className="container mt-5">Loading reminders...</div>;

    return (
        <div className="container mt-5">
            <h2>Your Reminders</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="form-control"
                        placeholder="Enter reminder text"
                        required
                    />
                </div>
                <div className="mb-2">
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-2">
                    <select
                        value={reminderType}
                        onChange={(e) => setReminderType(e.target.value)}
                        className="form-select"
                    >
                        <option value="popup">Popup Notification</option>
                        <option value="email">Email Notification</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Reminder
                </button>
            </form>

            {reminders.length > 0 ? (
                <ul className="list-group">
                    {reminders.map((r) => (
                        <li
                            key={r.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
              <span>
                {r.text}
                  {r.dueDate && (
                      <small className="text-muted ms-2">
                          ({new Date(r.dueDate).toLocaleString()})
                      </small>
                  )}
                  {r.type && (
                      <small className="text-muted ms-2">[{r.type}]</small>
                  )}
              </span>
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

import React, { useEffect, useState } from "react";
import {getProjects, createProject, updateProject, deleteProject,} from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        periodStart: "",
        periodEnd: "",
        description: "",
        tags: "",
    });
    const [editId, setEditId] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await getProjects();
            setProjects(res.data || []);
            setError("");
        } catch (err) {
            console.error("Fetch projects error:", err);
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                tags: form.tags
                    ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
                    : [],
            };

            if (editId) {
                await updateProject(editId, payload);
            } else {
                await createProject(payload);
            }

            setForm({
                name: "",
                periodStart: "",
                periodEnd: "",
                description: "",
                tags: "",
            });
            setEditId(null);
            fetchProjects();
        } catch (err) {
            console.error("Save project error:", err);
            setError("Failed to save project");
        }
    };

    const handleEdit = (project) => {
        setForm({
            name: project.name,
            periodStart: project.periodStart ? project.periodStart.slice(0, 10) : "",
            periodEnd: project.periodEnd ? project.periodEnd.slice(0, 10) : "",
            description: project.description || "",
            tags: project.tags ? project.tags.join(", ") : "",
        });
        setEditId(project.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteProject(id);
            fetchProjects();
        } catch (err) {
            console.error("Delete project error:", err);
            setError("Failed to delete project.");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    };

    if (loading) return <div className="container mt-5">Loading projects...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Your Projects</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Period Start</label>
                    <input
                        type="date"
                        name="periodStart"
                        value={form.periodStart}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Period End</label>
                    <input
                        type="date"
                        name="periodEnd"
                        value={form.periodEnd}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editId ? "Update Project" : "Create Project"}
                </button>
                {editId && (
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                            setEditId(null);
                            setForm({
                                name: "",
                                periodStart: "",
                                periodEnd: "",
                                description: "",
                                tags: "",
                            });
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h4>Existing Projects</h4>
            {projects.length > 0 ? (
                <ul className="list-group">
                    {projects.map((p) => (
                        <li
                            key={p.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{p.name}</strong>
                                <br />
                                <span>{p.description}</span>
                                <br />
                                <small>
                                    {formatDate(p.periodStart)} to {formatDate(p.periodEnd)} | Tags:{" "}
                                    {p.tags && p.tags.length > 0 ? p.tags.join(", ") : "None"}
                                </small>
                            </div>
                            <div>
                                <button
                                    className="btn btn-sm btn-info me-2"
                                    onClick={() => handleEdit(p)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No projects yet.</p>
            )}
        </div>
    );
}

export default Projects;


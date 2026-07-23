import React, { useEffect, useState } from "react";
import { getPositions, createPosition, updatePosition, deletePosition } from "../services/api";

function Positions() {
    const [positions, setPositions] = useState([]);
    const [form, setForm] = useState({
        title: "", description: "", accessRules: {}, attributes: [], projectTags: [], maxProjects: 0,
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const res = await getPositions();
                setPositions(res.data);
            } catch (err) {
                console.error("Failed to fetch positions:", err);
                alert("Error loading positions");
            }
        };
        fetchPositions();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (e, field) => {
        setForm({ ...form, [field]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await updatePosition(editingId, form);
                setPositions((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
                setEditingId(null);
            } else {
                const res = await createPosition(form);
                setPositions((prev) => [...prev, res.data]);
            }
            setForm({ title: "", description: "", accessRules: {}, attributes: [], projectTags: [], maxProjects: 0 });
        } catch (err) {
            console.error("Save position error:", err);
            alert("Failed to save position");
        }
    };

    const handleEdit = (pos) => {
        setForm({
            title: pos.title,
            description: pos.description,
            accessRules: pos.accessRules || {},
            attributes: pos.attributes || [],
            projectTags: pos.projectTags || [],
            maxProjects: pos.maxProjects,
        });
        setEditingId(pos.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this position?")) return;
        try {
            await deletePosition(id);
            setPositions((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Delete position error:", err);
            alert("Failed to delete position");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Positions</h2>

            <form onSubmit={handleSubmit} className="card p-3 mt-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="form-control mt-2"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    className="form-control mt-2"
                    value={form.description}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="attributes"
                    placeholder="Attributes (comma separated)"
                    className="form-control mt-2"
                    value={form.attributes.join(",")}
                    onChange={(e) => handleArrayChange(e, "attributes")}
                />
                <input
                    type="text"
                    name="projectTags"
                    placeholder="Project Tags (comma separated)"
                    className="form-control mt-2"
                    value={form.projectTags.join(",")}
                    onChange={(e) => handleArrayChange(e, "projectTags")}
                />
                <input
                    type="number"
                    name="maxProjects"
                    placeholder="Max Projects"
                    className="form-control mt-2"
                    value={form.maxProjects}
                    onChange={handleChange}
                />
                <button type="submit" className="btn btn-primary mt-3">
                    {editingId ? "Update Position" : "Add Position"}
                </button>
            </form>

            <ul className="list-group mt-4">
                {positions.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{p.title}</strong>
                            <br />
                            <small>{p.description}</small>
                            <br />
                            Attributes: {p.attributes?.join(", ") || "None"}
                            <br />
                            Tags: {p.projectTags?.join(", ") || "None"}
                            <br />
                            Max Projects: {p.maxProjects}
                        </div>
                        <div>
                            <button onClick={() => handleEdit(p)} className="btn btn-warning btn-sm me-2">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Positions;

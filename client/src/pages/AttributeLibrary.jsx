import React, { useEffect, useState } from "react";
import {
    getAttributes, createAttribute, updateAttribute, deleteAttribute,
} from "../services/api";

function AttributeLibrary() {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "", category: "", description: "", type: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                setLoading(true);
                const res = await getAttributes();
                setAttributes(res.data);
            } catch (err) {
                console.error("Fetch attributes error:", err);
                setError("Failed to load attributes");
            } finally {
                setLoading(false);
            }
        };
        fetchAttributes();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await updateAttribute(editingId, form);
                setAttributes((prev) =>
                    prev.map((attr) => (attr.id === editingId ? res.data : attr))
                );
                setEditingId(null);
            } else {
                const res = await createAttribute(form);
                setAttributes((prev) => [...prev, res.data]);
            }
            setForm({ name: "", category: "", description: "", type: "" });
        } catch (err) {
            console.error("Save attribute error:", err);
            setError("Failed to save attribute");
        }
    };

    const handleEdit = (attr) => {
        setForm({
            name: attr.name,
            category: attr.category,
            description: attr.description,
            type: attr.type,
        });
        setEditingId(attr.id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAttribute(id);
            setAttributes((prev) => prev.filter((attr) => attr.id !== id));
        } catch (err) {
            console.error("Delete attribute error:", err);
            setError("Failed to delete attribute");
        }
    };

    if (loading) return <div className="container mt-5">Loading attributes...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Attribute Library</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="skill">Skill</option>
                        <option value="education">Education</option>
                        <option value="experience">Experience</option>
                        <option value="language">Language</option>
                        <option value="certification">Certification</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label className="form-label">Description</label>
                    <input
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select type</option>
                        <option value="string">String</option>
                        <option value="text">Text</option>
                        <option value="numeric">Numeric</option>
                        <option value="date">Date</option>
                        <option value="period">Period</option>
                        <option value="boolean">Boolean</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="image">Image</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                    {editingId ? "Update Attribute" : "Add Attribute"}
                </button>
            </form>


            <ul className="list-group">
                {attributes.map((attr) => (
                    <li
                        key={attr.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{attr.name}</strong> ({attr.category}) — {attr.type}
                            <br />
                            <small className="text-muted">{attr.description}</small>
                            {attr.usageCount !== undefined && (
                                <div className="text-info">Used in {attr.usageCount} items</div>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(attr)}
                                className="btn btn-sm btn-warning me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(attr.id)}
                                className="btn btn-sm btn-danger"
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

export default AttributeLibrary;

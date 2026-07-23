import React, { useEffect, useState } from "react";
import {getAttributes, createAttribute, updateAttribute, deleteAttribute,
} from "../services/api";

function Attributes() {
    const [attributes, setAttributes] = useState([]);
    const [form, setForm] = useState({ category: "", name: "", description: "", type: "" });
    const [editingId, setEditingId] = useState(null);

    const fetchAttributes = async () => {
        try {
            const res = await getAttributes();
            setAttributes(res.data);
        } catch (err) {
            console.error("Failed to fetch attributes:", err);
            alert("Error loading attributes");
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updateAttribute(editingId, form);
                alert("Attribute updated!");
                setEditingId(null);
            } else {
                const res = await createAttribute(form);
                setAttributes((prev) => [...prev, res.data]);
            }
            setForm({ category: "", name: "", description: "", type: "" });
            fetchAttributes();
        } catch (err) {
            console.error("Save attribute error:", err);
            alert("Failed to save attribute");
        }
    };

    const handleEdit = (attr) => {
        setForm({
            category: attr.category,
            name: attr.name,
            description: attr.description,
            type: attr.type,
        });
        setEditingId(attr.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this attribute?")) return;
        try {
            await deleteAttribute(id);
            setAttributes((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Delete attribute error:", err);
            alert("Failed to delete attribute");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Attributes</h2>

            <div className="card p-3 mt-3">
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    className="form-control mt-2"
                    value={form.category}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control mt-2"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="form-control mt-2"
                    value={form.description}
                    onChange={handleChange}
                />
                <select
                    name="type"
                    className="form-select mt-2"
                    value={form.type}
                    onChange={handleChange}
                >
                    <option value="">Select type</option>
                    <option value="string">String</option>
                    <option value="text">Text</option>
                    <option value="numeric">Numeric</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="image">Image</option>
                </select>
                <button onClick={handleSubmit} className="btn btn-primary mt-3">
                    {editingId ? "Update Attribute" : "Add Attribute"}
                </button>
            </div>

            <ul className="list-group mt-4">
                {attributes.map((a) => (
                    <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{a.name}</strong> ({a.category})
                            <br />
                            <small>{a.description} | Type: {a.type}</small>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(a)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(a.id)}
                                className="btn btn-danger btn-sm"
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

export default Attributes;



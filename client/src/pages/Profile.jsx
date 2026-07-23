import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, getAttributes } from "../services/api";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        location: "",
        photoUrl: "",
        attributes: {},
        version: 0,
    });
    const [library, setLibrary] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const resProfile = await getProfile();
                setProfile(resProfile.data);
                setForm({
                    firstName: resProfile.data.firstName || "",
                    lastName: resProfile.data.lastName || "",
                    location: resProfile.data.location || "",
                    photoUrl: resProfile.data.photoUrl || "",
                    attributes: resProfile.data.attributes || {},
                    version: resProfile.data.version || 0,
                });

                const resLibrary = await getAttributes();
                setLibrary(resLibrary.data || []);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (profile) {
                try {
                    const res = await updateProfile(form);
                    setForm((prev) => ({ ...prev, version: res.data.version }));
                    setProfile(res.data);
                    console.log("Auto-saved profile");
                } catch (err) {
                    console.warn("Auto-save failed:", err);
                    if (err.response?.status === 409) {
                        setError("Version conflict. Reload profile");
                    }
                }
            }
        }, 7000);
        return () => clearInterval(interval);
    }, [form, profile]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAttributeChange = (key, value) => {
        setForm({
            ...form,
            attributes: { ...form.attributes, [key]: value },
        });
    };

    const handleAddAttribute = (attrName) => {
        if (!form.attributes[attrName]) {
            setForm({
                ...form,
                attributes: { ...form.attributes, [attrName]: "" },
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(form);
            setProfile(res.data);
            setForm({
                firstName: res.data.firstName || "",
                lastName: res.data.lastName || "",
                location: res.data.location || "",
                photoUrl: res.data.photoUrl || "",
                attributes: res.data.attributes || {},
                version: res.data.version || 0,
            });
            setError("");
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Profile update error:", err);
            if (err.response?.status === 409) {
                setError("Version conflict. Please reload your profile.");
            } else {
                setError("Failed to update profile.");
            }
        }
    };

    if (loading) return <div className="container mt-5">Loading profile...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Your Profile</h2>
            {profile && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Photo URL</label>
                        <input
                            name="photoUrl"
                            value={form.photoUrl}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <h4>Attributes</h4>
                        {Object.entries(form.attributes || {}).map(([key, value]) => (
                            <div key={key} className="mb-2">
                                <label className="form-label">{key}</label>
                                <input
                                    value={value}
                                    onChange={(e) => handleAttributeChange(key, e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        ))}
                        {Object.keys(form.attributes || {}).length === 0 && (
                            <p className="text-muted">No attributes selected yet.</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <h4>Add Attribute from Library</h4>
                        <select
                            className="form-select"
                            onChange={(e) => handleAddAttribute(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select attribute
                            </option>
                            {library.map((attr) => (
                                <option key={attr.id} value={attr.name}>
                                    {attr.name} ({attr.category})
                                </option>
                            ))}
                        </select>
                    </div>

                    <input type="hidden" name="version" value={form.version} />

                    <button type="submit" className="btn btn-primary">
                        Update Profile
                    </button>
                </form>
            )}
        </div>
    );
}

export default Profile;





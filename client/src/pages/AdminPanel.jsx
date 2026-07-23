import React, { useEffect, useState } from "react";
import { getUsers, blockUser, changeRole, deleteUser } from "../services/api";

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsers();
            setUsers(res.data.users || []);
            setError("");
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Error loading users (are you logged in as admin?)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlock = async (id) => {
        try {
            await blockUser(id);
            await fetchUsers();
        } catch (err) {
            console.error("Block/unblock error:", err);
            alert("Failed to block/unblock user");
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await changeRole(id, role);
            await fetchUsers();
        } catch (err) {
            console.error("Role change error:", err);
            alert("Failed to change role (403 means you’re not admin)");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete user");
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <h2>Admin Panel</h2>
            <table className="table table-bordered mt-4">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Blocked</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    className="form-select form-select-sm"
                                >
                                    <option value="candidate">Candidate</option>
                                    <option value="recruiter">Recruiter</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>{u.blocked ? "Yes" : "No"}</td>
                            <td>
                                <button
                                    onClick={() => handleBlock(u.id)}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    {u.blocked ? "Unblock" : "Block"}
                                </button>
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No users found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;

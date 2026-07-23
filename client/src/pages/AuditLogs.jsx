import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../services/api";

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await getAuditLogs();
                const data = res.data || [];
                setLogs(data);
                setFilteredLogs(data);
                setError("");
            } catch (err) {
                console.error("Failed to fetch audit logs:", err);
                setError("Failed to load audit logs (are you logged in as admin?)");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredLogs(logs);
        } else {
            const lower = search.toLowerCase();
            setFilteredLogs(
                logs.filter(
                    (log) =>
                        log.userId?.toString().includes(lower) ||
                        log.action?.toLowerCase().includes(lower) ||
                        log.entityType?.toLowerCase().includes(lower) ||
                        log.entityId?.toString().includes(lower)
                )
            );
        }
    }, [search, logs]);

    if (loading) return <div className="container mt-5">Loading audit logs...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Audit Logs</h2>

            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    placeholder="Search by User ID, Action, Entity Type, or Entity ID"
                />
            </div>

            {filteredLogs.length === 0 ? (
                <p className="mt-3">No audit logs available.</p>
            ) : (
                <table className="table table-striped mt-3">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Action</th>
                        <th>Entity Type</th>
                        <th>Entity ID</th>
                        <th>Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.userId}</td>
                            <td>{log.action}</td>
                            <td>{log.entityType}</td>
                            <td>{log.entityId}</td>
                            <td>
                                {log.timestamp
                                    ? new Date(log.timestamp).toLocaleString()
                                    : log.createdAt
                                        ? new Date(log.createdAt).toLocaleString()
                                        : ""}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AuditLogs;

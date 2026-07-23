import React from "react";
import MainPage from "./MainPage";
import AdminPanel from "./AdminPanel";
import AuditLogs from "./AuditLogs";

function DashboardAdmin() {
    return (
        <div className="container mt-5">
            <h2>Admin Dashboard</h2>
            <MainPage />
            <AdminPanel />
            <AuditLogs />
        </div>
    );
}

export default DashboardAdmin;

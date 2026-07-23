import React, { useState } from "react";
import { exportCVsToCSV, exportCVsToExcel } from "../services/api";

const ExportCVs = ({ positionId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleExportCSV = async () => {
        try {setLoading(true); setError("");
            const response = await exportCVsToCSV(positionId, {
                responseType: "blob",
            });
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "cvs.csv";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("CSV export error:", err);
            setError("Failed to export CSV");
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await exportCVsToExcel(positionId, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "cvs.xlsx";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Excel export error:", err);
            setError("Failed to export Excel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Export CVs</h2>
            <p>Position ID: {positionId}</p>
            {error && <p className="text-danger">{error}</p>}
            <button
                onClick={handleExportCSV}
                className="btn btn-outline-primary me-2"
                disabled={loading}
            >
                {loading ? "Exporting CSV..." : "Export to CSV"}
            </button>
            <button
                onClick={handleExportExcel}
                className="btn btn-outline-success"
                disabled={loading}
            >
                {loading ? "Exporting Excel..." : "Export to Excel"}
            </button>
        </div>
    );
};

export default ExportCVs;


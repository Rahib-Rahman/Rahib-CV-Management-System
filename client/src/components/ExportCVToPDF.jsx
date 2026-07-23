import React, { useState } from "react";
import { exportCVToPDF } from "../services/api";

function ExportCVToPDF({ cvId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lang, setLang] = useState("en");

    const handleExport = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await exportCVToPDF(cvId, lang);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `cv_${cvId}_${lang}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF export error:", err);
            setError("Failed to export CV to PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h4>Export CV to PDF</h4>
            <div className="mb-3">
                <label htmlFor="lang" className="form-label">Language</label>
                <select
                    id="lang"
                    className="form-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                </select>
            </div>
            <button
                className="btn btn-primary"
                onClick={handleExport}
                disabled={loading}
            >
                {loading ? "Exporting..." : "Export PDF"}
            </button>
            {error && <div className="text-danger mt-2">{error}</div>}
        </div>
    );
}

export default ExportCVToPDF;

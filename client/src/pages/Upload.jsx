import React, { useState } from "react";
import { uploadFile } from "../services/api";

function Upload() {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadFile(formData);
            setUrl(res.data.url);
            alert("File uploaded successfully!");
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Upload File</h2>
            <input
                type="file"
                className="form-control mt-2"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".jpg,.jpeg,.png,.pdf"
            />
            <button
                onClick={handleUpload}
                className="btn btn-primary mt-3"
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>

            {error && <div className="text-danger mt-3">{error}</div>}

            {url && (
                <div className="mt-3">
                    <h5>Uploaded File URL:</h5>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                    </a>
                    {url.match(/\.(jpg|jpeg|png)$/) && (
                        <div className="mt-2">
                            <img src={url} alt="Uploaded preview" className="img-fluid" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Upload;

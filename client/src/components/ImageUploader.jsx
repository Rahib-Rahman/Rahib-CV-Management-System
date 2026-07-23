import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function ImageUploader({ onUpload }) {
    const onDrop = useCallback(async (acceptedFiles) => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        const res = await axios.post("https://rahib-cv-management-system.onrender.com/upload", formData);
        onUpload(res.data.url);
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="border p-4 text-center bg-light">
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the image here…</p>
            ) : (
                <p>Drag & drop an image here, or click to select</p>
            )}
        </div>
    );
}

export default ImageUploader;

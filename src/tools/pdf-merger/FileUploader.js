import React, { useRef, useState } from 'react';
import { FileText } from "lucide-react";

export default function FileUploader({
  onFileChange, merging, fileLimitReached, maxFiles
}) {
  const inputRef = useRef();
  const [error, setError] = useState("");

  // Only accept PDFs, else show error
  const handleFiles = (files) => {
    const pdfFiles = Array.from(files).filter(f => f.type === "application/pdf");
    if (pdfFiles.length !== files.length) {
      setError("Only PDF files are allowed.");
      return;
    }
    setError("");
    onFileChange({ target: { files: pdfFiles } });
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (merging || fileLimitReached) return;
    handleFiles(e.dataTransfer.files);
  };

  // Handle button click to open file picker
  const handleButtonClick = () => {
    if (!merging && !fileLimitReached) inputRef.current.click();
  };

  // Handle manual selection
  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = ""; // Clear to allow uploading the same file again if needed
  };

  return (
    <div
      className={`border-2 border-dashed border-blue-300 rounded-xl p-6 bg-white flex flex-col items-center justify-center relative w-full transition ${
        merging || fileLimitReached ? "opacity-50 pointer-events-none" : ""
      }`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <FileText size={36} className="mb-4 text-blue-600" />
      <div className="mb-4 text-center">
        <span className="text-gray-700 font-medium">
          Drag and drop PDF files here, or
        </span>
      </div>
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition mb-2"
        disabled={merging || fileLimitReached}
        tabIndex={-1}
      >
        Browse Files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleInputChange}
        disabled={merging || fileLimitReached}
        className="hidden"
      />
      <p className="text-xs text-gray-400 mt-3">
        {`You can upload up to ${maxFiles} PDF${maxFiles > 1 ? 's' : ''} at a time.`}
      </p>
      {error && (
        <div className="text-red-600 mt-2 text-sm font-medium">{error}</div>
      )}
    </div>
  );
}

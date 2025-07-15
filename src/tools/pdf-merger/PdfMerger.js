import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUploader from './FileUploader';
import PdfFileList from './PdfFileList';

function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [pageRanges, setPageRanges] = useState([]);
  const [pageCounts, setPageCounts] = useState([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");

  const maxFiles = 10;
  const maxFileSize = 10 * 1024 * 1024; // 10 MB

  // Helper: Parse range string to array of page indices (0-based)
  const parseRange = (range, max) => {
    try {
      return range
        .split(',')
        .flatMap(part => {
          if (part.includes('-')) {
            let [start, end] = part.split('-').map(Number);
            start = Math.max(1, start);
            end = Math.min(max, end);
            return Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
          } else {
            const num = Math.max(1, Math.min(max, Number(part)));
            return [num - 1];
          }
        })
        .filter(i => !isNaN(i) && i >= 0 && i < max);
    } catch {
      return [];
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    setError("");
    let selected = Array.from(e.target.files);
    if (files.length + selected.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed.`);
      return;
    }
    if (selected.some(f => f.size > maxFileSize)) {
      setError(`Each file must be under ${maxFileSize / 1024 / 1024} MB.`);
      return;
    }
    // Remove duplicates
    const uniqueSelected = selected.filter(
      (f) => !files.some((existing) => existing.name === f.name && existing.size === f.size)
    );
    // Get page count for each file
    const newCounts = await Promise.all(uniqueSelected.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      return pdf.getPageCount();
    }));
    // Default range as "1-total"
    const newRanges = newCounts.map(cnt => `1-${cnt}`);

    setFiles([...files, ...uniqueSelected]);
    setPageCounts([...pageCounts, ...newCounts]);
    setPageRanges([...pageRanges, ...newRanges]);
    e.target.value = "";
  };

  // Remove, reorder, range change handlers
  const removeFile = idx => {
    setFiles(files.filter((_, i) => i !== idx));
    setPageCounts(pageCounts.filter((_, i) => i !== idx));
    setPageRanges(pageRanges.filter((_, i) => i !== idx));
  };
  const moveUp = idx => {
    if (idx === 0) return;
    const swap = arr => {
      const out = [...arr];
      [out[idx - 1], out[idx]] = [out[idx], out[idx - 1]];
      return out;
    };
    setFiles(swap(files));
    setPageCounts(swap(pageCounts));
    setPageRanges(swap(pageRanges));
  };
  const moveDown = idx => {
    if (idx === files.length - 1) return;
    const swap = arr => {
      const out = [...arr];
      [out[idx + 1], out[idx]] = [out[idx], out[idx + 1]];
      return out;
    };
    setFiles(swap(files));
    setPageCounts(swap(pageCounts));
    setPageRanges(swap(pageRanges));
  };
  const onRangeChange = (idx, val) =>
    setPageRanges(pageRanges.map((r, i) => (i === idx ? val : r)));

  // Merge action
  const mergePDFs = async () => {
    if (files.length < 1) {
      setError("Select at least one PDF file to merge.");
      return;
    }
    setError("");
    setMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (let idx = 0; idx < files.length; ++idx) {
        const file = files[idx];
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pageCount = pdf.getPageCount();
        const selectedPages = parseRange(pageRanges[idx], pageCount);
        if (!selectedPages.length) {
          throw new Error(`Invalid page range for ${file.name}`);
        }
        const copiedPages = await mergedPdf.copyPages(pdf, selectedPages);
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files.length === 1 ? files[0].name : 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Merging failed. Please check your files and page ranges.");
    }
    setMerging(false);
  };

  return (
    <>
      <div className="w-full mb-2">
        <div className="text-blue-700 text-lg font-semibold text-left">
          PDF Merger
        </div>
        <p className="text-gray-600 text-left mt-1">
          Combine multiple PDFs into one
        </p>
      </div>
      {/* Tool area */}
      <div className="w-full mt-2">
        <div className="w-full">
          <FileUploader
            onFileChange={handleFileChange}
            merging={merging}
            fileLimitReached={files.length >= maxFiles}
            maxFiles={maxFiles}
          />
          {files.length > 0 && (
            <div className="mb-2 bg-gray-50 p-2 rounded-xl">
              <PdfFileList
                files={files}
                pageCounts={pageCounts}
                pageRanges={pageRanges}
                onRangeChange={onRangeChange}
                onRemove={removeFile}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                merging={merging}
              />
            </div>
          )}
          <button
            onClick={mergePDFs}
            disabled={merging || files.length < 1}
            className={`w-full py-2 px-4 mt-2 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all ${
              merging || files.length < 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {merging ? "Merging..." : (files.length === 1 ? "Download PDF" : "Merge PDFs")}
          </button>
          {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
        </div>
      </div>
    </>
  );
}

export default PdfMerger;

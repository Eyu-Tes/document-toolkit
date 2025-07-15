import React from 'react';
import PdfFileItem from './PdfFileItem';

export default function PdfFileList({
  files, pageCounts, pageRanges, onRangeChange,
  onRemove, onMoveUp, onMoveDown, merging
}) {
  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {files.map((file, i) => (
          <PdfFileItem
            key={i}
            file={file}
            sizeMB={(file.size / 1024 / 1024).toFixed(2)}
            pageCount={pageCounts[i]}
            pageRange={pageRanges[i]}
            onRangeChange={(val) => onRangeChange(i, val)}
            canMoveUp={i > 0}
            canMoveDown={i < files.length - 1}
            onMoveUp={() => onMoveUp(i)}
            onMoveDown={() => onMoveDown(i)}
            onRemove={() => onRemove(i)}
            merging={merging}
          />
        ))}
      </ul>
      <div className="text-xs text-gray-500 mt-3 text-center">
        <span className="font-semibold text-blue-700">Tip:</span> Enter page numbers as e.g. <code>1-3,5</code>
      </div>
    </div>
  );
}

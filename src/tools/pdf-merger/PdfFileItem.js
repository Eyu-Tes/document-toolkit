import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

export default function PdfFileItem({
  file,
  sizeMB,
  pageCount,
  pageRange,
  onRangeChange,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  merging
}) {
  return (
    <li className="flex flex-col md:flex-row md:items-center py-2 justify-between text-sm">
      <div className="flex items-center flex-1 truncate">
        <div>
          <div className="truncate font-medium">{file.name}</div>
          <div className="text-xs text-gray-400">
            {sizeMB} MB
            <span className="ml-2 text-gray-500">
              [{pageCount} page{pageCount > 1 ? 's' : ''}]
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1 mt-2 md:mt-0 ml-0 md:ml-2">
        <input
          type="text"
          className="w-28 p-1 border border-gray-300 rounded text-xs"
          value={pageRange}
          onChange={e => onRangeChange(e.target.value)}
          disabled={merging}
          title="Pages to include, e.g. 1-3,5"
        />
        <span className="text-xs text-gray-400 ml-1">pages</span>
        <button
          aria-label="Move up"
          className="p-1 hover:bg-blue-100 rounded disabled:opacity-50"
          onClick={onMoveUp}
          disabled={!canMoveUp}
        >
          <ArrowUp size={16} />
        </button>
        <button
          aria-label="Move down"
          className="p-1 hover:bg-blue-100 rounded disabled:opacity-50"
          onClick={onMoveDown}
          disabled={!canMoveDown}
        >
          <ArrowDown size={16} />
        </button>
        <button
          aria-label="Remove"
          className="p-1 hover:bg-red-100 rounded"
          onClick={onRemove}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

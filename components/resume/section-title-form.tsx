import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

// --------
// DESCRIPTION: 
// Edit section title text
// --------
export function SectionTitleForm({editedName, setEditedName, handleSaveName, handleCancelEdit}): Promise<JSX.Element> {
  return (
    <div className="flex flex-row">
      <input
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        className="text-xl border-b-2 border-blue-500 focus:outline-none px-1"
        placeholder="Enter section title"
        autoFocus
      />
      <button
        onClick={handleSaveName}
        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
        aria-label="Save section title"
      >
        <Check size={18} />
      </button>
      <button
        onClick={handleCancelEdit}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
        aria-label="Cancel editing"
      >
        <X size={18} />
      </button>
    </div>
  );
}

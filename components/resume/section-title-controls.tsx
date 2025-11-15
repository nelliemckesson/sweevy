import { useState, useEffect } from 'react';
import { SquarePen, Brush } from 'lucide-react';

// --------
// DESCRIPTION: 
// Edit section title text and design
// --------
export function SectionTitleControls({handleOpenModal, handleEditName}): Promise<JSX.Element> {
  return (
    <div className="flex flex-row items-center gap-0">
      <button
        onClick={handleOpenModal}
        className="opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 md:text-gray-400 md:hover:text-blue-500 hover:bg-blue-50 rounded"
        aria-label="Adjust section title design"
      >
        <Brush size={18} />
      </button>
      <button
        onClick={handleEditName}
        className="opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 md:text-gray-400 md:hover:text-blue-500 hover:bg-blue-50 rounded"
        aria-label="Edit section title"
      >
        <SquarePen size={18} />
      </button>
    </div>
  );
}

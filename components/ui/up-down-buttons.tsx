'use client';

import { ChevronsUp, ChevronsDown } from 'lucide-react';

// --------
// DESCRIPTION: 
// Controls to adjust top-level section order
// --------
export function UpDownButtons({
  index, 
  fieldsLength, 
  handleMoveSectionUp, 
  handleMoveSectionDown
}): Promise<JSX.Element> {

  return (
    <div className="flex flex-row items-start justify-start">
      {index !== 0 && (
        <ChevronsUp 
          size={20} 
          className="cursor-pointer" 
          title="Move Up" 
          aria-label="Move Section Up" 
          onClick={e => handleMoveSectionUp(index)}
        />
      )}
      {index < fieldsLength-1 && (
        <ChevronsDown
          size={20}
          className="cursor-pointer"
          title="Move Down"
          aria-label="Move Section Down"
          onClick={e => handleMoveSectionDown(index)}
        />
      )}
    </div>
  );
}

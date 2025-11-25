import { GripVertical, X, Brush, SquarePen, ChevronsUp, ChevronsDown, CopyPlus } from 'lucide-react';

// --------
// DESCRIPTION: 
// Quick guide to help users grok the interface
// --------
export function Guide(): Promise<JSX.Element> {
  return (
    <details open>
      <summary className="text-lg mb-5 cursor-pointer hover:opacity-70 transition-opacity">
        Guide
      </summary>
      <div>
        <p className="flex flex-row items-start gap-1 mb-1">
          <ChevronsUp size={20} /><ChevronsDown size={20} /> Click to move an entire section up or down
        </p>
        <p className="flex flex-row items-start gap-1 mb-1">
          <SquarePen size={20} /> Click to edit a section title
        </p>
        <p className="flex flex-row items-start gap-1 mb-1">
          <GripVertical size={20} /> Hold and drag to change the item order in a section
        </p>
        <p className="flex flex-row items-start gap-1 mb-1">
          <Brush size={20} /> Click to adjust an item's design
        </p>
        <p className="flex flex-row items-start gap-1 mb-1">
          <X size={20} /> Click to delete an item
        </p>
        <p className="flex flex-row items-start gap-1 mb-1">
          <CopyPlus size={20} /> Click to duplicate an item
        </p>
        <p className="flex flex-row items-start gap-1 mb-1">
          <input
            type="checkbox"
            className="inline-block mt-1"
            aria-label="Include field in download"
          />
          Turn off to exclude an item from the downloaded resumé
        </p>
      </div>
    </details>
  );
}
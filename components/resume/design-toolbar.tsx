'use client';

import { useState, useEffect } from 'react';
import { 
  List, 
  ListOrdered, 
  Italic,
  Bold,
  ALargeSmall
} from 'lucide-react';
import { Field, FormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

  // TextAlignStart, 
  // TextAlignCenter, 
  // TextAlignEnd, 
  // TextAlignJustify,

        // <TextAlignStart size={18} />
        // <TextAlignCenter size={18} />
        // <TextAlignEnd size={18} />
        // <TextAlignJustify size={18} />

interface DesignToolbarProps {
  field: Field;
  onUpdate?: (classnames: string[]) => void;
}

export function DesignToolbar({ field, onUpdate }: DesignToolbarProps): JSX.Element {
  const [classnames, setClassnames] = useState<string[]>(field.classnames || []);

  useEffect(() => {
    setClassnames(field.classnames || []);
  }, [field]);

  const toggleClassname = (className: string) => {
    setClassnames((prev) => {
      const newClassnames = prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className];

      if (onUpdate) {
        onUpdate(newClassnames);
      }

      return newClassnames;
    });
  };

  const hasClassname = (className: string) => classnames.includes(className);

  return (
    <div>
      <div className="flex flex-row mb-4">
        <button
          onClick={() => toggleClassname('italic')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('italic') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Italics"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => toggleClassname('bold')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('bold') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => toggleClassname('bullet')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('bullet') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Bulleted"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => toggleClassname('numbered')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('numbered') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Numbered"
        >
          <ListOrdered size={18} />
        </button>

        <button
          onClick={() => toggleClassname('large')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('large') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Font Size"
        >
          <ALargeSmall size={18} />
        </button>
      </div>

      <div className="flex flex-row gap-2 items-center w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none mb-4">
        <div className={`${classnames.join(" ")}`}>
          {field.value}
        </div>
      </div>

      <Button>Save</Button>
    </div>
  );
}

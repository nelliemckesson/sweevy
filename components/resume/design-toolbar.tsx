'use client';

import { useState, useEffect } from 'react';
import {
  List,
  ListOrdered,
  Italic,
  Bold,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify
} from 'lucide-react';
import { Field, FormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface DesignToolbarProps {
  field: Field;
  onUpdate?: (classnames: string[]) => void;
}

export function DesignToolbar({ field, onUpdate }: DesignToolbarProps): JSX.Element {
  const [classnames, setClassnames] = useState<string[]>(field.classnames || []);

  const fontSizeOptions = ["7", "8", "9", "10", "11", "12", "14", "18", "24", "30", "36", "48", "60", "72", "96"];

  useEffect(() => {
    setClassnames(field.classnames || []);
  }, [field]);

  const toggleClassname = (className: string) => {
    setClassnames((prev) => {
      let newClassnames = [...prev];

      // The "align" classes cancel eachother out
      if (className.startsWith("align")) {
        newClassnames = newClassnames.filter((c) => !c.startsWith("align") && c !== className)
      }

      // The "fontsize" classes cancel each other out
      if (className.startsWith("fontsize")) {
        newClassnames = newClassnames.filter((c) => !c.startsWith("fontsize") && c !== className)
      }

      newClassnames = newClassnames.includes(className)
        ? newClassnames.filter((c) => c !== className)
        : [...newClassnames, className];

      if (onUpdate) {
        onUpdate(newClassnames);
      }

      console.log(newClassnames);

      return newClassnames;
    });
  };

  const hasClassname = (className: string) => classnames.includes(className);

  const getCurrentFontSize = () => {
    const fontSizeClass = classnames.find((c) => c.startsWith("fontsize"));
    if (fontSizeClass) {
      return fontSizeClass.replace("fontsize", "");
    }
    return "";
  };

  const handleFontSizeChange = (size: string) => {
    if (size) {
      toggleClassname(`fontsize${size}`);
    }
  };

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
          onClick={() => toggleClassname('alignleft')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('alignleft') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Align Left"
        >
          <TextAlignStart size={18} />
        </button>
        <button
          onClick={() => toggleClassname('aligncenter')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('aligncenter') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Align Center"
        >
          <TextAlignCenter size={18} />
        </button>
        <button
          onClick={() => toggleClassname('alignright')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('alignright') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Align Right"
        >
          <TextAlignEnd size={18} />
        </button>
        <button
          onClick={() => toggleClassname('alignjustify')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('alignjustify') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Align Justify"
        >
          <TextAlignJustify size={18} />
        </button>

        <select
          value={getCurrentFontSize()}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            getCurrentFontSize() ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Font Size"
        >
          <option value="">Size</option>
          {fontSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row gap-2 items-center w-full px-3 py-2 mb-4">
        <div className={`${classnames.join(" ")}`}>
          {field.value}
        </div>
      </div>

      <Button>Save</Button>
    </div>
  );
}

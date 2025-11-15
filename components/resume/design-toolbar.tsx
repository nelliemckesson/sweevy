'use client';

import { useState, useEffect, useRef } from 'react';
import {
  List,
  ListOrdered,
  Italic,
  Bold,
  Underline,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  SquareDashedTopSolid
} from 'lucide-react';
import { Field, FormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { sanitizeInput } from "@/lib/utils";

interface DesignToolbarProps {
  field: Field;
  onUpdate?: (classnames: string[]) => void;
  onSave?: (classnames: string[], value: string) => void;
}

export function DesignToolbar({ field, onUpdate, onSave }: DesignToolbarProps): JSX.Element {
  const [classnames, setClassnames] = useState<string[]>(field.classnames || []);
  const [value, setValue] = useState<string>(field.value || '');
  const previewRef = useRef<HTMLDivElement>(null);

  console.log(field);

  const fontSizeOptions = ["7", "8", "9", "10", "11", "12", "14", "18", "24", "30", "36", "48", "60", "72", "96"];

  useEffect(() => {
    setClassnames(field.classnames || []);
    setValue(field.value || '');
  }, [field]);

  const applyStyleToSelection = (className: string): boolean => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // Only apply if there's selected text and it's within our preview
    if (!selectedText || !previewRef.current?.contains(range.commonAncestorContainer)) {
      return false;
    }

    // Extract the contents of the range
    const fragment = range.extractContents();

    // Create a span element with the class
    const span = document.createElement('span');
    span.className = className;
    span.appendChild(fragment);

    // Insert the span at the range position
    range.insertNode(span);

    // Update the value with the new HTML
    if (previewRef.current) {
      const sanitized = sanitizeInput(previewRef.current.innerHTML, true);
      setValue(sanitized);
    }

    // Clear the selection
    selection.removeAllRanges();

    return true;
  };

  const toggleClassname = (className: string) => {
    // Check if user has selected text - if so, apply style to selection only
    if (applyStyleToSelection(className)) {
      return; // Selection was styled, don't apply to whole field
    }

    // No selection - apply to whole field as before
    setClassnames((prev) => {
      let newClassnames = [...prev];

      // bullet and numbered cancel eachother out
      if (className === "bullet" && !newClassnames.includes(className)) {
        newClassnames = newClassnames.filter((c) => c !== "numbered")
      }
      // bullet and numbered cancel eachother out
      if (className === "numbered" && !newClassnames.includes(className)) {
        newClassnames = newClassnames.filter((c) => c !== "bullet")
      }

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
      <div className="flex flex-row">
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
          onClick={() => toggleClassname('underline')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('underline') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Underline"
        >
          <Underline size={18} />
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

      <div className="flex flex-row mb-4">
        <button
          onClick={() => toggleClassname('bordertop')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded ${
            hasClassname('bordertop') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Top Border"
        >
          <SquareDashedTopSolid size={18} />
        </button>
        <button
          onClick={() => toggleClassname('borderright')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded rotate-90 ${
            hasClassname('borderright') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Right Border"
        >
          <SquareDashedTopSolid size={18} />
        </button>
        <button
          onClick={() => toggleClassname('borderbottom')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded rotate-180 ${
            hasClassname('borderbottom') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Bottom Border"
        >
          <SquareDashedTopSolid size={18} />
        </button>
        <button
          onClick={() => toggleClassname('borderleft')}
          className={`opacity-1 p-2 md:hover:text-blue-500 hover:bg-blue-50 rounded rotate-270 ${
            hasClassname('borderleft') ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
          }`}
          aria-label="Left Border"
        >
          <SquareDashedTopSolid size={18} />
        </button>
      </div>

      <div className="flex flex-row gap-2 items-center w-full px-3 py-2 mb-4">
        {classnames?.indexOf("bullet") > -1 && (
          <span className="text-2xl">&#8226;</span>
        )}
        {classnames?.indexOf("numbered") > -1 && (
          <span className="">1. </span>
        )}
        <div
          ref={previewRef}
          contentEditable
          suppressContentEditableWarning
          className={`w-full ${classnames.join(" ")}`}
          style={{ userSelect: 'text', cursor: 'text' }}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={(e: React.FormEvent<HTMLDivElement>) => {
            const sanitized = sanitizeInput(e.currentTarget.innerHTML, true);
            setValue(sanitized);
          }}
        />
      </div>

      <Button onClick={() => onSave && onSave(classnames, value)}>Save</Button>
    </div>
  );
}

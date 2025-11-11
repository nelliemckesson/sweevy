'use client';

import { useState, useCallback } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';
import { Field } from "@/lib/types";
import { Button } from "@/components/ui/button";

// this type interface is only used once
interface DraggableFieldsProps {
  fields: Field[];
  newText: string;
  parent?: number;
  handleSetFields: (fields: Field[], immediate?: boolean) => void;
  handleAddField: (newFields: Field[]) => void;
  renderNestedFields?: (field: Field) => React.ReactNode;
}

export function DraggableFields({ fields, newText, parent, handleSetFields, handleAddField, renderNestedFields }: DraggableFieldsProps): JSX.Element {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number): void => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // index = new position of dragged item
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number): void => {
    e.preventDefault();

    if (draggedItem === null) return;

    if (draggedItem === index) {
      setDragOverItem(null);
    } else {
      setDragOverItem(index);
    }
  }, [draggedItem]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>, index: number): void => {
    e.preventDefault();

    if (dragOverItem === index) {
      setDragOverItem(null);
    }
  }, [dragOverItem]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();

    if (draggedItem === null || dragOverItem === null || draggedItem === dragOverItem) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newFields = [...fields];
    const [draggedField] = newFields.splice(draggedItem, 1);
    newFields.splice(dragOverItem, 0, draggedField);

    // update positions to match new order
    const fieldsWithUpdatedPositions = newFields.map((field, idx) => {
      return {
        ...field,
        position: idx,
        changed: true
      };
    });

    handleSetFields(fieldsWithUpdatedPositions);
    setDraggedItem(null);
    setDragOverItem(null);
  }, [draggedItem, dragOverItem, fields, handleSetFields]);

  const handleDragEnd = useCallback((): void => {
    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  const addField = useCallback((): void => {
    const newField: Field = {
      label: '',
      value: '',
      position: fields.length+1,
      changed: true,
      include: true
    };
    if (parent) {
      newField.parent = parent;
    }
    handleAddField([...fields, newField]);
  }, [fields, handleSetFields]);

  const removeField = useCallback((index: number): void => {
    // remove field by array index
    const newFields = fields
      .filter((_, idx) => idx !== index)
      .map((field, idx) => ({
        ...field,
        position: idx
      }));
    handleSetFields(newFields, true);
  }, [fields, handleSetFields]);

  const updateField = useCallback((index: number, updates: Partial<Field>, immediate = false): void => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates, changed: true };
    handleSetFields(newFields, immediate);
  }, [fields, handleSetFields]);

  const styleForDragDirection = (index) => {
    if (draggedItem === index) return 'opacity-50 scale-95';
    if (dragOverItem === index && dragOverItem > draggedItem) return 'border-blue-400 border-b-2';
    if (dragOverItem === index && dragOverItem < draggedItem) return 'border-blue-400 border-t-2';
    return 'opacity-100';
  }

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={index}>
          <div
            key={field.id ?? `temp-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`group flex items-center gap-3 bg-white transition-all ${
              styleForDragDirection(index)
            } hover:border-blue-300 hover:shadow-sm`}
          >
            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-row gap-4">
                <input
                  type="checkbox"
                  id={`include${field.position}`}
                  name={`include${field.position}`}
                  aria-label="Include field in download"
                  checked={field.include}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateField(index, { include: e.target.checked }, true);
                  }}
                />
                <textarea
                  type="text"
                  value={field.value}
                  placeholder={field.label || "Type some text..."}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateField(index, { value: e.target.value });
                  }}
                  className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={() => removeField(index)}
              className="opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 md:text-gray-400 md:hover:text-red-500 hover:bg-red-50 rounded"
              aria-label="Remove field"
            >
              <X size={18} />
            </button>
          </div>
          {renderNestedFields && renderNestedFields(field)}
        </div>
      ))}
      <Button variant="ghost" onClick={addField}><Plus size={20} />Add a new {newText || "item"}</Button>
    </div>
  );
}
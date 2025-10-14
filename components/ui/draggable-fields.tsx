'use client';

import { useState, useCallback } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';
import { Field } from "@/lib/types";
import { Button } from "@/components/ui/button";

// this type interface is only used once
interface DraggableFieldsProps {
  fields: Field[];
  newText: string;
  handleSetFields: (fields: Field[], immediate?: boolean) => void;
  handleAddField: (newFields: Field[]) => void;
}

export function DraggableFields({ fields, newText, handleSetFields, handleAddField }: DraggableFieldsProps): JSX.Element {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number): void => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number): void => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === index) return;

    const newFields = [...fields];
    const draggedField = newFields[draggedItem];

    newFields.splice(draggedItem, 1);
    newFields.splice(index, 0, draggedField);

    // update positions to match new order
    const fieldsWithUpdatedPositions = newFields.map((field, idx) => ({
      ...field,
      position: idx
    }));

    handleSetFields(fieldsWithUpdatedPositions);
    setDraggedItem(index);
  }, [draggedItem, fields, handleSetFields]);

  const handleDragEnd = useCallback((): void => {
    setDraggedItem(null);
  }, []);

  const addField = useCallback((): void => {
    const newField: Field = {
      label: '',
      value: '',
      position: fields.length,
      changed: true,
      include: true
    };
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

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div>
          <div
            key={field.id ?? `temp-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group flex items-center gap-3 bg-white rounded-lg transition-all ${
              draggedItem === index ? 'opacity-50 scale-95' : 'opacity-100'
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
                <input
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
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              aria-label="Remove field"
            >
              <X size={18} />
            </button>
          </div>
          {field.hasOwnProperty("fields") && (
            <div className="ml-12">
              <DraggableFields fields={field.fields} handleSetFields={handleSetFields} handleAddField={handleAddField} />
            </div>
          )}

          {field.children && (
            <div className="ml-12">
              <DraggableFields fields={field.children} handleSetFields={handleSetFields} handleAddField={handleAddField} />
            </div>
          )}
        </div>
      ))}
      <Button variant="ghost" onClick={addField}><Plus size={20} />Add a new {newText || "item"}</Button>
    </div>
  );
}
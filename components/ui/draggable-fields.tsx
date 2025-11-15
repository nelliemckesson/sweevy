'use client';

import { useState, useCallback } from 'react';
import { GripVertical, X, Plus, Brush, CopyPlus } from 'lucide-react';
import { Field } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DesignToolbar } from "@/components/resume/design-toolbar";
import { sanitizeInput } from "@/lib/utils";

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
  const [activeField, setActiveField] = useState({});
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
  }, [fields, handleAddField]);

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

  const duplicateField = useCallback((field: Field, index: number): void => {
    const newField: Field = {
      label: field.label,
      value: field.value,
      position: index+1,
      classnames: field.classnames || [],
      changed: true,
      include: true
    };
    if (parent) {
      newField.parent = parent;
    }

    // Insert the new field after the current one
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newField);

    // Renumber all fields to match their new positions
    const fieldsWithUpdatedPositions = newFields.map((field, idx) => ({
      ...field,
      position: idx,
      changed: true
    }));

    handleSetFields(fieldsWithUpdatedPositions);
  }, [fields, handleSetFields, parent]);

  const designField = useCallback((index: number): void => {
    console.log("would design");
  }, []);

  const openDesignModal = (field, index) => {
    setActiveField(field);
    setActiveFieldIndex(index);
    setIsOpen(true);
  }

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
                <div className="w-full flex flex-row gap-0 justify-start items-center">
                  {field.classnames?.indexOf("bullet") > -1 && (
                    <span className="text-2xl">&#8226;</span>
                  )}
                  {field.classnames?.indexOf("numbered") > -1 && (
                    <span className="">{index+1}. </span>
                  )}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: field.value }}
                    onInput={(e: React.FormEvent<HTMLDivElement>) => {
                      const sanitized = sanitizeInput(e.currentTarget.innerHTML, true);
                      updateField(index, { value: sanitized });
                    }}
                    onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
                      const sanitized = sanitizeInput(e.currentTarget.innerHTML, true);
                      updateField(index, { value: sanitized }, true);
                    }}
                    data-placeholder={field.label || "Type some text..."}
                    className={`flex-1 w-full px-3 py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.classnames?.join(" ") || ""} empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={() => openDesignModal(field, index)}
              className="opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 md:text-gray-400 md:hover:text-blue-500 hover:bg-blue-50 rounded"
              aria-label="Adjust item design"
            >
              <Brush size={18} />
            </button>

            <button
              onClick={() => duplicateField(field, index)}
              className="opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 md:text-gray-400 md:hover:text-blue-500 hover:bg-blue-50 rounded"
              aria-label="Copy this item"
            >
              <CopyPlus size={18} />
            </button>

            <button
              onClick={() => removeField(index)}
              className="opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 md:text-gray-400 md:hover:text-red-500 hover:bg-red-50 rounded"
              aria-label="Remove item"
            >
              <X size={18} />
            </button>
          </div>
          {renderNestedFields && renderNestedFields(field)}
        </div>
      ))}
      <Button variant="secondary" onClick={addField}><Plus size={20} />Add another {newText || "item"}</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <DesignToolbar
            field={activeField}
            onSave={(classnames, value) => {
              if (activeFieldIndex !== null) {
                const sanitized = sanitizeInput(value, true);
                updateField(activeFieldIndex, { classnames, value: sanitized }, true);
                setIsOpen(false);
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
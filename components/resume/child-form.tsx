'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { DraggableFields } from "@/components/ui/draggable-fields";

// this type interface is only used once
interface ChildFormProps {
  fields: Field[];
  userId: string;
  newText: string;
  handleSaveItem: (userId: string, field: Field) => Promise<Field | null>;
  handleDeleteItem: (userId: string, field: Field) => Promise<boolean>;
  parent?: number;
}

export function ChildForm({ 
  fields: initialFields, 
  userId, 
  newText, 
  handleSaveItem, 
  handleDeleteItem, 
  parent 
}: ChildFormProps): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);
  const [subFields, setSubFields] = useState<Field[]>([]);
  const [removed, setRemoved] = useState<Field[]>([]);
  const [originalFields, setOriginalFields] = useState<Field[]>([]);
  const [pendingSaveType, setPendingSaveType] = useState<'immediate' | 'debounced' | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const isInitialMount = useRef(true);

  // update the fields with any changes
  const handleAddField = (newFields: Field[]): void => {
    setFields(prev => newFields);
    // no save for the new empty field
  };

  // update the fields with any changes
  const handleSetFields = (newFields: Field[], immediate = false): void => {
    setFields(prev => {
      // check to see if any fields were removed; flag for deletion if so.
      const removedFields = prev.filter(
        oldField => !newFields.some(newField => newField.id === oldField.id)
      );
      setRemoved(removedFields);
      return newFields;
    });

    // mark that we need to save after state updates
    setPendingSaveType(immediate ? 'immediate' : 'debounced');
  };

  const handleSave = useCallback(async (): Promise<void> => {
    if (isSavingRef.current) return;

    console.log("saving");

    isSavingRef.current = true;

    try {
      const updatePromises = fields
        .filter(field => field.changed)
        .map(field => {
          const { changed, ...rest } = field;
          console.log(rest);
          return handleSaveItem(userId, rest);
        });

      const savedFields = await Promise.all(updatePromises);

      console.log(savedFields);

      // delete any removed fields
      const deletePromises = removed
        .filter(field => field.id !== undefined)
        .map(field => {
          const { changed, ...rest } = field;
          return handleDeleteItem(userId, rest);
        });

      await Promise.all(deletePromises);

      // adjust frontend state - merge saved fields with their new IDs
      const cleanedFields = fields.map(field => {
        // find the corresponding saved field for this field
        const savedField = savedFields.find(saved =>
          saved && (saved.id === field.id ||
          (field.id === undefined && saved.position === field.position))
        );

        // if we have a saved field with an ID, use it; otherwise just remove 'changed'
        if (savedField?.id) {
          const { changed, ...rest } = field;
          return { ...rest, id: savedField.id } as Field;
        } else {
          const { changed, ...rest } = field;
          return rest as Field;
        }
      });

      setFields(cleanedFields);
      setRemoved([]);
      setOriginalFields(cleanedFields);
    } finally {
      isSavingRef.current = false;
    }
  }, [fields, removed, userId]);

  // trigger auto-save when fields or removed items change
  useEffect(() => {
    // skip on initial mount and when there's no pending save
    if (isInitialMount.current || pendingSaveType === null) {
      return;
    }

    // clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // schedule auto-save (immediate for checkbox changes, debounced for text input)
    if (pendingSaveType === 'immediate') {
      handleSave();
      setPendingSaveType(null);
    } else {
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
        setPendingSaveType(null);
      }, 1000); // 1 second debounce for text input
    }
  }, [fields, removed, pendingSaveType, handleSave]);

  useEffect(() => {
    if (initialFields) {
      setFields(initialFields.sort((a, b) => a.position - b.position));
      setOriginalFields(structuredClone(initialFields.sort((a, b) => a.position - b.position)));
      isInitialMount.current = false;
    }
  }, [initialFields]);

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mt-0">
      <span className="text-xs h-[16px]">{isSavingRef.current ? "Saving..." : " "}</span>
      <DraggableFields 
        fields={fields} 
        newText={newText}
        handleSetFields={handleSetFields} 
        handleAddField={handleAddField} 
        parent={parent} 
      />
    </div>
  );
}

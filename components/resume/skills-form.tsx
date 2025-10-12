'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setSkill, deleteSkill } from "@/app/actions/db";

export function SkillsForm({ userId, fields: initialFields }: FormProps): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);
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
          return setSkill(userId, rest);
        });

      await Promise.all(updatePromises);

      // delete any removed fields
      console.log(removed);
      const deletePromises = removed
        .filter(field => field.id !== undefined)
        .map(field => {
          const { changed, ...rest } = field;
          return deleteSkill(userId, rest);
        });

      await Promise.all(deletePromises);

      // adjust frontend state
      const cleanedFields = fields.map(({ changed, ...rest }) => rest as Field);
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
      setFields(initialFields);
      setOriginalFields(structuredClone(initialFields));
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
    <div className="flex-1 w-full flex flex-col gap-4">
      <DraggableFields fields={fields} handleSetFields={handleSetFields} handleAddField={handleAddField} />
    </div>
  );
}

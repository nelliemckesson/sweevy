'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setRole, deleteRole } from "@/app/actions/db";

export function RolesForm({ userId, fields: initialFields }: FormProps): JSX.Element {
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

  // TO DO: Handle saving the custom fields for a role

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

  // TO DO: Handle saving the custom fields for a role

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
          return setRole(userId, rest);
        });

      const savedFields = await Promise.all(updatePromises);

      console.log(savedFields);

      // delete any removed fields
      const deletePromises = removed
        .filter(field => field.id !== undefined)
        .map(field => {
          const { changed, ...rest } = field;
          return deleteRole(userId, rest);
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
    <div className="flex-1 w-full flex flex-col gap-0">
      <span className="text-xs h-[16px]">{isSavingRef.current ? "Saving..." : " "}</span>
      <DraggableFields fields={fields} newText="role" handleSetFields={handleSetFields} handleAddField={handleAddField} />
    </div>
  );
}

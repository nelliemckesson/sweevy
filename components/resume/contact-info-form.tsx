'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setContactInfo } from "@/app/actions/db";

export function ContactInfoForm({ userId, fields: initialFields, handleSetPersistedData }: FormProps): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);
  const [originalFields, setOriginalFields] = useState<Field[]>([]);
  const [pendingSaveType, setPendingSaveType] = useState<'immediate' | 'debounced' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // update the fields with any changes
  const handleAddField = (newFields: Field[]): void => {
    setFields(prev => newFields);
    // no save for the new empty field
  };

  // update the fields with any changes
  const handleSetFields = (newFields: Field[], immediate = false): void => {
    setFields(newFields);
    // mark that we need to save after state updates
    setPendingSaveType(immediate ? 'immediate' : 'debounced');
  };

  const handleSave = useCallback(async (): Promise<void> => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // clean all fields (remove 'changed' property)
      const cleanedFields = fields.map(({ changed, ...rest }) => rest);
      // add ids for all fields
      const fieldsWithId = cleanedFields.map(field => {
        if (!field.hasOwnProperty("id")) {
          field.id = crypto.randomUUID();
        }
        return field;
      });

      // save entire fields array at once
      const savedFields = await setContactInfo(userId, fieldsWithId);

      if (savedFields) {
        setFields(savedFields);
        // update persisted data at the parent level
        handleSetPersistedData(prev => ({...prev, contactinfos: savedFields}));
        setOriginalFields(savedFields);
      }
    } finally {
      setIsSaving(false);
    }
  }, [fields, userId, isSaving]);

  // trigger auto-save when fields change
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
  }, [fields, pendingSaveType, handleSave]);

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
      <span className="text-xs h-[16px]">{isSaving ? "Saving..." : " "}</span>
      <DraggableFields fields={fields} newtext="contact info item" handleSetFields={handleSetFields} handleAddField={handleAddField} />
    </div>
  );
}
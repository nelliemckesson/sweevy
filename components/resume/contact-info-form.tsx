'use client';

import { useState, useEffect } from 'react';
import { Field, FormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setContactInfo } from "@/app/actions/db";

export function ContactInfoForm({ userId, fields: initialFields }: FormProps): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);
  const [originalFields, setOriginalFields] = useState<Field[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // update the fields with any changes
  const handleSetFields = (newFields: Field[]): void => {
    setFields(newFields);
    setHasChanges(JSON.stringify(newFields) !== JSON.stringify(originalFields));
  };

  const handleSave = async (): Promise<void> => {
    const cleanedFields = fields.map(({ changed, ...rest }) => rest);
    const updatedFields = await setContactInfo(userId, cleanedFields);
    setOriginalFields(updatedFields);
    setHasChanges(false);
  };

  const handleCancel = (): void => {
    setFields(originalFields);
    setHasChanges(false);
  };

  useEffect(() => {
    if (initialFields) {
      setFields(initialFields);
      setOriginalFields(structuredClone(initialFields));
    }
  }, [initialFields]);

  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <DraggableFields fields={fields} newtext="contact info item" handleSetFields={handleSetFields} handleAddField={handleSetFields} />
      {hasChanges && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      )}
    </div>
  );
}
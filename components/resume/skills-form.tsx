'use client';

import { useState, useEffect } from 'react';
import { Field, FormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setSkill, deleteSkill } from "@/app/actions/db";

export function SkillsForm({ userId, fields: initialFields }: FormProps): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);
  const [removed, setRemoved] = useState<Field[]>([]);
  const [originalFields, setOriginalFields] = useState<Field[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSetFields = (newFields: Field[]): void => {
    setFields(prev => {
      const removedFields = prev.filter(
        oldField => !newFields.some(newField => newField.value === oldField.value)
      );
      setRemoved(removedFields);
      return newFields;
    });
    setHasChanges(JSON.stringify(newFields) !== JSON.stringify(originalFields));
  };

  const handleSave = async (): Promise<void> => {
    const updatePromises = fields
      .filter(field => field.changed)
      .map(field => {
        const { changed, ...rest } = field;
        return setSkill(userId, rest);
      });

    await Promise.all(updatePromises);

    // delete any removed fields
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
    setHasChanges(false);
  };

  const handleCancel = (): void => {
    setFields(originalFields);
    setRemoved([]);
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
      <DraggableFields fields={fields} handleSetFields={handleSetFields} />
      {hasChanges && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setContactInfo } from "@/app/actions/db";

export function SkillsForm(props) {
  // [{label: 'City', value: 'Portland, OR', position: 4}]
  const [fields, setFields] = useState([]);
  const [originalFields, setOriginalFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSetFields = (newFields) => {
    setFields(prev => newFields);
    setHasChanges(JSON.stringify(newFields) !== JSON.stringify(originalFields));
  }

  const handleSave = async () => {
    const cleanedFields = fields.map(field => {
      if (field.changed) {
        // upsert the changed field
      }
      const { changed: _, ...rest } = field;
      return rest;
    });
    setOriginalFields(cleanedFields);
    setHasChanges(false);
  }

  const handleCancel = () => {
    setFields(originalFields);
    setHasChanges(false);
  }

  useEffect(() => {
    if (props.fields) {
      const sortedFields = props.fields.sort((a, b) => a.position - b.position);
      setFields(sortedFields);
      setOriginalFields(JSON.parse(JSON.stringify(sortedFields)));
    }
  }, [props.fields]);

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

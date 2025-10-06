'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setContactInfo } from "@/app/actions/db";

export function ContactInfoForm(props) {
  // [{label: 'City', value: 'Portland, OR', position: 4}]
  const [fields, setFields] = useState([]);
  const [originalFields, setOriginalFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSetFields = (newFields) => {
    setFields(prev => newFields);
    setHasChanges(JSON.stringify(newFields) !== JSON.stringify(originalFields));
  }

  const handleSave = async () => {
    // other tables use the "changed" prop for upserting rows,
    // but contactinfo is set up slightly differently
    const cleanedFields = fields.map(field => {
      const { changed: _, ...rest } = field;
      return rest;
    });
    let newFields = await setContactInfo(props.userId, cleanedFields);
    setOriginalFields(fields);
    setHasChanges(false);
  }

  const handleCancel = () => {
    setFields(originalFields);
    setHasChanges(false);
  }

  // set initial state values from props
  useEffect(() => {
    if (props.fields) {
      setFields(props.fields);
      // deep clone to avoid mirroring
      setOriginalFields(JSON.parse(JSON.stringify(props.fields)));
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

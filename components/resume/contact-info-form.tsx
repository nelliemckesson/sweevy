'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import DraggableFields from "@/components/ui/draggable-fields";
import { setContactInfo } from "@/app/actions/db";

export default function ContactInfoForm(props) {
  // [{label: 'City', value: 'Portland, OR', position: 4}]
  const [fields, setFields] = useState([]);
  const [originalFields, setOriginalFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSetFields = (newFields) => {
    setFields(newFields);
    setHasChanges(JSON.stringify(newFields) !== JSON.stringify(originalFields));
  }

  const handleSave = async () => {
    console.log("saving!");
    let newFields = await setContactInfo(props.userId, fields);
    console.log("saved!");
    setOriginalFields(fields);
    setHasChanges(false);
  }

  const handleCancel = () => {
    setFields(originalFields);
    setHasChanges(false);
  }

  useEffect(() => {
    console.log(props.fields);

    if (props.fields) {
      const sortedFields = props.fields.sort((a, b) => a.position - b.position);
      setFields(sortedFields);
      setOriginalFields(sortedFields);
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

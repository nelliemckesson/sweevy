'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { setSkill, deleteSkill } from "@/app/actions/db";

export function SkillsForm(props) {
  // [{label: '', value: 'Photoshop', position: 4}]
  const [fields, setFields] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [originalFields, setOriginalFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSetFields = (newFields) => {
    setFields(prev => {
      // check for any removed fields
      const removedFields = prev.filter(
        oldField => !newFields.some(newField => newField.value === oldField.value)
      );
      setRemoved(prev => removedFields);
      return newFields;
    });
    setHasChanges(JSON.stringify(newFields) !== JSON.stringify(originalFields));
  }

  const handleSave = async () => {
    // update any changed fields
    const cleanedFields = fields.map(field => {
      const { changed: _, ...rest } = field;
      if (field.changed) {
        // upsert the changed field
        const newSkill = setSkill(props.userId, rest);
      }
      return newSkill;
    });
    // delete any removed fields
    removed.forEach(field => {
      console.log(field);
      handleDeleteField(field);
    });
    // adjust frontend data
    setRemoved([]);
    setOriginalFields(cleanedFields);
    setHasChanges(false);
  }

  const handleDeleteField = (field) => {
    // only need to run this if it exists in the db
    if (field.id) {
      const { changed: _, ...rest } = field;
      deleteSkill(props.userId, rest);
    }
  }

  const handleCancel = () => {
    setFields(originalFields);
    setRemoved([]);
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

'use client';

import { useState } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function DraggableFields(props) {
  const [draggedItem, setDraggedItem] = useState(null);

  const { fields, handleSetFields } = props;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === index) return;

    const newFields = [...fields];
    const draggedField = newFields[draggedItem];

    newFields.splice(draggedItem, 1);
    newFields.splice(index, 0, draggedField);

    // Update positions to match new order
    const fieldsWithUpdatedPositions = newFields.map((field, idx) => ({
      ...field,
      position: idx
    }));

    handleSetFields(fieldsWithUpdatedPositions);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addField = () => {
    const newFields = [...fields];
    newFields.push({label: '', value: '', position: fields.length});
    handleSetFields(newFields);
  }

  const removeField = (position: number) => {
    handleSetFields(fields.filter(field => field.position !== position));
  };

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div
          key={field.position}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`group flex items-center gap-3 bg-white rounded-lg transition-all ${
            draggedItem === index ? 'opacity-50 scale-95' : 'opacity-100'
          } hover:border-blue-300 hover:shadow-sm`}
        >
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
            <GripVertical size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-row gap-4">
              <input 
                type="checkbox" 
                id={`include${field.position}`} 
                name={`include${field.position}`}
                aria-label="Include field in download"
                checked
              />
              <input
                type="text"
                value={field.value}
                placeholder={field.label || "Type some text..."}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].value = e.target.value;
                  handleSetFields(newFields);
                }}
                className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={() => removeField(field.position)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            aria-label="Remove field"
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <Button variant="ghost" onClick={addField}><Plus size={20} />Add a new item</Button>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { GripVertical, X } from 'lucide-react';

// props types are validated in earlier components
export default function DraggableFields(props) {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

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
    
    setFields(newFields);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const removeField = (position: number) => {
    setFields(fields.filter(field => field.position !== position));
  };

  useEffect(() => {
    console.log(props.fields);

    if (props.fields) {
      setFields(props.fields.sort((a, b) => a.position - b.position));
    }
  }, [props.fields]);

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
              />
              <input
                type="text"
                value={field.value}
                placeholder={field.label || "Type some text..."}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].value = e.target.value;
                  setFields(newFields);
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
    </div>
  );
}
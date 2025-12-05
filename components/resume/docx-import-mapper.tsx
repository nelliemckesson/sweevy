'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { ResumeField, PersistedData, Field } from "@/lib/types";
import { preformatData } from "@/lib/formatting_utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { NewCustomSection } from "@/components/resume/new-custom-section";

// --------
// DESCRIPTION: 
// Map paragraphs from docx file to the correct sections/types
// --------

// persistedData:
  // {
  //   contactinfos: [
  //     {id, label, value, include, position, classnames}
  //   ],
  //   roles: [{
  //     classnames, 
  //     id, 
  //     include, 
  //     label, 
  //     position, 
  //     roleitems: [{
  //       classnames, id, include, parent, position, value
  //     }],
  //     value
  //   }],
  //   educations: [{
  //     classnames, 
  //     id, 
  //     include, 
  //     label, 
  //     position, 
  //     educationitems: [{
  //       classnames, id, include, parent, position, value
  //     }],
  //     value
  //   }],
  //   customsection-1: [
  //     classnames,
  //     customsectionitems: [{
  //       classnames, id, include, parent, position, value
  //     }],
  //     id,
  //     include,
  //     name,
  //     position,
  //   ]
  // }

export function DocxImportMapper({
  importedData,
  loadedResume,
  persistedData
}: {
  importedData: string[],
  loadedResume: ResumeField,
  persistedData: PersistedData
}): Promise<JSX.Element> {
  const [resumeData, setResumeData] = useState<PersistedData | null>(null);
  const [draggedParagraph, setDraggedParagraph] = useState<{index: number, text: string} | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{index?: number, section: string} | null>(null);
  const [added, setAdded] = useState<number[]>([]);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number, text: string): void => {
    setDraggedParagraph({ index, text });
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback((): void => {
    setDraggedParagraph(null);
    setDragOverItem(null);
  }, []);

  // only need section label to insert new item
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, section: string): void => {
    e.preventDefault();

    if (draggedParagraph === null) return;

    setDragOverItem({section});
  }, [draggedParagraph]);

  // use section label and item index to insert new item
  const handleDragOverSubitem = useCallback((e: React.DragEvent<HTMLDivElement>, index: number, section: string): void => {
    e.preventDefault();

    if (draggedParagraph === null) return;

    if (draggedParagraph.index === index) {
      setDragOverItem(null);
    } else {
      setDragOverItem({index, section});
    }
  }, [draggedParagraph]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();

    if (draggedParagraph === null || dragOverItem === null) {
      setDraggedParagraph(null);
      setDragOverItem(null);
      return;
    }

    setAdded(prev => [...prev, draggedParagraph.index]);

    let fields = resumeData[dragOverItem.section];
    if (dragOverItem.hasOwnProperty("index")) {
      fields = fields[dragOverItem.index];
    }

    const newFields = [...fields]; 
    let newData = {...resumeData}; 

    const newField: Field = {
      label: '',
      value: draggedParagraph.text,
      importedIndex: draggedParagraph.index,
      changed: true,
      include: true
    };

    newField.position = newData[dragOverItem.section].length; // skills, contactinfos

    if (dragOverItem.hasOwnProperty("index")) {
      newField.parent = newData[dragOverItem.section][dragOverItem.index].id;
      // add the new field to the subitem array
      if (dragOverItem.section === "roles") {
        newField.position = newData[dragOverItem.section][dragOverItem.index].roleitems.length - 1;
        newData[dragOverItem.section][dragOverItem.index].roleitems.push(newField);
      } else if (dragOverItem.section === "educations") {
        newField.position = newData[dragOverItem.section][dragOverItem.index].educationitems.length - 1;
        newData[dragOverItem.section][dragOverItem.index].educationitems.push(newField);
      } else if (dragOverItem.section.startsWith("customsection")) {
        newField.position = newData[dragOverItem.section][dragOverItem.index].customsectionitems.length - 1;
        newData[dragOverItem.section][dragOverItem.index].customsectionitems.push(newField);
      }
    } else {
      // add the new field to the section array
      newData[dragOverItem.section].push(newField);
    }

    setResumeData(prev => newData);

    setDraggedParagraph(null);
    setDragOverItem(null);
  }, [draggedParagraph, dragOverItem]);

  const removeNewField = (subindex, item) => {
    console.log("would remove");
    console.log(subindex, item);

    // TO DO remove from resumeData

    // TO DO remove from added (using item.importedIndex)
    // setAdded(...)
  }

  const saveResume = () => {
    // TO DO:
    // loop through and save all changed fields, remove importedIndex from fields
  }

  useEffect(() => {
    if (persistedData) {
      console.log(persistedData);
      setResumeData(persistedData);
    }
  }, [persistedData]);

  if (!resumeData) return (<div>Loading...</div>);

  return (
    <div className="flex flex-col items-end">
      <div className="flex flex-row gap-4 mt-5 mb-4 h-[calc(100vh-200px)]">
        <div className="w-1/2 pr-3 overflow-y-auto">
          {importedData.map((item, i) => {
            return (
              <div
                key={i}
                draggable
                onDragStart={(e) => handleDragStart(e, i, item)}
                onDragEnd={handleDragEnd}
                className={`cursor-grab active:cursor-grabbing p-2 mb-2 bg-gray-50 rounded border hover:border-blue-300 hover:shadow-sm ${
                  draggedParagraph?.index === i ? 'opacity-50' : 'opacity-100'
                } ${
                  added.indexOf(i) > -1 ? 'text-gray-400' : 'text-black'
                }`}
              >
                <p>{item}</p>
              </div>
            )
          })}
        </div>
        <div className="w-1/2 border-l pl-3 overflow-y-auto">
          {loadedResume.fields?.positions.map((item, i) => {
            let {sectionTitle, classnames, subitems} = preformatData(item, resumeData, loadedResume);

            subitems = subitems.map((subitem, subindex) => {
              let subClassnames = subitem.classnames || [];
              let subSubitems = [];
              if (item === "roles") {
                subSubitems = subitem.roleitems;
              } else if (item === "educations") {
                subSubitems = subitem.educationitems;
              }
              subSubitems = subSubitems.filter(subSubitem => subSubitem.include);
              return (
                <div key={`sub${subindex}`}>
                  <div className={`ml-4 ${subitem.changed ? "text-blue-400": ""}`}>
                    <div className={`font-serif flex flex-row justify-start items-center ${subitem.changed ? 'text-blue-500' : 'text-gray-400'}`}>
                      {subitem.changed && (
                        <button
                          onClick={() => removeNewField(subindex, item)}
                          className="p-2 text-gray-400 md:text-gray-400 md:hover:text-red-500 hover:bg-red-50 rounded"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      )}
                      {subClassnames.indexOf("bullet") > -1 && (
                        <span className={subClassnames.join(" ")}>&#8226;&nbsp;</span>
                      )}
                      {subClassnames.indexOf("numbered") > -1 && (
                        <span className={subClassnames.join(" ")}>{subindex+1}.&nbsp;</span>
                      )}
                      <p 
                        className={subClassnames.join(" ")}
                        dangerouslySetInnerHTML={{ __html: subitem.value }}
                      />
                    </div>
                    {(item === "roles" || item === "educations") && (
                      <div
                        className="dropzone border-2 border-dashed border-blue-500 text-blue-500 text-black h-10 flex items-center justify-center transition-colors hover:bg-blue-50"
                        onDragOver={(e) => handleDragOverSubitem(e, subindex, item)}
                        onDrop={(e) => handleDrop(e, `${item}-description-${subindex}`)}
                      >
                        Drop new description items here
                      </div>
                    )}
                  </div>
                  {subSubitems.map((subSubitem, subSubindex) => {
                    return (
                      <div 
                        key={`subsub${subSubindex}`} 
                        className="font-serif flex flex-row justify-start items-center text-gray-400 ml-8"
                      >
                        {subSubitem.classnames?.indexOf("bullet") > -1 && (
                          <span className={subSubitem.classnames?.join(" ")}>&#8226;&nbsp;</span>
                        )}
                        {subSubitem.classnames?.indexOf("numbered") > -1 && (
                          <span className={subSubitem.classnames?.join(" ")}>{subSubindex+1}.&nbsp;</span>
                        )}
                        <p 
                          className={subSubitem.classnames?.join(" ")}
                          dangerouslySetInnerHTML={{ __html: subSubitem.value }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            });
            return (
              <div key={i} className="mt-4">
                {sectionTitle ? (
                  <h3 
                    className={`text-xl border-b mb-2 ${classnames.join(" ")}`}
                    dangerouslySetInnerHTML={{ __html: sectionTitle }}
                  />
                ) : (
                  <h3 
                    className={`text-xl border-b mb-2 text-gray-400 ${classnames.join(" ")}`}
                  >
                    Untitled Section
                  </h3>
                )}
                <div
                  className="dropzone border-2 border-dashed border-blue-500 text-blue-500 text-black h-10 flex items-center justify-center transition-colors hover:bg-blue-50"
                  onDragOver={(e) => handleDragOver(e, item)}
                  onDrop={(e) => handleDrop(e, `${item}-section`)}
                >
                  Drop new items here
                </div>
                {subitems}
              </div>
            )
          })}
          <div
            className="dropzone border-2 border-dashed border-blue-500 text-blue-500 text-black h-10 flex items-center justify-center mt-10 transition-colors hover:bg-blue-50"
            onDragOver={(e) => handleDragOver(e, item)}
            onDrop={(e) => handleDrop(e, `${item}-section`)}
          >
            Create new section and add item
          </div>
        </div>
      </div>
      <Button onClick={() => saveResume()}>Import</Button>
    </div>
  );
}

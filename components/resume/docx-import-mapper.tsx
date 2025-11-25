'use client';

import { useState, useEffect } from 'react';
import { ResumeField, PersistedData } from "@/lib/types";
import { preformatData } from "@/lib/formatting_utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { NewCustomSection } from "@/components/resume/new-custom-section";

// --------
// DESCRIPTION: 
// Map paragraphs from docx file to the correct sections/types
// --------
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number, text: string) => {
    setDraggedParagraph({ index, text });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedParagraph(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropZoneType: string) => {
    e.preventDefault();
    if (draggedParagraph) {
      console.log(`Dropped paragraph ${draggedParagraph.index} (${draggedParagraph.text}) into ${dropZoneType}`);
      // TODO: Implement actual drop logic
    }
    setDraggedParagraph(null);
  };

 useEffect(() => {
    if (persistedData) {
      console.log(persistedData);
      setResumeData(persistedData);
    }
  }, [persistedData]);

  if (!resumeData) return (<div>Loading...</div>);

  return (
    <div className="flex flex-row gap-4 mt-5 h-[calc(100vh-200px)]">
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
                <div className="ml-4">
                  <div className="font-serif flex flex-row justify-start items-center text-gray-400">
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
                      onDragOver={handleDragOver}
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
                onDragOver={handleDragOver}
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
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, `${item}-section`)}
        >
          Create new section and add item
        </div>
      </div>
    </div>
  );
}

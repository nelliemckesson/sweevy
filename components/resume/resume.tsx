'use client';

import { useState, useEffect, Suspense } from 'react';
import { ChevronsUp, ChevronsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PinnedResumes } from "@/components/resume/pinned-resumes";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { ContactInfo } from "@/components/resume/contact-info";
import { Skills } from "@/components/resume/skills";
import { Roles } from "@/components/resume/roles";
import { Educations } from "@/components/resume/educations";
import { setResume } from "@/app/actions/db";

// Example activeResume:
// {
//  "positions": [
//    "contactinfos",
//    "skills",
//    "roles",
//    "educations"
//  ],
//  "contactinfos": {
//    2: {"position": 0},
//    5: {"position": 3}
//  },
//  "roles": {
//    1: {
//      "position": 0,
//      "subitems": {
//        3: {
//          "position": 0
//        },
//        6: {
//          "position": 2
//        }
//      }
//    }
//  }
// }

// --------
// DESCRIPTION: 
// Main resume container
// --------
export function Resume({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const [activeResume, setActiveResume] = useState({"fields": {"positions": []}});

  const moveSectionUp = async (index) => {
    if (index === 0) return;

    const newPositions = [...activeResume.fields.positions];
    [newPositions[index - 1], newPositions[index]] = [newPositions[index], newPositions[index - 1]];

    const updatedResume = {
      ...activeResume,
      fields: {
        ...activeResume.fields,
        positions: newPositions
      }
    };

    setActiveResume(updatedResume);
    let savedResume = { ...updatedResume, name: "default" };
    await setResume(userId, savedResume);
  }

  const moveSectionDown = async (index) => {
    if (index >= activeResume.fields.positions.length - 1) return;

    const newPositions = [...activeResume.fields.positions];
    [newPositions[index], newPositions[index + 1]] = [newPositions[index + 1], newPositions[index]];

    const updatedResume = {
      ...activeResume,
      fields: {
        ...activeResume.fields,
        positions: newPositions
      }
    };

    setActiveResume(updatedResume);
    let savedResume = { ...updatedResume, name: "default" };
    await setResume(userId, savedResume);
  }

  useEffect(() => {
    setActiveResume(loadedResume);
  }, [loadedResume]);

  return (
    <div className="max-w-4xl w-4/5">

      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-lg">Update Your Resumé</h2>
        <Suspense fallback={<div>Loading pinned resumés...</div>}>
          <PinnedResumes userId={userId} />
        </Suspense>
      </div>

      <div className="w-100 border p-5 bg-white">
        {activeResume.fields.positions.map((item, index) => {

          let childComponent;
          switch (item) {
            case "contactinfos":
              childComponent = (<ContactInfo userId={userId} loadedResume={activeResume} />);
              break;
            case "skills":
              childComponent = (<Skills userId={userId} loadedResume={activeResume} />);
              break;
            case "roles":
              childComponent = (<Roles userId={userId} loadedResume={activeResume} />);
              break;
            case "educations":
              childComponent = (<Educations userId={userId} loadedResume={activeResume} />);
              break;
            default:
              // TO DO: add custom sections here 
              break;
          }

          return (
            <div
              key={index}
              className="flex flex-row items-start justify-start"
            >
              {childComponent}
              <div className="flex flex-row items-start justify-start">
                {index !== 0 && (
                  <ChevronsUp 
                    size={20} 
                    className="cursor-pointer" 
                    title="Move Up" 
                    aria-label="Move Section Up" 
                    onClick={e => moveSectionUp(index)}
                  />
                )}
                {index < activeResume.fields.positions.length-1 && (
                  <ChevronsDown
                    size={20}
                    className="cursor-pointer"
                    title="Move Down"
                    aria-label="Move Section Down"
                    onClick={e => moveSectionDown(index)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

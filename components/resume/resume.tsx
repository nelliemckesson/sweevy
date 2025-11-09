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

  const moveSectionUp = (index) => {
    console.log("would move up");
    return;
  }

  useEffect(() => {
    console.log(loadedResume);
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
            case "contactinfo":
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

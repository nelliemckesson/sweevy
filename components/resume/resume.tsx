'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { PinnedResumes } from "@/components/resume/pinned-resumes";
import { DraggableFields } from "@/components/ui/draggable-fields";
import { ContactInfo } from "@/components/resume/contact-info";
import { Skills } from "@/components/resume/skills";
import { Roles } from "@/components/resume/roles";
import { Educations } from "@/components/resume/educations";
import { CustomSection } from "@/components/resume/custom-section";
import { setResume, setCustomSection } from "@/app/actions/db";

// TO DO: 
// MVP:
// Get fontsizes working...
// Duplicate an item
// Preview designed resume
// Include section titles and positions in pinned resumes?
// Design spans within a value
// Download html (handle all the new stuff)
// Download .docx
// Subscription plans
// Better landing page
// Form validation
// Rate limiting
// Load a job description side-by-side

// AI:
// Use AI to analyze a job description
// Use AI to refactor bullets based on job description
// Use AI to refactor bullets based on typed text

// Example activeResume:
// {
//  "positions": [
//    "contactinfos",
//    "skills",
//    "roles",
//    "educations"
//  ],
//  "titles": {"skills": "Ninja Skills"}
//  "classnames": {"skills": ["fontsize36"]}
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
  const [shouldLoadData, setShouldLoadData] = useState(true);
  const [persistedData, setPersistedData] = useState({
    contactinfos: [],
    skills: [],
    roles: [],
    educations: []
  });
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const updateResume = async (updatedResume) => {
    setShouldLoadData(prev => false);

    setActiveResume(updatedResume);
    let savedResume = { ...updatedResume, name: "default" };
    await setResume(userId, savedResume);

    setShouldLoadData(prev => true);
  }

  const moveSectionUp = async (index) => {
    if (index === 0) return;

    setShouldLoadData(prev => false);

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

    setShouldLoadData(prev => true);
  }

  const moveSectionDown = async (index) => {
    if (index >= activeResume.fields.positions.length - 1) return;

    setShouldLoadData(prev => false);

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

    setShouldLoadData(prev => true);
  }

  const handleCreateCustomSection = async () => {
    // Create the custom section in the database
    const newSection = await setCustomSection(userId, {
      name: newSectionName || null,
      include: true,
      position: activeResume.fields.positions.length
    });

    if (newSection) {
      // Add to activeResume positions
      const newPositions = [...activeResume.fields.positions, `customsection-${newSection.id}`];
      const updatedResume = {
        ...activeResume,
        fields: {
          ...activeResume.fields,
          positions: newPositions
        }
      };

      setActiveResume(updatedResume);

      // Save the updated resume
      let savedResume = { ...updatedResume, name: "default" };
      await setResume(userId, savedResume);

      // Reset form
      setNewSectionName("");
      setShowNewSectionForm(false);
    }
  }

  useEffect(() => {
    setActiveResume(loadedResume);
  }, [loadedResume]);

  return (
    <div className="max-w-none md:max-w-4xl w-full md:w-4/5">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
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
              childComponent = (
                <ContactInfo 
                  userId={userId} 
                  loadedResume={activeResume} 
                  handleMoveSectionUp={moveSectionUp} 
                  handleMoveSectionDown={moveSectionDown} 
                  handleSetPersistedData={setPersistedData}
                  persistedData={persistedData.contactinfos}
                  shouldLoadData={shouldLoadData}
                  index={index}
                  fieldsLength={activeResume.fields.positions.length}
                />
              );
              break;
            case "skills":
              childComponent = (
                <Skills 
                  userId={userId} 
                  loadedResume={activeResume} 
                  handleMoveSectionUp={moveSectionUp} 
                  handleMoveSectionDown={moveSectionDown} 
                  handleSetPersistedData={setPersistedData}
                  handleUpdateResume={updateResume}
                  persistedData={persistedData.skills}
                  shouldLoadData={shouldLoadData}
                  index={index}
                  fieldsLength={activeResume.fields.positions.length}
                />
              );
              break;
            case "roles":
              childComponent = (
                <Roles 
                  userId={userId} 
                  loadedResume={activeResume} 
                  handleMoveSectionUp={moveSectionUp} 
                  handleMoveSectionDown={moveSectionDown} 
                  handleSetPersistedData={setPersistedData}
                  handleUpdateResume={updateResume}
                  persistedData={persistedData.roles}
                  shouldLoadData={shouldLoadData}
                  index={index}
                  fieldsLength={activeResume.fields.positions.length}
                />
              );
              break;
            case "educations":
              childComponent = (
                <Educations 
                  userId={userId} 
                  loadedResume={activeResume} 
                  handleMoveSectionUp={moveSectionUp} 
                  handleMoveSectionDown={moveSectionDown} 
                  handleSetPersistedData={setPersistedData}
                  handleUpdateResume={updateResume}
                  persistedData={persistedData.educations}
                  shouldLoadData={shouldLoadData}
                  index={index}
                  fieldsLength={activeResume.fields.positions.length}
                />
              );
              break;
            default:
              // Handle custom sections
              if (item.startsWith("customsection-")) {
                const sectionId = parseInt(item.replace("customsection-", ""));

                if (sectionId) {
                  childComponent = (
                    <CustomSection
                      userId={userId}
                      loadedResume={activeResume}
                      handleMoveSectionUp={moveSectionUp}
                      handleMoveSectionDown={moveSectionDown}
                      handleSetPersistedData={setPersistedData}
                      persistedData={persistedData[`customsection-${sectionId}`] || []}
                      shouldLoadData={shouldLoadData}
                      index={index}
                      fieldsLength={activeResume.fields.positions.length}
                      sectionId={sectionId}
                    />
                  );
                }
              }
              break;
          }

          return (
            <div
              key={index}
              className="flex flex-row items-start justify-start"
            >
              {childComponent}
            </div>
          );
        })}

        {/* Add Custom Section Button */}
        <div className="mt-6 border-t-2 pt-4">
          {!showNewSectionForm ? (
            <Button
              onClick={() => setShowNewSectionForm(true)}
              variant="outline"
            >
              + Add Custom Section
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="section-name" className="text-sm font-medium">
                  Section Name (optional)
                </label>
                <input
                  id="section-name"
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., Certifications, Publications, etc."
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCustomSection}>
                  Create Section
                </Button>
                <Button
                  onClick={() => {
                    setShowNewSectionForm(false);
                    setNewSectionName("");
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

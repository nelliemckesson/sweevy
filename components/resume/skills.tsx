import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { UpDownButtons } from "@/components/ui/up-down-buttons";
import { SkillsForm } from "@/components/resume/skills-form";
import { fetchSkills } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of skills (software, programming languages, etc.)
// --------
export function Skills({ 
  userId, 
  loadedResume,
  handleMoveSectionUp,
  handleMoveSectionDown,
  handleSetPersistedData,
  persistedData,
  shouldLoadData,
  index,
  fieldsLength
}: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchSkills(userId);
      loadedData = adjustData(loadedData, loadedResume, "skills");
      setData(loadedData);
      handleSetPersistedData(prev => ({...prev, skills: loadedData}));
    }
    if (shouldLoadData) {
      fetchData();
    } else {
      setData(persistedData);
    }
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <div className="border-b-2 flex flex-row justify-between items-end">
        <h2 className="text-xl">Skills</h2>
        <UpDownButtons 
          handleMoveSectionUp={handleMoveSectionUp} 
          handleMoveSectionDown={handleMoveSectionDown} 
          index={index}
          fieldsLength={fieldsLength}
        />
      </div>
      <SkillsForm fields={data || []} userId={userId} />
    </div>
  );
}

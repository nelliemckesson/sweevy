import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { SkillsForm } from "@/components/resume/skills-form";
import { fetchSkills } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of skills (software, programming languages, etc.)
// --------
export function Skills({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchSkills(userId);
      loadedData = adjustData(loadedData, loadedResume, "skills");
      setData(loadedData);
    }
    fetchData();
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl border-b-2">Skills</h2>
      <SkillsForm fields={data || []} userId={userId} />
    </div>
  );
}

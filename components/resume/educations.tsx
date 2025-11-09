import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { EducationsForm } from "@/components/resume/educations-form";
import { fetchEducations } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of education and descriptions
// --------
export function Educations({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchEducations(userId);
      loadedData = adjustData(loadedData, loadedResume, "educations", "educationitems");
      setData(loadedData);
    }
    fetchData();
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl border-b-2">Education</h2>
      <EducationsForm fields={data || []} userId={userId} />
    </div>
  );
}

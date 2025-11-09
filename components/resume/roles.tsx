import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { RolesForm } from "@/components/resume/roles-form";
import { fetchRoles } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of roles and employers, time spans for each role, and responsibilities
// --------
export function Roles({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchRoles(userId);
      loadedData = adjustData(loadedData, loadedResume, "roles", "roleitems");
      setData(loadedData);
    }
    fetchData();
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl border-b-2">Experience</h2>
      <RolesForm fields={data || []} userId={userId} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { ResumeSectionProps } from "@/lib/types";
import { RolesForm } from "@/components/resume/roles-form";
import { fetchRoles } from "@/app/actions/db";

// --------
// DESCRIPTION: 
// List of roles and employers, time spans for each role, and responsibilities
// --------
export async function Roles({ userId }: ResumeSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();
  // fetch roles and role items
  const data = await fetchRoles(userId, supabase);
  // reformat data for draggableFields comp
  const cleanedData = data.map(role => {
    role.children = role.roleitems;
    return role;
  });
  console.log(cleanedData);

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl">Experience</h2>
      <RolesForm fields={cleanedData || []} userId={userId} />
    </div>
  );
}

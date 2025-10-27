import { createClient } from "@/lib/supabase/server";
import { ResumeSectionProps } from "@/lib/types";
import { EducationsForm } from "@/components/resume/educations-form";
import { fetchEducations } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of education and descriptions
// --------
export async function Educations({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();
  // fetch roles and role items
  let data = await fetchEducations(userId, supabase); // returns an array

  // adjust based on loaded resume
  data = adjustData(data, loadedResume, "educations", "educationitems");

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl">Education</h2>
      <EducationsForm fields={data || []} userId={userId} />
    </div>
  );
}

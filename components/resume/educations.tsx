import { createClient } from "@/lib/supabase/server";
import { ResumeSectionProps } from "@/lib/types";
import { EducationsForm } from "@/components/resume/educations-form";
import { fetchEducations } from "@/app/actions/db";

// --------
// DESCRIPTION: 
// List of roles and employers, time spans for each role, and responsibilities
// --------
export async function Educations({ userId, loadedResume }: ResumeSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();
  // fetch roles and role items
  const data = await fetchEducations(userId, supabase);

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl">Education</h2>
      <EducationsForm fields={data || []} userId={userId} />
    </div>
  );
}

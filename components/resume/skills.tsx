import { createClient } from "@/lib/supabase/server";
import { ResumeSectionProps } from "@/lib/types";
import { SkillsForm } from "@/components/resume/skills-form";
import { fetchSkills } from "@/app/actions/db";

// --------
// DESCRIPTION: 
// List of skills (software, programming languages, etc.)
// --------
export async function Skills({ userId }: ResumeSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();
  const data = await fetchSkills(userId, supabase);

  return (
    <div className="flex-1 w-full flex flex-col gap-0">
      <h2 className="text-xl">Skills</h2>
      <SkillsForm fields={data || []} userId={userId} />
    </div>
  );
}

import { SkillsForm } from "@/components/resume/skills-form";
// import { fetchContactInfo } from "@/app/actions/db";

// --------
// DESCRIPTION: 
// List of skills (software, programming languages, etc.)
// --------
export async function Skills(props) {
  // keep data actions server-side
  // const data = await fetchContactInfo(props.userId, props.supabase);
  const data = [];

  // editable form needs client, thus will be a subcomponent
  return (
    <div className="flex-1 w-full flex flex-col gap-3">
      <h2 className="text-xl">Skills</h2>
      <SkillsForm fields={data || []} userId={props.userId} />
    </div>
  );
}

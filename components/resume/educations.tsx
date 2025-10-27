import { createClient } from "@/lib/supabase/server";
import { ResumeSectionProps } from "@/lib/types";
import { EducationsForm } from "@/components/resume/educations-form";
import { fetchEducations } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// {
//   "contactinfo": {
//     "0": [],
//     "2": [],
//     "3": [],
//     "4": []
//   },
//   "skills": {
//     "8": [],
//     "9": []
//   },
//   "roles": {
//     "1": [
//       1
//     ]
//   },
  // "educations": {
  //   "1": [
  //     2
  //   ]
  // }
// }

// --------
// DESCRIPTION: 
// List of roles and employers, time spans for each role, and responsibilities
// --------
export async function Educations({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();
  // fetch roles and role items
  let data = await fetchEducations(userId, supabase); // returns an array

  // adjust based on loaded resume
  // TO DO: Also save position in pinned resume
  data = adjustData(data, loadedResume);

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <h2 className="text-xl">Education</h2>
      <EducationsForm fields={data || []} userId={userId} />
    </div>
  );
}

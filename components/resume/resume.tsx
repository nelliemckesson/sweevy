import { Suspense } from 'react';
import { createClient } from "@/lib/supabase/server";
import { Select } from "@/components/ui/select";
import { ContactInfo } from "@/components/resume/contact-info";
import { Skills } from "@/components/resume/skills";
import { Roles } from "@/components/resume/roles";
import { Educations } from "@/components/resume/educations";

// resume object:
// {
//   contact: [ids_to_include],
//   skills: [ids_to_include],
//   custom_section1_id: [ids_to_include]
//   experience: {ids_to_include: {ids_to_include}},
//   education: {ids_to_include: {ids_to_include}},
//   custom_section2_id: [ids_to_include]
// }

// --------
// DESCRIPTION: 
// Main resume container
// --------
export async function Resume({ userId, loadedResume }: ResumeSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();

  // preload all resume versions

  // Select options = all of a user's saved resume versions
  const options = ["design", "accessibility"];

  return (
    <div className="max-w-4xl w-4/5">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg mb-4">Update Your Resumé</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Select title={options.length > 0 ? "Saved Resumés..." : "No Saved Resumés"} defaultValue={"default"} options={options} />
        </Suspense>
      </div>
      <div className="w-100 border p-5 bg-white">
        <ContactInfo userId={userId} loadedResume={loadedResume} />
        <Skills userId={userId} loadedResume={loadedResume} />
        <Roles userId={userId} loadedResume={loadedResume} />
        <Educations userId={userId} loadedResume={loadedResume} />
      </div>
    </div>
  );
}

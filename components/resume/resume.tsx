import { Suspense } from 'react';
import { createClient } from "@/lib/supabase/server";
import { Pin, Info } from 'lucide-react';
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TextPopup } from "@/components/ui/text-popup";
import { ContactInfo } from "@/components/resume/contact-info";
import { Skills } from "@/components/resume/skills";
import { Roles } from "@/components/resume/roles";
import { Educations } from "@/components/resume/educations";

// resume object:
// name
// id
// userId
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

  const infoText = `Save your current bullet point selections 
    as a pinned resumé to tailor different versions 
    for specific jobs or companies -- e.g., "ux designer", 
    "web developer", etc. You can create multiple pinned 
    resumés and quickly switch between them.`;

  return (
    <div className="max-w-4xl w-4/5">
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-lg">Update Your Resumé</h2>
        <div className="flex flex-row justify-start items-center">
          <Suspense fallback={<div>Loading saved resumés...</div>}>
            <Select title={options.length > 0 ? "Load a Pinned Resumé..." : "No Pinned Resumés"} defaultValue={"default"} options={options} />
          </Suspense>
          <Button className="text-sm" variant="ghost"><Pin size={20} />Pin this Resumé</Button>
          <TextPopup content={infoText}>
            <Button className="p-0" variant="ghost"><Info size={20} /></Button>
          </TextPopup>
        </div>
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

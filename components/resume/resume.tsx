import { Suspense } from 'react';
import { createClient } from "@/lib/supabase/server";
import { PinnedResumes } from "@/components/resume/pin-resume-button";
import { ContactInfo } from "@/components/resume/contact-info";
import { Skills } from "@/components/resume/skills";
import { Roles } from "@/components/resume/roles";
import { Educations } from "@/components/resume/educations";

// resume object:
// name
// id
// userId
// {
//  "contactinfos": {
//    2: [],
//    5: []
//  },
//  "roles": {
//    1: [3, 6]
//  }
// }

// --------
// DESCRIPTION: 
// Main resume container
// --------
export async function Resume({ userId, loadedResume }: ResumeSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();

  return (
    <div className="max-w-4xl w-4/5">
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-lg">Update Your Resumé</h2>
        <Suspense fallback={<div>Loading pinned resumés...</div>}>
          <PinnedResumes userId={userId} />
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

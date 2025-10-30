import { Suspense } from 'react';
import { createClient } from "@/lib/supabase/server";
import { PinnedResumes } from "@/components/resume/pinned-resumes";
import { ContactInfo } from "@/components/resume/contact-info";
import { Skills } from "@/components/resume/skills";
import { Roles } from "@/components/resume/roles";
import { Educations } from "@/components/resume/educations";

// --------
// DESCRIPTION: 
// Main resume container
// --------
export async function Resume({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
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
        <ContactInfo userId={userId} loadedResume={resume} />
        <Skills userId={userId} loadedResume={resume} />
        <Roles userId={userId} loadedResume={resume} />
        <Educations userId={userId} loadedResume={resume} />
      </div>
    </div>
  );
}

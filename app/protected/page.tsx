import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { GripVertical, X, Brush, SquarePen, ChevronsUp, ChevronsDown, CopyPlus } from 'lucide-react';
import { setResume, fetchResume, fetchResumeByName, refreshData } from "@/app/actions/db";
import { DocxImport } from "@/components/resume/docx-import";
import { Resume } from "@/components/resume/resume";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data?.claims;

  let defaultResume = await fetchResumeByName(user.sub, "default");

  // populate default resume if it doesn't exist
  if (!defaultResume) {
    const defaultValues = {
      name: "default",
      fields: {
        positions: [
          "contactinfos",
          "skills",
          "roles",
          "educations"
        ],
      }
    };
    defaultResume = await setResume(user.sub, defaultValues);
  }

  const params = await searchParams;
  const loadedResumeId = params.resume || defaultResume.id;

  // load the pinned resume
  const loadedResume = await fetchResume(user.sub, loadedResumeId);

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row p-5 gap-3">

      <div className="w-full md:w-96">
        <p className="mb-3">
          Edit your resume. Create or adjust your job description bullet points for specific job applications, 
          and only include the applicable bullets when you download your resume to apply 
          for a job. Pin a version to save your bullet point settings for quick loading.
        </p>

        <DocxImport />

        <details open>
          <summary className="text-lg mb-5 cursor-pointer hover:opacity-70 transition-opacity">
            Guide
          </summary>
          <div>
            <p className="flex flex-row items-start gap-1 mb-1">
              <ChevronsUp size={20} /><ChevronsDown size={20} /> Click to move an entire section up or down
            </p>
            <p className="flex flex-row items-start gap-1 mb-1">
              <SquarePen size={20} /> Click to edit a section title
            </p>
            <p className="flex flex-row items-start gap-1 mb-1">
              <GripVertical size={20} /> Hold and drag to change the item order in a section
            </p>
            <p className="flex flex-row items-start gap-1 mb-1">
              <Brush size={20} /> Click to adjust an item's design
            </p>
            <p className="flex flex-row items-start gap-1 mb-1">
              <X size={20} /> Click to delete an item
            </p>
            <p className="flex flex-row items-start gap-1 mb-1">
              <CopyPlus size={20} /> Click to duplicate an item
            </p>
            <p className="flex flex-row items-start gap-1 mb-1">
              <input
                type="checkbox"
                className="inline-block mt-1"
                aria-label="Include field in download"
              />
              Turn off to exclude an item from the downloaded resumé
            </p>
          </div>
        </details>
      </div>

      <Resume userId={user.sub} loadedResume={loadedResume} />

    </div>
  );
}

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { GripVertical, X, Brush, ChevronsUp, ChevronsDown } from 'lucide-react';
import { setResume, fetchResume, fetchResumeByName, refreshData } from "@/app/actions/db";
import { DownloadButton } from "@/components/download-button";
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
        <h2 className="text-lg mb-3">Download Your Resumé</h2>
        <div className="flex flex-row gap-4 mb-5">
          <DownloadButton fileType="html" userId={user.sub} loadedResume={loadedResume} />
        </div>

        <details open>
          <summary className="text-lg mb-5 cursor-pointer hover:opacity-70 transition-opacity">
            Guide
          </summary>
          <div>
            <p className="flex flex-row items-start gap-1 mb-1">
              <ChevronsUp size={20} /><ChevronsDown size={20} /> Click to move an entire section up or down
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

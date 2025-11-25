import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { setResume, fetchResume, fetchResumeByName, refreshData } from "@/app/actions/db";
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
    <div>
      <Resume userId={user.sub} loadedResume={loadedResume} />
    </div>
  );
}

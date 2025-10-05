import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ContactInfo } from "@/components/resume/contact-info";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data?.claims;

  return (
    <div className="flex-1 w-full flex flex-col gap-3">
      <ContactInfo userId={user.sub} supabase={supabase} />
    </div>
  );
}

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { GripVertical, X } from 'lucide-react';
import { ContactInfo } from "@/components/resume/contact-info";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data?.claims;

  return (
    <div className="flex-1 w-full flex flex-row p-5 gap-3">

      <div className="w-96">
        <h2 className="text-lg mb-4">Instructions</h2>
        <p className="flex flex-row gap-1 mb-1">Click <GripVertical size={20} /> to change the item order in a section</p>
        <p className="flex flex-row gap-1 mb-1">Click <X size={20} /> to delete an item</p>
        <p className="mb-1">Click <input type="checkbox" /> to include an item in the downloaded resume</p>
      </div>

      <div className="max-w-4xl w-4/5 border p-5">
        <ContactInfo userId={user.sub} supabase={supabase} />
      </div>

    </div>
  );
}

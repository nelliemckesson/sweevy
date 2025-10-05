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
        <h2 className="text-lg mb-4">Guide</h2>
        <p className="flex flex-row items-start gap-1 mb-1">
          <GripVertical size={20} /> Hold and drag to change the item order in a section
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
          Turn off to exclude an item from the downloaded resume
        </p>
      </div>

      <div className="max-w-4xl w-4/5 border p-5">
        <ContactInfo userId={user.sub} supabase={supabase} />
      </div>

    </div>
  );
}

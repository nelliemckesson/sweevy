import { createClient } from "@/lib/supabase/server";
import { ResumeSectionProps } from "@/lib/types";
import { ContactInfoForm } from "@/components/resume/contact-info-form";
import { fetchContactInfo } from "@/app/actions/db";

// --------
// DESCRIPTION: 
// Contact info, that would appear at the top of a resume
// --------
export async function ContactInfo({ userId }: ResumeSectionProps): Promise<JSX.Element> {
  const supabase = await createClient();
  const data = await fetchContactInfo(userId, supabase);

  return (
    <div className="flex-1 w-full flex flex-col gap-3 mb-4">
      <h2 className="text-xl">Contact Info</h2>
      <ContactInfoForm fields={data || []} userId={userId} />
    </div>
  );
}

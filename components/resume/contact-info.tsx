import ContactInfoForm from "@/components/resume/contact-info-form";
import { fetchContactInfo } from "@/lib/db";

// --------
// DESCRIPTION: 
// Contact info, that would appear at the top of a resume
// --------
export async function ContactInfo(props) {
  // keep data actions server-side
  const data = await fetchContactInfo(props.userId, props.supabase);

  // editable form needs client, thus will be a subcomponent
  return (
    <div className="flex-1 w-full flex flex-col gap-3">
      <h2 className="text-xl">Contact Info</h2>
      <ContactInfoForm fields={data || {}} />
    </div>
  );
}

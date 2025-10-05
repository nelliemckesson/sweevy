import { fetchContactInfo, setContactInfo } from "@/lib/db";

// --------
// DESCRIPTION: 
// Contact info, that would appear at the top of a resume
// --------
export async function ContactInfo(props) {
  // keep data actions server-side
  const { data } = await fetchContactInfo(props.userId, props.supabase);

  // editable form needs client, thus will be a subcomponent
  return (
    <div className="flex-1 w-full flex flex-col gap-12 border border-foreground/50">
      
    </div>
  );
}

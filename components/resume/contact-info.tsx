import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { ContactInfoForm } from "@/components/resume/contact-info-form";
import { fetchContactInfo } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// Contact info, that would appear at the top of a resume
// --------
export function ContactInfo({ userId, loadedResume }: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    let loadedData = await fetchContactInfo(userId);
    loadedData = adjustData(loadedData, loadedResume, "contactinfo");
    setData(loadedData);
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-3 mb-4">
      <h2 className="text-xl border-b-2">Contact Info</h2>
      <ContactInfoForm fields={data || []} userId={userId} />
    </div>
  );
}

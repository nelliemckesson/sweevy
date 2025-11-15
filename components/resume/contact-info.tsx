import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { UpDownButtons } from "@/components/ui/up-down-buttons";
import { ContactInfoForm } from "@/components/resume/contact-info-form";
import { fetchContactInfo } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// Contact info, that would appear at the top of a resume
// --------
export function ContactInfo({ 
  userId, 
  loadedResume,
  handleMoveSectionUp,
  handleMoveSectionDown,
  handleSetPersistedData,
  persistedData,
  shouldLoadData,
  index,
  fieldsLength
}: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchContactInfo(userId);
      loadedData = adjustData(loadedData, loadedResume, "contactinfo");
      setData(loadedData);
      handleSetPersistedData(prev => ({...prev, contactinfos: loadedData}));
    }
    if (shouldLoadData) {
      fetchData();
    } else {
      setData(persistedData);
    }
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-3 mb-4">
      <div className="border-b-2 flex flex-row justify-between items-end">
        <h2 className="text-xl">Contact Info</h2>
        <UpDownButtons 
          handleMoveSectionUp={handleMoveSectionUp} 
          handleMoveSectionDown={handleMoveSectionDown} 
          index={index}
          fieldsLength={fieldsLength}
        />
      </div>
      <ContactInfoForm fields={data || []} userId={userId} />
    </div>
  );
}

// <h2 className="text-xl">Contact Info</h2>

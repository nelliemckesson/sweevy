import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { UpDownButtons } from "@/components/ui/up-down-buttons";
import { CustomSectionItemsForm } from "@/components/resume/custom-section-items-form";
import { fetchCustomSection } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION:
// Custom section with user-defined name and items
// --------
export function CustomSection({
  userId,
  loadedResume,
  handleMoveSectionUp,
  handleMoveSectionDown,
  handleSetPersistedData,
  persistedData,
  shouldLoadData,
  index,
  fieldsLength,
  sectionId
}: SubSectionProps & { sectionId: number }): Promise<JSX.Element> {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchCustomSection(sectionId);
      loadedData = adjustData(loadedData, loadedResume, `customsection-${sectionId}`, "customsectionitems");
      console.log(loadedData);
      setData(loadedData);
      handleSetPersistedData(prev => ({...prev, [`customsection-${sectionId}`]: loadedData}));
    }
    if (shouldLoadData) {
      fetchData();
    } else {
      setData(persistedData);
    }
  }, [userId, loadedResume, sectionId]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <div className="border-b-2 flex flex-row justify-between items-end">
        {data.name && <h2 className="text-xl">{data.name}</h2>}
        <UpDownButtons
          handleMoveSectionUp={handleMoveSectionUp}
          handleMoveSectionDown={handleMoveSectionDown}
          index={index}
          fieldsLength={fieldsLength}
        />
      </div>
      <CustomSectionItemsForm fields={data.customsectionitems || []} userId={userId} parent={data.id || null} />
    </div>
  );
}

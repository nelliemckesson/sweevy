import { useState, useEffect } from 'react';
import { SquarePen, Brush, Check, X } from 'lucide-react';
import { ResumeSectionProps } from "@/lib/types";
import { UpDownButtons } from "@/components/ui/up-down-buttons";
import { CustomSectionItemsForm } from "@/components/resume/custom-section-items-form";
import { SectionTitleControls } from "@/components/resume/section-title-controls";
import { SectionTitleForm } from "@/components/resume/section-title-form";
import { Modal } from "@/components/ui/modal";
import { DesignToolbar } from "@/components/resume/design-toolbar";
import { fetchCustomSection, setCustomSection } from "@/app/actions/db";
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
  const [data, setData] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveClassnames = async (classnames) => {
    const updatedData = { ...data, classnames };
    // remove customsectionitems before saving
    const subItems = [ ...updatedData.customsectionitems ];
    delete updatedData.customsectionitems;
    const result = await setCustomSection(userId, updatedData);
    if (result) {
      // add the customsectionitems back
      updatedData.customsectionitems = subItems;
      setData(updatedData);
      handleSetPersistedData(prev => ({...prev, [`customsection-${sectionId}`]: updatedData}));
    }
  }

  const handleEditName = () => {
    setEditedName(data.name || '');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    let updatedData = { ...data, name: editedName };
    // remove customsectionitems before saving
    const subItems = [ ...updatedData.customsectionitems ];
    delete updatedData.customsectionitems;
    const result = await setCustomSection(userId, updatedData);
    if (result) {
      // add the customsectionitems back
      updatedData.customsectionitems = subItems;
      setData(updatedData);
      handleSetPersistedData(prev => ({...prev, [`customsection-${sectionId}`]: updatedData}));
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const openDesignModal = () => {
    setIsOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchCustomSection(sectionId);
      loadedData = adjustData(loadedData, loadedResume, `customsection-${sectionId}`, "customsectionitems");
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
      <div className={`border-b-2 flex flex-row justify-between items-end`}>
        <div className="group flex flex-row items-center gap-2">
          {isEditingName ? (
            <SectionTitleForm 
              editedName={editedName} 
              setEditedName={setEditedName} 
              handleSaveName={handleSaveName} 
              handleCancelEdit={handleCancelEdit} 
            />
          ) : (
            <>
              <h2 className={`text-xl ${data?.classnames?.join(" ")}`}>{data.name || '[Untitled Section]'}</h2>
              <SectionTitleControls handleOpenModal={openDesignModal} handleEditName={handleEditName} />
            </>
          )}
        </div>
        <UpDownButtons
          handleMoveSectionUp={handleMoveSectionUp}
          handleMoveSectionDown={handleMoveSectionDown}
          index={index}
          fieldsLength={fieldsLength}
        />
      </div>
      <CustomSectionItemsForm fields={data.customsectionitems || []} userId={userId} parent={data.id || null} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <DesignToolbar
            field={{...data, value: data.name || '[Untitled Section]'}}
            onSave={(classnames) => {
              handleSaveClassnames(classnames);
              setIsOpen(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

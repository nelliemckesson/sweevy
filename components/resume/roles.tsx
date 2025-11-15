import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { UpDownButtons } from "@/components/ui/up-down-buttons";
import { Modal } from "@/components/ui/modal";
import { SectionTitleControls } from "@/components/resume/section-title-controls";
import { SectionTitleForm } from "@/components/resume/section-title-form";
import { DesignToolbar } from "@/components/resume/design-toolbar";
import { RolesForm } from "@/components/resume/roles-form";
import { fetchRoles, setResume } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of roles and employers, time spans for each role, and responsibilities
// --------
export function Roles({ 
  userId, 
  loadedResume,
  handleMoveSectionUp,
  handleMoveSectionDown,
  handleSetPersistedData,
  handleUpdateResume,
  persistedData,
  shouldLoadData,
  index,
  fieldsLength
}: SubSectionProps): Promise<JSX.Element> {
  const [data, setData] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('Experience');
  const [isOpen, setIsOpen] = useState(false);

  const handleEditName = () => {
    setEditedName(data.name || 'Experience');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    const updatedTitles = { ...loadedResume.fields.titles, roles: editedName };
    const updatedResume = { ...loadedResume.fields, titles: updatedTitles };

    handleUpdateResume({...loadedResume, fields: updatedResume});

    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('Experience');
  };

  const openDesignModal = () => {
    setIsOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchRoles(userId);
      loadedData = adjustData(loadedData, loadedResume, "roles", "roleitems");
      setData(loadedData);
      handleSetPersistedData(prev => ({...prev, roles: loadedData}));
      // if section has a custom name, use it
      if (loadedResume.fields.titles?.hasOwnProperty("roles")) {
        setEditedName(loadedResume.fields.titles.roles);
      } else {
        setEditedName("Experience");
      }
    }
    if (shouldLoadData) {
      fetchData();
    } else {
      setData(persistedData);
    }
  }, [userId, loadedResume]);  

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mb-4">
      <div className="border-b-2 flex flex-row justify-between items-end">
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
              <h2 className="text-xl">{editedName}</h2>
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
      <RolesForm fields={data || []} userId={userId} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <DesignToolbar
            field={{value: editedName}}
            onSave={() => console.log("woud")}
          />
        </div>
      </Modal>
    </div>
  );
}

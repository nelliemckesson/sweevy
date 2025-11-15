import { useState, useEffect } from 'react';
import { ResumeSectionProps } from "@/lib/types";
import { UpDownButtons } from "@/components/ui/up-down-buttons";
import { Modal } from "@/components/ui/modal";
import { SectionTitleControls } from "@/components/resume/section-title-controls";
import { SectionTitleForm } from "@/components/resume/section-title-form";
import { DesignToolbar } from "@/components/resume/design-toolbar";
import { SkillsForm } from "@/components/resume/skills-form";
import { fetchSkills, setResume } from "@/app/actions/db";
import { adjustData } from "@/lib/utils";

// --------
// DESCRIPTION: 
// List of skills (software, programming languages, etc.)
// --------
export function Skills({ 
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
  const [editedName, setEditedName] = useState('Skills');
  const [isOpen, setIsOpen] = useState(false);
  const [classnames, setClassnames] = useState([]);

  const handleSaveClassnames = async (classnames) => {
    const updatedClassnames = { ...loadedResume.fields.classnames, skills: classnames };
    const updatedResume = { ...loadedResume.fields, classnames: updatedClassnames };

    handleUpdateResume({...loadedResume, fields: updatedResume});
    setClassnames(classnames);
  };

  const handleEditName = () => {
    setEditedName(data.name || 'Skills');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    const updatedTitles = { ...loadedResume.fields.titles, skills: editedName };
    const updatedResume = { ...loadedResume.fields, titles: updatedTitles };

    handleUpdateResume({...loadedResume, fields: updatedResume});

    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('Skills');
  };

  const openDesignModal = () => {
    setIsOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      let loadedData = await fetchSkills(userId);
      loadedData = adjustData(loadedData, loadedResume, "skills");
      setData(loadedData);
      handleSetPersistedData(prev => ({...prev, skills: loadedData}));
      // if section has a custom name, use it
      if (loadedResume.fields.titles?.hasOwnProperty("skills")) {
        setEditedName(loadedResume.fields.titles.skills);
      } else {
        setEditedName("Skills");
      }
      // if section has design classnames, use the
      if (loadedResume.fields.classnames?.hasOwnProperty("skills")) {
        setClassnames(loadedResume.fields.classnames.skills);
      } else {
        setClassnames([]);
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
              <h2 className={`text-xl ${classnames.join(" ")}`}>{editedName}</h2>
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

      <SkillsForm fields={data || []} userId={userId} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <DesignToolbar
            field={{value: editedName}}
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

'use client';

import { Button } from "@/components/ui/button";

// --------
// DESCRIPTION: 
// Create a custom section
// --------
export function NewCustomSection({
  showNewSectionForm,
  handleSetShowNewSectionForm,
  newSectionName,
  handleSetNewSectionName,
  handleCreateCustomSection
}: {
  showNewSectionForm: boolean,
  handleSetShowNewSectionForm: (boolean) => void,
  newSectionName: string,
  handleSetNewSectionName: (string) => void,
  handleCreateCustomSection: () => void
}): Promise<JSX.Element> {

  return (
    <div className="mt-6 border-t-2 pt-4">
      {!showNewSectionForm ? (
        <Button
          onClick={() => handleSetShowNewSectionForm(true)}
          variant="outline"
        >
          + Add Custom Section
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="section-name" className="text-sm font-medium">
              Section Name (optional)
            </label>
            <input
              id="section-name"
              type="text"
              value={newSectionName}
              onChange={(e) => handleSetNewSectionName(e.target.value)}
              placeholder="e.g., Certifications, Publications, etc."
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateCustomSection}>
              Create Section
            </Button>
            <Button
              onClick={() => {
                handleSetShowNewSectionForm(false);
                handleSetNewSectionName("");
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>

  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pin, Info } from 'lucide-react';
import { ResumeField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextPopup } from "@/components/ui/text-popup";
import { Modal } from "@/components/ui/modal";
import { fetchAllData, fetchResumes, setResume, refreshData } from "@/app/actions/db";

// Example:
// {
//  "positions": [
//    "contactinfos",
//    "skills",
//    "roles",
//    "educations"
//  ],
//  "contactinfos": {
//    2: {"position": 0},
//    5: {"position": 3}
//  },
//  "roles": {
//    1: {
//      "position": 0,
//      "subitems": {
//        3: {
//          "position": 0
//        },
//        6: {
//          "position": 2
//        }
//      }
//    }
//  }
// }

export function PinnedResumes({ 
	userId, 
	activeResume, 
	setActiveResume 
}: { 
	userId: string, 
	activeResume: ResumeField, 
	setActiveResume: (updatedResume: ResumeField) => void 
}): JSX.Element {
	const router = useRouter();
  const searchParams = useSearchParams();

	const [resumes, setResumes] = useState([]);
	const [options, setOptions] = useState([]);
	const [pinning, setPinning] = useState(false);
	const [name, setName] = useState("");
	const [selectedResumeId, setSelectedResumeId] = useState("new");

  // If a pinned resume is loaded, surface an option to save the changes?

  const infoText = `Save your current bullet point selections 
    as a pinned resumé tailored for a specific job type
    -- e.g., "ux designer", "web developer", etc. You can 
    create multiple pinned resumés and quickly switch between them.`;

	const togglePinning = () => {
		setPinning(true);
	}

	const cancelPinning = () => {
		setPinning(false);
		setName("");
		setSelectedResumeId("new");
	}

	const pinResume = async () => {
		// Validate that a name is provided when creating new
		if (selectedResumeId === "new" && !name.trim()) {
			return;
		}

		let pinned = {};
		// use activeResume for section names and order
		pinned.positions = activeResume.fields.positions;
		if (activeResume.fields?.hasOwnProperty("titles")) {
			pinned.titles = activeResume.fields.titles;
		}
		if (activeResume.fields?.hasOwnProperty("classnames")) {
			pinned.classnames = activeResume.fields.classnames;
		}
    // fetch all resume data
    const data = await fetchAllData(userId);
    // for each section, collect ids of included items
    for (let k in data) {
    	pinned[k] = {};
    	// TO DO: set the section position
    	for (let i=0; i<data[k].length; i++) {
    		if (data[k][i]["include"]) {
    			// contactinfos don't have ids
    			let key = data[k][i]["id"] || data[k][i]["position"];
    			// create the base object to include
    			pinned[k][key] = {"position": data[k][i]["position"]};
    			// collect ids of included subitems
    			if (k === "roles" || k === "educations" || k === "customsections") {
    				let subArray = "roleitems";
    				if (k === "educations") {
    					subArray = "educationitems";
    				} else if (k === "customsections") {
    					subArray = "customsectionitems";
    				}
    				pinned[k][key]["subitems"] = {};
    				for (let j=0; j<data[k][i][subArray].length; j++) {
    					if (data[k][i][subArray][j]["include"]) {
    						let subitem = data[k][i][subArray][j];
    						pinned[k][key]["subitems"][subitem.id] = {"position": subitem.position};
    					}
    				}
    			}
    		}
    	}
    }

    if (selectedResumeId === "new") {
      // save as new resume
      let newResume = await setResume(userId, {name: name, fields: pinned});
      setResumes(prev => [...prev, newResume]);
    } else {
      // overwrite existing resume
      const existingResume = resumes.find(r => r.id === parseInt(selectedResumeId));
      let updatedResume = await setResume(userId, {id: selectedResumeId, name: existingResume.name, fields: pinned});
      setResumes(prev => prev.map(r => r.id === selectedResumeId ? updatedResume : r));
    }

    // reset state
    setPinning(false);
    setName("");
    setSelectedResumeId("new");
    refreshData();
    return;
  }

  const loadPinnedResume = (selectedId: string) => {
  	const existingResume = resumes.find(r => r.id === parseInt(selectedId));
  	setActiveResume(existingResume);
  	// const params = new URLSearchParams(searchParams.toString());
    // params.set('resume', value);
    // router.push(`?${params.toString()}`);
    // refreshData();
  }

  useEffect(() => {
  	const loadResumes = async () => {
	    // preload all resume versions
	  	let data = await fetchResumes(userId);

		  // create initial "default" resume for new users
		  if (!data || data.length === 0) {
		    let defaultResume = await setResume(userId, { name: "default", fields: {} });
		    setResumes([defaultResume]);
		  } else {
		  	setResumes(data);
		  }
		}

		loadResumes();
  }, []);

  useEffect(() => {
  	if (resumes && resumes.length > 0) {
  		// Select options = all of a user's saved resume versions
    	const arr = resumes.filter(item => item.name !== "default").map(item => [item.id, item.name]);
    	setOptions(arr);
    }
  }, [resumes]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-start items-start md:items-center">
        <Select
        	title={options.length > 0 ? "Load a Pinned Resumé..." : "No Pinned Resumés"}
        	defaultValue={"default"}
        	options={options}
        	handleSetValue={loadPinnedResume}
        />
        <div className="flex flex-row justify-start items-center">
		  	  <Button className="text-sm pl-0 md:pl-4" variant="ghost" onClick={togglePinning}>
		  	    <Pin size={20} />Pin
		  	  </Button>
		  	  <TextPopup content={infoText}>
	          <Button className="p-0" variant="ghost"><Info size={20} /></Button>
	        </TextPopup>
	      </div>
    	</div>

    	<Modal isOpen={pinning} onClose={cancelPinning}>
    	  <div className="p-6">
    	    <h2 className="text-xl font-semibold mb-4">Pin Resume</h2>
    	    <div className="flex flex-col gap-4">
    	      <div>
    	        <label className="block text-sm font-medium mb-2">
    	          {selectedResumeId === "new" ? "Create new or overwrite existing" : "Overwriting"}
    	        </label>
    	        <Select
    	          title={selectedResumeId === "new" ? "Create New" : resumes.find(r => r.id === selectedResumeId)?.name || "Select Resume"}
    	          defaultValue={selectedResumeId}
    	          options={[["new", "Create New"], ...options]}
    	          handleSetValue={setSelectedResumeId}
    	        />
    	      </div>
    	      {selectedResumeId === "new" && (
    	        <div>
    	          <label className="block text-sm font-medium mb-2">Resume Name</label>
    	          <input
    	            type="text"
    	            value={name}
    	            placeholder={"Name (e.g., 'ux designer')"}
    	            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    	              setName(e.target.value);
    	            }}
    	            className="w-full text-sm border p-2 rounded"
    	          />
    	        </div>
    	      )}
    	      <div className="flex justify-end gap-2 mt-4">
    	        <Button variant="ghost" onClick={cancelPinning}>Cancel</Button>
    	        <Button onClick={pinResume}>Save</Button>
    	      </div>
    	    </div>
    	  </div>
    	</Modal>
    </>
  )
}

'use client';

import { useState, useEffect } from 'react';
import { Pin, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextPopup } from "@/components/ui/text-popup";
import { fetchAllData, fetchResumes, setResume } from "@/app/actions/db";

// {
// 	"contactinfos": {
// 		2: [],
// 		5: []
// 	},
// 	"roles": {
// 		1: [3, 6]
// 	}
// }

export function PinResumeButton({ userId }: { userId: string }): JSX.Element {
	const [resumes, setResumes] = useState([]);
	const [options, setOptions] = useState([]);
	const [pinning, setPinning] = useState(false);
	const [name, setName] = useState("");

  // If a pinned resume is loaded, surface an option to save the changes?

  const infoText = `Save your current bullet point selections 
    as a pinned resumé tailored for a specific job type
    -- e.g., "ux designer", "web developer", etc. You can 
    create multiple pinned resumés and quickly switch between them.`;

	const togglePinning = () => {
		setPinning(true);
	}

	const pinResume = async () => {
		let pinned = {};
    // fetch all resume data
    const data = await fetchAllData(userId);
    console.log(data);
    // for each section, collect ids of included items
    for (let k in data) {
    	pinned[k] = {};
    	for (let i=0; i<data[k].length; i++) {
    		if (data[k][i]["include"]) {
    			// contactinfos don't have ids
    			let key = data[k][i]["id"] || data[k][i]["position"];
    			console.log(key);
    			// create the base object to include
    			pinned[k][key] = [];
    			// collect ids of included subitems
    			if (k === "roles" || k === "educations") {
    				let subArray = "roleitems";
    				if (k === "educations") {
    					subArray = "educationitems";
    				}
    				for (let j=0; j<data[k][i][subArray].length; j++) {
    					if (data[k][i][subArray][j]["include"]) {
    						pinned[k][key].push(data[k][i][subArray][j]["id"]);
    					}
    				}
    			}
    		}
    	}
    }
    console.log(pinned);
    // save as new resume
    let newResume = await setResume(userId, {name: name, fields: pinned});
    setResumes(prev => [...prev, newResume]);
    // reset state
    setName("");
    setPinning(false);
    return;
  }

  useEffect(() => {
  	const loadResumes = async () => {
	    // preload all resume versions
	  	let data = await fetchResumes(userId);

		  // create initial "default" resume for new users
		  if (!data || data.length === 0) {
		    let defaultResume = await setResume(userId, { name: "default", fields: {} });
		    console.log(defaultResume);
		    setResumes([defaultResume]);
		  } else {
		  	console.log(data);
		  	setResumes(data);
		  }
		}

		loadResumes();
  }, []);

  useEffect(() => {
  	if (resumes && resumes.length > 0) {
  		console.log(resumes);
  		// Select options = all of a user's saved resume versions
    	const arr = resumes.map(item => item.name).filter(item => item !== "default");
    	setOptions(arr);
    }
  }, [resumes]);

  return (
    <div className="flex flex-row justify-start items-center">
      <Select title={options.length > 0 ? "Load a Pinned Resumé..." : "No Pinned Resumés"} defaultValue={"default"} options={options} />
	  	<div>
	  		{pinning ? (
	  			<div className="flex flex-row items-center justify-start gap-0 mx-2">
	  			  <input
	            type="text"
	            value={name}
	            placeholder={"Name (e.g., 'ux designer')"}
	            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
	              setName(e.target.value);
	            }}
	            className="text-sm border p-1"
	          />
	  		  	<Button className="text-sm" variant="ghost" onClick={pinResume}>Save</Button>
	  		  </div>
	  		) : (
	  		  <Button className="text-sm" variant="ghost" onClick={togglePinning}><Pin size={20} />Pin this Resumé</Button>
	  		)}
	  	</div>
	  	<TextPopup content={infoText}>
        <Button className="p-0" variant="ghost"><Info size={20} /></Button>
      </TextPopup>
  	</div>
  )
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pin, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextPopup } from "@/components/ui/text-popup";
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

export function PinnedResumes({ userId }: { userId: string }): JSX.Element {
	const router = useRouter();
  const searchParams = useSearchParams();

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
		const defaultOrder = {
      "contactinfos": 0,
      "skills": 1,
      "roles": 2,
      "educations": 3
    };

		let pinned = {};
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
    			if (k === "roles" || k === "educations") {
    				let subArray = "roleitems";
    				if (k === "educations") {
    					subArray = "educationitems";
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
    // save as new resume
    let newResume = await setResume(userId, {name: name, fields: pinned});
    // setResumes(prev => [...prev, newResume]);
    // reset state
    setPinning(false);
    setName("");
    refreshData();
    return;
  }

  const loadPinnedResume = (value: string) => {
  	const params = new URLSearchParams(searchParams.toString());
    params.set('resume', value);
    router.push(`?${params.toString()}`);
    refreshData();
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
    <div className="flex flex-row justify-start items-center">
      <Select 
      	title={options.length > 0 ? "Load a Pinned Resumé..." : "No Pinned Resumés"} 
      	defaultValue={"default"} 
      	options={options} 
      	handleSetValue={loadPinnedResume}
      />
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

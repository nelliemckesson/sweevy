'use client';

import { useState } from 'react';
import { Pin } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function PinResumeButton(): JSX.Element {
	const [pinning, setPinning] = useState(false);
	const [name, setName] = useState("");

	const togglePinning = () => {
		setPinning(true);
	}

	const pinResume = () => {
    // prompt user to give it a name
    // fetch all resume data
    // for each section:
    // collect ids of included items
    // collect ids of included subitems
    // save
    setName("");
    setPinning(false);
    return;
  }

  return (
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
  )
}

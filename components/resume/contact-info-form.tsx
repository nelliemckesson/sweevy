'use client';

import { useState } from 'react';
import DraggableFields from "@/components/ui/draggable-fields";
import { setContactInfo } from "@/lib/db";

export default function ContactInfoForm(props) {
  return (
    <div className="flex-1 w-full flex flex-col">
      <DraggableFields fields={props.fields} />
    </div>
  );
}

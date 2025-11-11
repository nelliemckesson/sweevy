'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { ChildForm } from "@/components/resume/child-form";
import { setCustomSectionItem, deleteCustomSectionItem } from "@/app/actions/db";

export function CustomSectionItemsForm({ userId, fields, parent }: FormProps): JSX.Element {

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mt-0">
      <ChildForm
        fields={fields}
        userId={userId}
        newText="item"
        handleSaveItem={setCustomSectionItem}
        handleDeleteItem={deleteCustomSectionItem}
        parent={parent}
      />
    </div>
  );
}

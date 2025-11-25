'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { ParentForm } from "@/components/resume/parent-form";
import { CustomSectionItemsForm } from "@/components/resume/custom-section-items-form";
import { setCustomSection, deleteCustomSection } from "@/app/actions/db";

export function CustomSectionForm({ userId, fields }: FormProps): JSX.Element {

  return (
    <ParentForm
      fields={fields}
      userId={userId}
      newText={"item"}
      childKey="customsectionitems"
      SubItemsForm={CustomSectionItemsForm}
      handleSaveItem={setCustomSection}
      handleDeleteItem={deleteCustomSection}
    />
  );
}

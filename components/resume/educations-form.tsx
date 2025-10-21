'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { ParentForm } from "@/components/resume/parent-form";
import { EducationItemsForm } from "@/components/resume/education-items-form";
import { setEducation, deleteEducation } from "@/app/actions/db";

export function EducationsForm({ userId, fields }: FormProps): JSX.Element {

  return (
    <ParentForm
      fields={fields}
      userId={userId}
      newText={"education"}
      childKey="educationitems"
      SubItemsForm={EducationItemsForm}
      handleSaveItem={setEducation}
      handleDeleteItem={deleteEducation}
    />
  );
}

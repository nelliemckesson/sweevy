'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { SectionWithSubitemsForm } from "@/components/resume/section-with-subitems-form";
import { RoleItemsForm } from "@/components/resume/role-items-form";
import { setRole, deleteRole } from "@/app/actions/db";

export function RolesForm({ userId, fields }: FormProps): JSX.Element {

  return (
    <SectionWithSubitemsForm
      fields={fields}
      userId={userId}
      newText={"role"}
      SubItemsForm={RoleItemsForm}
      handleSaveItem={setRole}
      handleDeleteItem={deleteRole}
    />
  );
}

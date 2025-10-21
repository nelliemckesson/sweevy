'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { ParentForm } from "@/components/resume/parent-form";
import { RoleItemsForm } from "@/components/resume/role-items-form";
import { setRole, deleteRole } from "@/app/actions/db";

export function RolesForm({ userId, fields }: FormProps): JSX.Element {

  return (
    <ParentForm
      fields={fields}
      userId={userId}
      newText={"role"}
      childKey="roleitems"
      SubItemsForm={RoleItemsForm}
      handleSaveItem={setRole}
      handleDeleteItem={deleteRole}
    />
  );
}

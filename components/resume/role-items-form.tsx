'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Field, FormProps } from "@/lib/types";
import { ChildForm } from "@/components/resume/child-form";
import { setRoleItem, deleteRoleItem } from "@/app/actions/db";

export function RoleItemsForm({ userId, fields, parent }: FormProps): JSX.Element {

  return (
    <div className="flex-1 w-full flex flex-col gap-0 mt-4">
      <h3>Responsibilities</h3>
      <ChildForm
        fields={fields} 
        userId={userId}
        newText="responsibility" 
        handleSaveItem={setRoleItem}
        handleDeleteItem={deleteRoleItem}
        parent={parent} 
      />
    </div>
  );
}

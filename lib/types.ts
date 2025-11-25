import React from 'react';

export interface Field {
  id?: number;
  created_at?: string;
  label: string;
  value: string;
  position: number;
  include: boolean;
  fields?: Field[];
  children?: Field[];
  roleitems?: Field[];
  parent?: number;
  user?: string;
  changed?: boolean;
  classnames?: string[];
}

export interface ResumeField {
  id?: number;
  created_at?: string;
  name: string;
  positions?: string[];
  titles?: string[];
  fields?: object;
  classnames?: string[];
  user?: string;
}

export interface PersistedData {
  contactinfos: Field[];
  skills: Field[];
  roles: Field[];
  educations: Field[];
}

export interface SubSectionProps {
  userId: string;
  loadedResume?: ResumeField;
  handleMoveSectionUp?: (index: number) => void;
  handleMoveSectionDown?: (index: number) => void;
  handleSetPersistedData?: React.Dispatch<React.SetStateAction<PersistedData>>;
  handleUpdateResume?: (updatedResume: ResumeField) => void;
  persistedData?: any[];
  shouldLoadData?: boolean;
  index?: number;
  fieldsLength?: number;
}

export interface FormProps {
  userId: string;
  fields: Field[];
  parent?: number;
}

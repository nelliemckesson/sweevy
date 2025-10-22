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
}

export interface ResumeField {
  id?: number;
  created_at?: string;
  name: string;
  fields?: object;
  user?: string;
}

export interface ResumeSectionProps {
  userId: string;
  loadedResume?: string;
}

export interface FormProps {
  userId: string;
  fields: Field[];
  parent?: number;
}

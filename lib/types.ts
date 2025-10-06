export interface Field {
  id?: number;
  created_at?: string;
  label: string;
  value: string;
  position: number;
  include: boolean;
  user?: string;
}

export interface ResumeSectionProps {
  userId: string;
}

export interface FormProps {
  userId: string;
  fields: Field[];
}
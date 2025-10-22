'use server';

import { createClient } from '@/lib/supabase/server';
import { Field } from "@/lib/types";

// RESUMES

export async function fetchResumes(userId: string): Promise<ResumeField[] | null> {
  const supabase = await createClient();

  const { data: resumes, error } = await supabase
    .from('resumes')
    .select()
    .eq('user', userId);

  if (error && error.status !== 406) {
    console.error('Error fetching resumes:', error);
    return null;
  }

  return resumes?.sort((a, b) => a.name - b.name) ?? null;
}

export async function setResume(userId: string, fields: object): Promise<ResumeField | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resumes')
    .upsert({ ...fields, user: userId })
    .select()
    .single();

  if (error) {
    console.error('Error setting resume:', error);
    return null;
  }

  return data ?? null;
}

// CONTACT

export async function fetchContactInfo(userId: string): Promise<Field[] | null> {
  const supabase = await createClient();

  const { data: contactinfo, error } = await supabase
    .from('contactinfo')
    .select('fields')
    .eq('user', userId)
    .single();

  if (error && error.status !== 406) {
    console.error('Error fetching contact info:', error);
    return null;
  }

  return contactinfo?.fields.sort((a, b) => a.position - b.position) ?? null;
}

export async function setContactInfo(userId: string, fields: Field[]): Promise<Field[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contactinfo')
    .update({ fields })
    .eq('user', userId)
    .select();

  if (error) {
    console.error('Error setting contact info:', error);
    return null;
  }

  return data?.fields ?? null;
}

// SKILLS

export async function fetchSkills(userId: string): Promise<Field[] | null> {
  const supabase = await createClient();

  const { data: skills, error } = await supabase
    .from('skills')
    .select()
    .eq('user', userId);

  if (error && error.status !== 406) {
    console.error('Error fetching skills:', error);
    return null;
  }

  return skills?.sort((a, b) => a.position - b.position) ?? null;
}

export async function setSkill(userId: string, field: Field): Promise<Field | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('skills')
    .upsert({ ...field, user: userId })
    .select()
    .single();

  if (error) {
    console.error('Error setting skill:', error);
    return null;
  }

  return data ?? null;
}

export async function deleteSkill(userId: string, field: Field): Promise<boolean> {
  const supabase = await createClient();

  const response = await supabase
    .from('skills')
    .delete()
    .eq('id', field.id);

  if (response) {
    console.log(response);
    return true;
  }

  return false;
}

// ROLES

export async function fetchRoles(userId: string): Promise<Field[] | null> {
  const supabase = await createClient();

  const { data: roles, error } = await supabase
    .from('roles')
    .select(`
      *,
      roleitems (
        id, 
        value,
        include,
        position,
        parent
      )
    `)
    .eq('user', userId);

  if (error && error.status !== 406) {
    console.error('Error fetching roles:', error);
    return null;
  }

  return roles?.sort((a, b) => a.position - b.position) ?? null;
}

export async function setRole(userId: string, field: Field): Promise<Field | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('roles')
    .upsert({ ...field, user: userId })
    .select()
    .single();

  if (error) {
    console.error('Error setting roles:', error);
    return null;
  }

  return data ?? null;
}

export async function deleteRole(userId: string, field: Field): Promise<boolean> {
  const supabase = await createClient();

  const response = await supabase
    .from('roles')
    .delete()
    .eq('id', field.id);

  // also delete all role items

  if (response) {
    console.log(response);
    return true;
  }

  return false;
}

export async function setRoleItem(userId: string, field: Field): Promise<Field | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('roleitems')
    .upsert({ ...field, user: userId })
    .select()
    .single();

  if (error) {
    console.error('Error setting roles:', error);
    return null;
  }

  return data ?? null;
}

export async function deleteRoleItem(userId: string, field: Field): Promise<boolean> {
  const supabase = await createClient();

  const response = await supabase
    .from('roleitems')
    .delete()
    .eq('id', field.id);

  // also delete all role items

  if (response) {
    console.log(response);
    return true;
  }

  return false;
}

// EDUCATIONS

export async function fetchEducations(userId: string): Promise<Field[] | null> {
  const supabase = await createClient();

  const { data: roles, error } = await supabase
    .from('educations')
    .select(`
      *,
      educationitems (
        id, 
        value,
        include,
        position,
        parent
      )
    `)
    .eq('user', userId);

  if (error && error.status !== 406) {
    console.error('Error fetching educations:', error);
    return null;
  }

  return roles?.sort((a, b) => a.position - b.position) ?? null;
}

export async function setEducation(userId: string, field: Field): Promise<Field | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('educations')
    .upsert({ ...field, user: userId })
    .select()
    .single();

  if (error) {
    console.error('Error setting educations:', error);
    return null;
  }

  return data ?? null;
}

export async function deleteEducation(userId: string, field: Field): Promise<boolean> {
  const supabase = await createClient();

  const response = await supabase
    .from('educations')
    .delete()
    .eq('id', field.id);

  // also delete all role items

  if (response) {
    console.log(response);
    return true;
  }

  return false;
}

export async function setEducationItem(userId: string, field: Field): Promise<Field | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('educationitems')
    .upsert({ ...field, user: userId })
    .select()
    .single();

  if (error) {
    console.error('Error setting educationitems:', error);
    return null;
  }

  return data ?? null;
}

export async function deleteEducationItem(userId: string, field: Field): Promise<boolean> {
  const supabase = await createClient();

  const response = await supabase
    .from('educationitems')
    .delete()
    .eq('id', field.id);

  // also delete all role items

  if (response) {
    console.log(response);
    return true;
  }

  return false;
}

// GLOBAL

export async function fetchAllData(userId: string) {
  const [contactinfo, skills] = await Promise.all([
    fetchContactInfo(userId),
    fetchSkills(userId),
  ]);

  return {
    contactinfo,
    skills
  };
}

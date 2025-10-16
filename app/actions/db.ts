'use server';

import { createClient } from '@/lib/supabase/server';
import { Field } from "@/lib/types";

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
        position
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

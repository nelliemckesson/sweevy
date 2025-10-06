'use server';

import { redirect } from "next/navigation";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ContactField {
  label: string;
  value: string;
  position: number;
  include: boolean;
}

export interface GenericDatabaseField {
  id: number;
  created_at: string;
  label: string;
  value: string;
  position: number;
  include: boolean;
  user: string;
}

export async function fetchContactInfo(userId: string): Promise<ContactField[] | null> {
  const supabase = await createClient();
  
  let { data: contactinfo, error } = await supabase
    .from('contactinfo')
    .select('fields')
    .eq('user', userId)
    .single();

  if (error && error.status !== 406) {
    console.error('Error fetching contact info:', error);
    return null;
  }

  if (contactinfo) {
    // [{label: 'City', value: 'Portland, OR', position: 4, include: true}]
    return contactinfo.fields;
  }

  return null;
}

export async function setContactInfo(userId: string, fields: ContactField[]): Promise<ContactField[] | null> {
  const supabase = await createClient();
  
  let { data, error } = await supabase
    .from('contactinfo')
    .update({ fields: fields })
    .eq('user', userId)
    .select();

  if (error) {
    console.error('Error setting contact info:', error);
    return null;
  }

  if (data) {
    // [{label: 'City', value: 'Portland, OR', position: 4, include: true}]
    return data.fields;
  }

  return null;
}

export async function fetchSkills(userId: string): Promise<DatabaseField[] | null> {
  const supabase = await createClient();
  
  let { data: skills, error } = await supabase
    .from('skills')
    .select()
    .eq('user', userId);

  if (error && error.status !== 406) {
    console.error('Error fetching skills:', error);
    return null;
  }

  if (skills) {
    console.log(skills);
    // [{label: '', value: 'Photoshop', position: 4, include: true, user: uuid}]
    return skills;
  }

  return null;
}

export async function setSkill(userId: string, field: ContactField): Promise<DatabaseField | null> {
  const supabase = await createClient();
  
  let { data, error } = await supabase
    .from('skills')
    .upsert({ ...field, user: userId })
    .select();

  if (error) {
    console.error('Error setting skill:', error);
    return null;
  }

  if (data) {
    // [{label: '', value: 'Photoshop', position: 4, include: true, user: uuid}]
    console.log(data);
    return data;
  }

  return null;
}

export async function deleteSkill(userId: string, field: DatabaseField): Promise<boolean> {
  const supabase = await createClient();

  console.log(field);
  
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

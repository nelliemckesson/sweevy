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
    // [{label: 'City', value: 'Portland, OR', position: 4}]
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
    .select()

  if (error) {
    console.error('Error setting contact info:', error);
    return null;
  }

  if (data) {
    // [{label: 'City', value: 'Portland, OR', position: 4}]
    return data.fields;
  }

  return null;
}

'use server';

import { redirect } from "next/navigation";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function fetchContactInfo(userId: string) {
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
    console.log(contactinfo);
    return contactinfo;
  }

  return null;
}

export async function setContactInfo(userId: string, fields: object) {
  const supabase = await createClient();
  
  let { error } = await supabase.from('contactinfo').upsert({
    user: userId,
    fields: fields
  });

  if (error) {
    console.error('Error setting contact info:', error);
    return null;
  }

  revalidatePath('/protected');
  return true;
}

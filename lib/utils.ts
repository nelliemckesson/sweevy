import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Field, ResumeField } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function adjustData(data: Field[], loadedResume: ResumeField) {
  if (loadedResume.fields.hasOwnProperty("educations")) {
    let educations = loadedResume.fields.educations;
    for (let i=0; i<data.length; i++) {
      if (educations.hasOwnProperty(data[i].id)) {
        data[i].include = true;
        for (let j=0; j<data[i].educationitems.length; j++) {
          let item = data[i].educationitems[j];
          if (educations[data[i].id.toString()].indexOf(item.id) > -1)  {
            item.include = true;
          } else {
            item.include = false;
          }
        }
      } else {
        data[i].include = false;
        for (let j=0; j<data[i].educationitems.length; j++) {
          let item = data[i].educationitems[j];
          item.include = false;
        }
      };
    }
  }
  return data;
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Field, ResumeField } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function adjustData(data: Field[], loadedResume: ResumeField, field: string, subField: string) {
  if (loadedResume.fields.hasOwnProperty(field)) {
    let fields = loadedResume.fields[field];
    for (let i=0; i<data.length; i++) {
      if (fields.hasOwnProperty(data[i].id)) {
        data[i].include = true;
        for (let j=0; j<data[i][subField].length; j++) {
          let item = data[i][subField][j];
          if (fields[data[i].id.toString()].indexOf(item.id) > -1)  {
            item.include = true;
          } else {
            item.include = false;
          }
        }
      } else {
        data[i].include = false;
        for (let j=0; j<data[i][subField].length; j++) {
          let item = data[i][subField][j];
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

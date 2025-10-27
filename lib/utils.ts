import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Field, ResumeField } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// loadedResume:
// "fields": {
//  "contactinfos": {
//    2: {"position": 0},
//    5: {"position": 3}
//  },
//  "roles": {
//    1: {
//      "position": 0,
//      "subitems": {
//        3: {
//          "position": 0
//        },
//        6: {
//          "position": 2
//        }
//      }
//    }
//  }
// }

export function adjustData(data: Field[], loadedResume: ResumeField, field: string, subField: string) {
  if (loadedResume.fields.hasOwnProperty(field)) {
    let fields = loadedResume.fields[field];
    for (let i=0; i<data.length; i++) {
      if (fields.hasOwnProperty(data[i].id)) {
        data[i].include = true;
        data[i].position = fields[data[i].id.toString()].position;
        if (subField) {
          for (let j=0; j<data[i][subField].length; j++) {
            let item = data[i][subField][j];
            if (fields[data[i].id.toString()].subitems.hasOwnProperty(item.id)) {
              item.include = true;
              item.position = fields[data[i].id.toString()].subitems[item.id.toString()].position;
            } else {
              item.include = false;
            }
          }
        }
      } else {
        data[i].include = false;
        if (subField) {
          for (let j=0; j<data[i][subField].length; j++) {
            let item = data[i][subField][j];
            item.include = false;
          }
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

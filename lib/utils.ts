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

export function adjustData(data: Field[], loadedResume: ResumeField, field: string, subField: string | null) {
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

/**
 * Sanitizes a string by removing potentially harmful content while preserving safe HTML.
 * Protects against XSS attacks and other security vulnerabilities.
 *
 * @param input - The string to sanitize
 * @param allowHtml - Whether to allow safe HTML tags (default: true)
 * @returns The sanitized string
 */
export function sanitizeInput(input: string, allowHtml: boolean = true): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous HTML tags
  const dangerousTags = [
    'iframe', 'object', 'embed', 'applet', 'meta', 'link', 'style',
    'form', 'input', 'button', 'textarea', 'select', 'option',
    'base', 'frame', 'frameset'
  ];

  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
    // Also remove self-closing versions
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(selfClosingRegex, '');
  });

  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove vbscript: protocol
  sanitized = sanitized.replace(/vbscript:/gi, '');

  // Remove dangerous attributes
  const dangerousAttrs = ['formaction', 'action', 'poster', 'background'];
  dangerousAttrs.forEach(attr => {
    const regex = new RegExp(`\\s*${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // If HTML is not allowed, strip all remaining HTML tags
  if (!allowHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else {
    // Only allow safe tags (span, b, i, u, em, strong, br)
    // Remove any tags not in the safe list
    const safeTags = ['span', 'b', 'i', 'u', 'em', 'strong', 'br', 'p', 'div'];
    const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

    sanitized = sanitized.replace(tagRegex, (match, tagName) => {
      if (safeTags.includes(tagName.toLowerCase())) {
        return match;
      }
      return '';
    });
  }

  // Decode HTML entities to prevent double-encoding attacks
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Re-check for script tags after decoding (prevent encoding bypass)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validates and sanitizes form input data
 * @param data - Object containing form field values
 * @param allowHtml - Whether to allow safe HTML in values (default: false)
 * @returns Sanitized data object
 */
export function sanitizeFormData<T extends Record<string, any>>(
  data: T,
  allowHtml: boolean = false
): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, allowHtml);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeInput(item, allowHtml) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value, allowHtml);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

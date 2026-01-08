import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const PROPERTY_TYPES = [
    'APARTMENT', 'HOUSE', 'TOWNHOUSE', 'STUDIO',
    'COMMERCIAL', 'BEDSITTER', 'SINGLE_ROOM', 'OTHER'
]
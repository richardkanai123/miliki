/**
 * Form persistence utilities for better UX
 * Saves form data to localStorage to prevent data loss
 */

import { CreatePropertyInput } from '@/lib/schemas/NewPropertySchema';

const STORAGE_KEY = 'property-form-draft';
const STORAGE_EXPIRY_HOURS = 24; // Form data expires after 24 hours

interface FormDraftData {
  data: Partial<CreatePropertyInput>;
  timestamp: number;
  currentStep: number;
}

/**
 * Save form data to localStorage
 */
export function saveFormDraft(
  data: Partial<CreatePropertyInput>,
  currentStep: number
): void {
  try {
    const draftData: FormDraftData = {
      data,
      timestamp: Date.now(),
      currentStep,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
  } catch (error) {
    console.warn('Failed to save form draft:', error);
  }
}

/**
 * Load form data from localStorage
 */
export function loadFormDraft(): {
  data: Partial<CreatePropertyInput> | null;
  currentStep: number;
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { data: null, currentStep: 0 };
    }

    const draftData: FormDraftData = JSON.parse(stored);
    
    // Check if data has expired
    const isExpired = 
      Date.now() - draftData.timestamp > STORAGE_EXPIRY_HOURS * 60 * 60 * 1000;
    
    if (isExpired) {
      clearFormDraft();
      return { data: null, currentStep: 0 };
    }

    return {
      data: draftData.data,
      currentStep: draftData.currentStep,
    };
  } catch (error) {
    console.warn('Failed to load form draft:', error);
    return { data: null, currentStep: 0 };
  }
}

/**
 * Clear form draft from localStorage
 */
export function clearFormDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear form draft:', error);
  }
}

/**
 * Check if there's a saved form draft
 */
export function hasFormDraft(): boolean {
  const { data } = loadFormDraft();
  return data !== null && Object.keys(data).length > 0;
}

/**
 * Get the age of the form draft in minutes
 */
export function getFormDraftAge(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const draftData: FormDraftData = JSON.parse(stored);
    return Math.floor((Date.now() - draftData.timestamp) / (1000 * 60));
  } catch {
    return null;
  }
}

/**
 * Debounced save function for form auto-save
 */
let saveTimeout: NodeJS.Timeout | null = null;

export function debouncedSaveFormDraft(
  data: Partial<CreatePropertyInput>,
  currentStep: number,
  delay: number = 1000
): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    saveFormDraft(data, currentStep);
  }, delay);
}

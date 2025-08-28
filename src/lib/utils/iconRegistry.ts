/**
 * Consolidated icon registry for the entire application
 * This file serves as the single source of truth for all icons
 */

import React from 'react';
import {
  Car,
  Trees,
  Building,
  Waves,
  Dumbbell,
  Snowflake,
  Flame,
  Sofa,
  PawPrint,
  Cigarette,
  Accessibility,
  Shield,
  Wifi,
  Tv,
  WashingMachine,
  Archive,
  Bath,
  Bed,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Settings,
  FileText,
  Zap,
} from 'lucide-react';

// Consolidated icon definitions
export const ICONS = {
  // Navigation
  navigation: {
    previous: ChevronLeft,
    next: ChevronRight,
    submit: CheckCircle,
  },

  // Form steps
  steps: {
    basic: Home,
    location: MapPin,
    amenities: Settings,
    fees: FileText,
  },

  // Property details
  property: {
    bedrooms: Bed,
    bathrooms: Bath,
  },

  // Amenities - organized by category
  amenities: {
    comfort: {
      AC: { icon: Snowflake, label: 'Air Conditioning', description: 'Climate control system' },
      heating: { icon: Flame, label: 'Heating', description: 'Central or room heating' },
      furnished: { icon: Sofa, label: 'Furnished', description: 'Comes with furniture' },
      balcony: { icon: Building, label: 'Balcony', description: 'Private outdoor space' },
      fireplace: { icon: Zap, label: 'Fireplace', description: 'Indoor fireplace' },
    },
    facilities: {
      parking: { icon: Car, label: 'Parking', description: 'Dedicated parking space' },
      garden: { icon: Trees, label: 'Garden', description: 'Private or shared garden' },
      pool: { icon: Waves, label: 'Swimming Pool', description: 'Pool access' },
      gym: { icon: Dumbbell, label: 'Gym/Fitness Center', description: 'On-site fitness facilities' },
      laundry: { icon: WashingMachine, label: 'Laundry', description: 'Washing facilities' },
      storage: { icon: Archive, label: 'Storage Space', description: 'Additional storage area' },
    },
    policies: {
      petsAllowed: { icon: PawPrint, label: 'Pets Allowed', description: 'Pet-friendly property' },
      smokingAllowed: { icon: Cigarette, label: 'Smoking Allowed', description: 'Smoking permitted' },
      wheelchairAccessible: { icon: Accessibility, label: 'Wheelchair Accessible', description: 'Accessibility features' },
    },
    utilities: {
      internet: { icon: Wifi, label: 'Internet/WiFi', description: 'High-speed internet included' },
      cableTV: { icon: Tv, label: 'Cable TV', description: 'Cable or satellite TV' },
      securitySystem: { icon: Shield, label: 'Security System', description: 'Security cameras/alarm' },
    },
  },
} as const;

// Type definitions
export type NavigationIconKey = keyof typeof ICONS.navigation;
export type StepIconKey = keyof typeof ICONS.steps;
export type PropertyIconKey = keyof typeof ICONS.property;
export type AmenityCategory = keyof typeof ICONS.amenities;
export type AmenityKey<T extends AmenityCategory> = keyof typeof ICONS.amenities[T];

// Helper functions
export const getNavigationIcon = (key: NavigationIconKey) => ICONS.navigation[key];
export const getStepIcon = (key: StepIconKey) => ICONS.steps[key];
export const getPropertyIcon = (key: PropertyIconKey) => ICONS.property[key];

export const getAmenityIcon = <T extends AmenityCategory>(
  category: T,
  key: AmenityKey<T>
) => {
  const amenityData = ICONS.amenities[category][key as keyof typeof ICONS.amenities[T]];
  return (amenityData as any).icon;
};

export const getAmenityData = <T extends AmenityCategory>(
  category: T,
  key: AmenityKey<T>
) => {
  const amenityData = ICONS.amenities[category][key as keyof typeof ICONS.amenities[T]];
  return amenityData as any;
};

// Category labels for UI display
export const CATEGORY_LABELS = {
  comfort: "Comfort & Convenience",
  facilities: "Facilities & Recreation", 
  policies: "Policies & Accessibility",
  utilities: "Utilities & Technology",
} as const;

// Flattened amenities config for backward compatibility
export const getAllAmenities = () => {
  const amenities: Array<{
    name: string;
    label: string;
    description: string;
    icon: React.ComponentType;
    category: AmenityCategory;
  }> = [];

  Object.entries(ICONS.amenities).forEach(([category, categoryAmenities]) => {
    Object.entries(categoryAmenities).forEach(([name, data]) => {
      amenities.push({
        name,
        label: data.label,
        description: data.description,
        icon: data.icon,
        category: category as AmenityCategory,
      });
    });
  });

  return amenities;
};

// Icon wrapper component for consistent styling
export const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "muted" | "success" | "warning" | "destructive";
}> = ({
  children,
  className = "h-5 w-5",
  variant = "default"
}) => {
  const variantClasses = {
    default: "text-foreground",
    primary: "text-primary",
    muted: "text-muted-foreground",
    success: "text-green-600",
    warning: "text-amber-600",
    destructive: "text-red-600",
  };

  return React.createElement(
    'span',
    { className: `${variantClasses[variant]} ${className}` },
    children
  );
};

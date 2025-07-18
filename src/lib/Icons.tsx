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
  Accessibility as Wheelchair,
  Shield,
  Wifi,
  Tv,
  WashingMachine,
  Archive,
  Zap,
  Bath,
  Bed,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Settings,
  FileText,
} from 'lucide-react'

// Step Icons
export const stepIcons = {
  basic: Home,
  location: MapPin,
  amenities: Settings,
  fees: FileText,
} as const

// Navigation Icons
export const navigationIcons = {
  previous: ChevronLeft,
  next: ChevronRight,
  submit: CheckCircle,
} as const

// Property Detail Icons
export const propertyIcons = {
  bedrooms: Bed,
  bathrooms: Bath,
} as const

// Amenity Icons with labels
export const amenityIcons = {
  parking: {
    icon: Car,
    label: 'Parking',
    description: 'Dedicated parking space available'
  },
  garden: {
    icon: Trees,
    label: 'Garden',
    description: 'Private garden or green space'
  },
  balcony: {
    icon: Building,
    label: 'Balcony',
    description: 'Outdoor balcony or terrace'
  },
  pool: {
    icon: Waves,
    label: 'Swimming Pool',
    description: 'Access to swimming pool'
  },
  gym: {
    icon: Dumbbell,
    label: 'Gym',
    description: 'Fitness center or gym access'
  },
  AC: {
    icon: Snowflake,
    label: 'Air Conditioning',
    description: 'Climate control system'
  },
  heating: {
    icon: Flame,
    label: 'Heating',
    description: 'Central heating system'
  },
  furnished: {
    icon: Sofa,
    label: 'Furnished',
    description: 'Fully furnished property'
  },
  petsAllowed: {
    icon: PawPrint,
    label: 'Pets Allowed',
    description: 'Pet-friendly property'
  },
  smokingAllowed: {
    icon: Cigarette,
    label: 'Smoking Allowed',
    description: 'Smoking permitted'
  },
  wheelchairAccessible: {
    icon: Wheelchair,
    label: 'Wheelchair Accessible',
    description: 'Accessible for disabled persons'
  },
  securitySystem: {
    icon: Shield,
    label: 'Security System',
    description: 'Security cameras or alarm system'
  },
  internet: {
    icon: Wifi,
    label: 'Internet',
    description: 'High-speed internet connection'
  },
  cableTV: {
    icon: Tv,
    label: 'Cable TV',
    description: 'Cable or satellite TV'
  },
  laundry: {
    icon: WashingMachine,
    label: 'Laundry',
    description: 'Washing machine available'
  },
  storage: {
    icon: Archive,
    label: 'Storage',
    description: 'Additional storage space'
  },
  fireplace: {
    icon: Zap,
    label: 'Fireplace',
    description: 'Working fireplace'
  },
} as const

// Amenity Groups for organized display
export const amenityGroups = [
  {
    title: 'Parking & Outdoor',
    amenities: ['parking', 'garden', 'balcony', 'pool'] as const,
    color: 'green'
  },
  {
    title: 'Comfort & Climate',
    amenities: ['AC', 'heating', 'furnished', 'fireplace'] as const,
    color: 'blue'
  },
  {
    title: 'Policies & Accessibility',
    amenities: ['petsAllowed', 'smokingAllowed', 'wheelchairAccessible', 'securitySystem'] as const,
    color: 'purple'
  },
  {
    title: 'Technology & Services',
    amenities: ['internet', 'cableTV', 'laundry', 'storage'] as const,
    color: 'orange'
  },
  {
    title: 'Fitness & Recreation',
    amenities: ['gym'] as const,
    color: 'red'
  }
] as const

// Type definitions for better TypeScript support
export type StepIconKey = keyof typeof stepIcons
export type NavigationIconKey = keyof typeof navigationIcons
export type PropertyIconKey = keyof typeof propertyIcons
export type AmenityIconKey = keyof typeof amenityIcons
export type AmenityGroup = typeof amenityGroups[number]

// Helper function to get icon component
export const getStepIcon = (step: StepIconKey) => stepIcons[step]
export const getNavigationIcon = (nav: NavigationIconKey) => navigationIcons[nav]
export const getPropertyIcon = (property: PropertyIconKey) => propertyIcons[property]
export const getAmenityIcon = (amenity: AmenityIconKey) => amenityIcons[amenity].icon
export const getAmenityData = (amenity: AmenityIconKey) => amenityIcons[amenity]

// Icon wrapper component for consistent styling
export const IconWrapper = ({
  children,
  className = "h-5 w-5",
  variant = "default"
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "primary" | "muted" | "success" | "warning" | "destructive"
}) => {
  const variantClasses = {
    default: "text-foreground",
    primary: "text-primary",
    muted: "text-muted-foreground",
    success: "text-green-600",
    warning: "text-amber-600",
    destructive: "text-red-600",
  }

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
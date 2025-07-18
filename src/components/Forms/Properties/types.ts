import { UseFormReturn } from 'react-hook-form'
import { CreatePropertyInput } from '@/lib/schemas/NewPropertySchema'

// Base form props that all step components will use
export interface StepFormProps {
  form: UseFormReturn<CreatePropertyInput>
}

// Individual step props (extend if needed for specific steps)
export interface BasicInformationStepProps extends StepFormProps {}
export interface LocationStepProps extends StepFormProps {}
export interface AmenitiesStepProps extends StepFormProps {}
export interface NotesAndFeesStepProps extends StepFormProps {}

// Create typed field groups
type BasicFields = 'title' | 'description' | 'size' | 'status' | 'bedrooms' | 'bathrooms'
type LocationFields = 'location' | 'coordinates'
type AmenityFields = 'parking' | 'garden' | 'balcony' | 'pool' | 'gym' | 'AC' | 'heating' | 'furnished' | 'petsAllowed' | 'smokingAllowed' | 'wheelchairAccessible' | 'securitySystem' | 'internet' | 'cableTV' | 'laundry' | 'storage' | 'fireplace'
type FeeFields = 'notes' | 'cleaningFee' | 'serviceFee' | 'internetFee' | 'securityDeposit'

// Step configuration type
export interface Step {
  id: 'basic' | 'location' | 'amenities' | 'fees'
  title: string
  description: string
  iconKey: import('@/lib/Icons').StepIconKey
  fields: readonly (keyof CreatePropertyInput)[]
}

// Main form component props
export interface AddPropertyFormProps {
  onSubmit?: (values: CreatePropertyInput) => Promise<void>
  defaultValues?: Partial<CreatePropertyInput>
  className?: string
}

// Update steps with proper typing
const steps: readonly Step[] = [
    {
        id: 'basic' as const,
        title: 'Basic Information',
        description: 'Property details and specifications',
        iconKey: 'basic',
        fields: ['title', 'description', 'size', 'status', 'bedrooms', 'bathrooms'] as const satisfies readonly BasicFields[]
    },
    // ... other steps with similar typing
] as const
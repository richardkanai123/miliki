import { CreatePropertyInput } from "./schemas/NewPropertySchema";
import { getAllAmenities, CATEGORY_LABELS } from "./utils/iconRegistry";

// Re-export types and data from consolidated icon registry
export type AmenityConfig = {
    name: keyof Pick<
        CreatePropertyInput,
        | "parking"
        | "garden"
        | "balcony"
        | "pool"
        | "gym"
        | "AC"
        | "heating"
        | "furnished"
        | "petsAllowed"
        | "smokingAllowed"
        | "wheelchairAccessible"
        | "securitySystem"
        | "internet"
        | "cableTV"
        | "laundry"
        | "storage"
        | "fireplace"
    >;
    label: string;
    description: string;
    icon: React.ComponentType;
    category: "comfort" | "facilities" | "policies" | "utilities";
};

// Get amenities configuration from consolidated registry
export const amenitiesConfig: AmenityConfig[] = getAllAmenities() as AmenityConfig[];

// Re-export getAllAmenities for external use
export { getAllAmenities };

// Re-export category labels
export const categoryLabels = CATEGORY_LABELS;


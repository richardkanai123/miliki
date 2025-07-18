import {
    Snowflake,
    Flame,
    Sofa,
    Building,
    Car,
    Trees,
    Waves,
    Dumbbell,
    WashingMachine,
    Archive,
    PawPrint,
    Cigarette,
    Accessibility,
    Wifi,
    Tv,
    Shield,
} from "lucide-react";
import { CreatePropertyInput } from "./schemas/NewPropertySchema";

// Simplified amenities configuration
export interface AmenityConfig {
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
}

export const amenitiesConfig: AmenityConfig[] = [
    // Comfort & Convenience
    {
        name: "AC",
        label: "Air Conditioning",
        description: "Climate control system",
        icon: Snowflake,
        category: "comfort",
    },
    {
        name: "heating",
        label: "Heating",
        description: "Central or room heating",
        icon: Flame,
        category: "comfort",
    },
    {
        name: "furnished",
        label: "Furnished",
        description: "Comes with furniture",
        icon: Sofa,
        category: "comfort",
    },
    {
        name: "balcony",
        label: "Balcony",
        description: "Private outdoor space",
        icon: Building,
        category: "comfort",
    },
    {
        name: "fireplace",
        label: "Fireplace",
        description: "Indoor fireplace",
        icon: Flame,
        category: "comfort",
    },

    // Facilities
    {
        name: "parking",
        label: "Parking",
        description: "Dedicated parking space",
        icon: Car,
        category: "facilities",
    },
    {
        name: "garden",
        label: "Garden",
        description: "Private or shared garden",
        icon: Trees,
        category: "facilities",
    },
    {
        name: "pool",
        label: "Swimming Pool",
        description: "Pool access",
        icon: Waves,
        category: "facilities",
    },
    {
        name: "gym",
        label: "Gym/Fitness Center",
        description: "On-site fitness facilities",
        icon: Dumbbell,
        category: "facilities",
    },
    {
        name: "laundry",
        label: "Laundry",
        description: "Washing facilities",
        icon: WashingMachine,
        category: "facilities",
    },
    {
        name: "storage",
        label: "Storage Space",
        description: "Additional storage area",
        icon: Archive,
        category: "facilities",
    },

    // Policies
    {
        name: "petsAllowed",
        label: "Pets Allowed",
        description: "Pet-friendly property",
        icon: PawPrint,
        category: "policies",
    },
    {
        name: "smokingAllowed",
        label: "Smoking Allowed",
        description: "Smoking permitted",
        icon: Cigarette,
        category: "policies",
    },
    {
        name: "wheelchairAccessible",
        label: "Wheelchair Accessible",
        description: "Accessibility features",
        icon: Accessibility,
        category: "policies",
    },

    // Utilities & Tech
    {
        name: "internet",
        label: "Internet/WiFi",
        description: "High-speed internet included",
        icon: Wifi,
        category: "utilities",
    },
    {
        name: "cableTV",
        label: "Cable TV",
        description: "Cable or satellite TV",
        icon: Tv,
        category: "utilities",
    },
    {
        name: "securitySystem",
        label: "Security System",
        description: "Security cameras/alarm",
        icon: Shield,
        category: "utilities",
    },
];

export const categoryLabels = {
    comfort: "Comfort & Convenience",
    facilities: "Facilities & Recreation",
    policies: "Policies & Accessibility",
    utilities: "Utilities & Technology",
};


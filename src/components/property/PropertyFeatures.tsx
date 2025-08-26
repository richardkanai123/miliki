'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    Bath, Bed, Snowflake, Tv, Flame, Accessibility,
    Wifi, Car, Utensils, Shield, Waves
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PropertyFeaturesProps {
    property: {
        bedrooms: number;
        bathrooms: number;
        AC: boolean;
        cableTV: boolean;
        heating: boolean;
        wheelchairAccessible: boolean;
        internet: boolean;
        parking: boolean;
        furnished: boolean;
        securitySystem: boolean;
        pool: boolean;
    };
    variant?: 'compact' | 'detailed';
    maxFeatures?: number;
    showMore?: boolean;
}

const PropertyFeatures = ({
    property,
    variant = 'compact',
    maxFeatures = 8,
    showMore = true
}: PropertyFeaturesProps) => {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

    const {
        bedrooms, bathrooms, AC, cableTV, heating,
        wheelchairAccessible, internet, parking,
        furnished, securitySystem, pool
    } = property;

    // Memoized feature mapping for better performance
    const allFeatures = React.useMemo(() => [
        {
            condition: bedrooms > 0,
            icon: Bed,
            label: `${bedrooms} Bedroom${bedrooms > 1 ? 's' : ''}`,
            shortLabel: "Beds",
            color: 'text-blue-700 dark:text-blue-300',
            bgColor: 'bg-blue-50 dark:bg-blue-500/10',
            hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-500/20',
            showCount: true
        },
        {
            condition: bathrooms > 0,
            icon: Bath,
            label: `${bathrooms} Bathroom${bathrooms > 1 ? 's' : ''}`,
            shortLabel: "Baths",
            color: 'text-cyan-700 dark:text-cyan-300',
            bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
            hoverBg: 'hover:bg-cyan-100 dark:hover:bg-cyan-500/20',
            showCount: true
        },
        {
            condition: AC,
            icon: Snowflake,
            label: 'Air Conditioning',
            shortLabel: 'AC',
            color: 'text-sky-700 dark:text-sky-300',
            bgColor: 'bg-sky-50 dark:bg-sky-500/10',
            hoverBg: 'hover:bg-sky-100 dark:hover:bg-sky-500/20',
            showCount: false
        },
        {
            condition: heating,
            icon: Flame,
            label: 'Heating',
            shortLabel: 'Heat',
            color: 'text-orange-700 dark:text-orange-300',
            bgColor: 'bg-orange-50 dark:bg-orange-500/10',
            hoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-500/20',
            showCount: false
        },
        {
            condition: cableTV,
            icon: Tv,
            label: 'Cable TV',
            shortLabel: 'TV',
            color: 'text-purple-700 dark:text-purple-300',
            bgColor: 'bg-purple-50 dark:bg-purple-500/10',
            hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-500/20',
            showCount: false
        },
        {
            condition: internet,
            icon: Wifi,
            label: 'Wi-Fi',
            shortLabel: 'WiFi',
            color: 'text-green-700 dark:text-green-300',
            bgColor: 'bg-green-50 dark:bg-green-500/10',
            hoverBg: 'hover:bg-green-100 dark:hover:bg-green-500/20',
            showCount: false
        },
        {
            condition: parking,
            icon: Car,
            label: 'Parking',
            shortLabel: 'Park',
            color: 'text-gray-700 dark:text-gray-300',
            bgColor: 'bg-gray-50 dark:bg-gray-500/10',
            hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-500/20',
            showCount: false
        },
        {
            condition: furnished,
            icon: Utensils,
            label: 'Fully Furnished',
            shortLabel: 'Furnished',
            color: 'text-amber-700 dark:text-amber-300',
            bgColor: 'bg-amber-50 dark:bg-amber-500/10',
            hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-500/20',
            showCount: false
        },
        {
            condition: securitySystem,
            icon: Shield,
            label: 'Security System',
            shortLabel: 'Security',
            color: 'text-red-700 dark:text-red-300',
            bgColor: 'bg-red-50 dark:bg-red-500/10',
            hoverBg: 'hover:bg-red-100 dark:hover:bg-red-500/20',
            showCount: false
        },
        {
            condition: pool,
            icon: Waves,
            label: 'Swimming Pool',
            shortLabel: 'Pool',
            color: 'text-blue-700 dark:text-blue-300',
            bgColor: 'bg-blue-50 dark:bg-blue-500/10',
            hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-500/20',
            showCount: false
        },
        {
            condition: wheelchairAccessible,
            icon: Accessibility,
            label: 'Wheelchair Accessible',
            shortLabel: 'Access',
            color: 'text-indigo-700 dark:text-indigo-300',
            bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
            hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-500/20',
            showCount: false
        },
    ].filter(feature => feature.condition), [bedrooms, bathrooms, AC, cableTV, heating, wheelchairAccessible, internet, parking, furnished, securitySystem, pool]);

    const visibleFeatures = allFeatures.slice(0, maxFeatures);
    const remainingCount = Math.max(0, allFeatures.length - maxFeatures);

    const handleFeatureInteraction = useCallback((featureLabel: string) => {
        setSelectedFeature(prev => prev === featureLabel ? null : featureLabel);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, featureLabel: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFeatureInteraction(featureLabel);
        }
    }, [handleFeatureInteraction]);

    if (variant === 'compact') {
        return (
            <div className="h-fit space-y-2" role="group" aria-label="Property features">
                <div className="grid grid-cols-4 gap-2">
                    {visibleFeatures.map((feature, index) => {
                        const isSelected = selectedFeature === feature.label;

                        return (
                            <motion.div
                                key={feature.label}
                                className={`
                                    relative flex flex-col items-center justify-center p-2 rounded-md 
                                    ${feature.bgColor} ${feature.hoverBg}
                                    transition-all duration-300 group/feature cursor-pointer
                                    border border-transparent hover:border-current/20
                                    focus:border-current/40 focus:ring-2 focus:ring-current/20
                                    aspect-square overflow-hidden
                                    ${isSelected ? 'ring-2 ring-current/30' : ''}
                                `}
                                role="button"
                                tabIndex={0}
                                aria-label={feature.label}
                                aria-pressed={isSelected}
                                onClick={() => handleFeatureInteraction(feature.label)}
                                onKeyDown={(e) => handleKeyDown(e, feature.label)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03, duration: 0.2 }}
                            >
                                {/* Icon - visible by default, hidden on hover/selection */}
                                <div className={`
                                    ${isSelected ? 'opacity-0 scale-50' : 'group-hover/feature:opacity-0 group-hover/feature:scale-50'} 
                                    transition-all duration-300 flex flex-col items-center justify-center h-full
                                `}>
                                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                                    {feature.showCount && (
                                        <span className={`text-xs font-bold ${feature.color} mt-0.5 leading-none`}>
                                            {feature.shortLabel}
                                        </span>
                                    )}
                                </div>

                                {/* Label - hidden by default, visible on hover/selection */}
                                <div className={`
                                    absolute inset-0 flex items-center justify-center
                                    ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover/feature:opacity-100 group-hover/feature:scale-100'}
                                    transition-all duration-300 p-1
                                `}>
                                    <span className={`
                                        text-xs font-bold ${feature.color} text-center leading-tight
                                        line-clamp-2 overflow-hidden
                                    `}>
                                        {feature.showCount ? feature.label : feature.shortLabel}
                                    </span>
                                </div>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-current rounded-full opacity-60" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {showMore && remainingCount > 0 && (
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: visibleFeatures.length * 0.03 + 0.2 }}
                    >
                        <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 px-2 py-0.5"
                        >
                            +{remainingCount}
                        </Badge>
                    </motion.div>
                )}
            </div>
        );
    }

    // Detailed variant - unchanged but with consistent sizing
    return (
        <div className="h-fit space-y-3" role="group" aria-label="Property features">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {visibleFeatures.map((feature, index) => (
                    <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className={`
                            flex items-center gap-3 p-3 rounded-lg 
                            ${feature.bgColor} ${feature.hoverBg}
                            transition-all duration-200 group/feature cursor-pointer
                            border border-transparent hover:border-current/20
                            focus:border-current/40 focus:ring-2 focus:ring-current/20
                        `}
                        role="button"
                        tabIndex={0}
                        aria-label={feature.label}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`
                            p-2 rounded-md ${feature.bgColor} 
                            group-hover/feature:scale-110 transition-transform duration-200
                        `}>
                            <feature.icon className={`w-4 h-4 ${feature.color}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                            {feature.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            {showMore && remainingCount > 0 && (
                <motion.div
                    className="text-center pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: visibleFeatures.length * 0.05 + 0.2 }}
                >
                    <Badge
                        variant="secondary"
                        className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 px-3 py-1"
                    >
                        +{remainingCount} more features
                    </Badge>
                </motion.div>
            )}
        </div>
    );
};

export default PropertyFeatures;
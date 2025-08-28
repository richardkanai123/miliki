'use client'

import { Property } from '@/generated/prisma'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import {
    MapPin,
    Bed,
    Bath,
    Wifi,
    Car,
    Waves,
    Dumbbell,
    Edit,
    Home,
    EyeIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'



interface PropertyLinkProps {
    property: Property;
}

const PropertyLink = ({ property }: PropertyLinkProps) => {
    const {
        id,
        title,
        location,
        status,
        bedrooms,
        bathrooms,
        size,
        internet,
        parking,
        pool,
        gym,
        furnished,
    } = property;

    const statusVariants = {
        AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        BOOKED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        UNAVAILABLE: 'bg-muted text-muted-foreground'
    };

    // Get key amenities for display
    const keyAmenities = [
        { icon: Wifi, available: internet, label: 'WiFi' },
        { icon: Car, available: parking, label: 'Parking' },
        { icon: Waves, available: pool, label: 'Pool' },
        { icon: Dumbbell, available: gym, label: 'Gym' },
        { icon: Home, available: furnished, label: 'Furnished' }
    ].filter(amenity => amenity.available);

    return (
        <Card className="w-full h-full min-w-[280px] min-h-[320px] flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
            <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <Link href={`/dashboard/properties/${id}`}>
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200 truncate cursor-pointer">
                                {title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-2">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground truncate">{location}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-sm">
                                {size.replace('_', ' ')}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-sm font-medium",
                                    statusVariants[status as keyof typeof statusVariants] || statusVariants.AVAILABLE
                                )}
                            >
                                {status}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-5 flex-1">
                    {/* Property Details */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-6 text-base text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Bed className="w-5 h-5" />
                                <span className="font-medium">{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bath className="w-5 h-5" />
                                <span className="font-medium">{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    {keyAmenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {keyAmenities.slice(0, 4).map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-md">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{label}</span>
                                </div>
                            ))}
                            {keyAmenities.length > 4 && (
                                <div className="flex items-center px-3 py-1.5 bg-muted/50 rounded-md">
                                    <span className="text-sm text-muted-foreground">+{keyAmenities.length - 4}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 pt-5 mt-auto border-t border-border/50">
                    <Link href={`/dashboard/properties/${id}`} className="flex-1">
                        <Button variant="outline" size="default" className="w-full justify-center">
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View
                        </Button>
                    </Link>
                    <Link href={`/dashboard/properties/${id}/edit`} className="flex-1">
                        <Button variant="outline" size="default" className="w-full justify-center">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default PropertyLink;
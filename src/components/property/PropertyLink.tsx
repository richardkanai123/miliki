'use client'

import { Property } from '@/generated/prisma'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import {
    MapPin,
    ArrowRight,
    Bed,
    Bath
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
        bathrooms
    } = property;

    const statusVariants = {
        AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        BOOKED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        UNAVAILABLE: 'bg-muted text-muted-foreground'
    };

    return (
        <Link href={`/dashboard/properties/${id}`} className="block w-full max-w-sm">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group"
            >
                <Card className="overflow-hidden group-hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
                    <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                    {title}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground truncate">{location}</span>
                                </div>
                            </div>

                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-xs font-medium shrink-0",
                                    statusVariants[status as keyof typeof statusVariants] || statusVariants.AVAILABLE
                                )}
                            >
                                {status}
                            </Badge>
                        </div>

                        {/* Key Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Bed className="w-4 h-4" />
                                    <span>{bedrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bath className="w-4 h-4" />
                                    <span>{bathrooms}</span>
                                </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
};

export default PropertyLink;
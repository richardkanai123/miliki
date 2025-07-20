'use client'

import { Property } from '@/generated/prisma'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import PropertyFeatures from './PropertyFeatures'
import Image from 'next/image'
import { Button } from '../ui/button'

interface PropertyLinkProps {
    property: Property;
}

const PropertyLink = ({ property }: PropertyLinkProps) => {
    const {
        id,
        title,
        description,
        location,
        status,
        createdAt
    } = property;

    const statusColors = {
        AVAILABLE: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        OCCUPIED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        UNAVAILABLE: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-sm mx-auto hover:shadow-lg transition-all duration-300"
        >
            <div
                className="block h-full no-underline hover:no-underline"
            >
                <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm group flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Header Image Section - Fixed Height */}
                        <div className="relative h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 overflow-hidden flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 dark:from-blue-800/30 dark:to-purple-800/30" />
                            <Image
                                src="/android-chrome-512x512.png"
                                alt="Property Image"
                                fill
                                priority
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="absolute inset-0 w-full h-full object-cover object-center opacity-10"
                            />

                            {/* Status Badge Overlay */}
                            <div className="absolute top-2 right-2">
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium backdrop-blur-sm ${statusColors[status as keyof typeof statusColors] || statusColors.AVAILABLE}`}
                                >
                                    {status}
                                </Badge>
                            </div>
                        </div>

                        {/* Content Section - Flex grow to fill remaining space */}
                        <div className="flex-1 flex flex-col min-h-0"> {/* min-h-0 allows shrinking */}
                            {/* Header - Fixed Height */}
                            <div className="px-2 flex-shrink-0">
                                <h3 className="font-semibold text-lg leading-tight transition-colors duration-200 line-clamp-2 overflow-hidden">
                                    {title}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="line-clamp-1">{location}</span>
                                </div>
                            </div>

                            {/* Description - Fixed Height */}
                            <div className="px-2 mt-2 flex-shrink-0">
                                <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed h-8 overflow-hidden">
                                    {description.slice(0, 70)}{description.length > 70 ? '...' : ''}
                                </p>
                            </div>

                            {/* Features Section - Use remaining space but with overflow handling */}
                            <div className="px-2 flex-1 flex flex-col justify-center">
                                <PropertyFeatures
                                    property={property}
                                    variant="compact" // Use compact for card view
                                    maxFeatures={8} // Limit features to fit
                                    showMore={true}
                                />
                            </div>

                            {/* Footer - Fixed at bottom */}
                            <div className="px-3 py-2 border-t ">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <span className="font-medium">Created:</span>
                                        <Calendar className="w-2.5 h-2.5" />
                                        <span className="text-xs">{new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>

                                    <motion.div
                                        className="flex items-center gap-1 text-xs font-medium"
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button variant="default" className="flex items-center gap-1" asChild>
                                            <Link href={`/dashboard/properties/${id}`} className="flex items-center px-2 gap-1 no-underline ">
                                                <span className='no-underline'>View Details</span>
                                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                                            </Link>
                                        </Button>

                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default PropertyLink;
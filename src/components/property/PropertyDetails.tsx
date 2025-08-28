'use client'

import React from 'react'
import { Property } from '@/generated/prisma'
import { motion } from 'framer-motion'
import {
    MapPin,
    Calendar,
    DollarSign,
    FileText,
    Clock,
    Edit,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/currency'
import { getPropertyIcon, getStepIcon } from '@/lib/Icons'
import { getAllAmenities } from '@/lib/AmenetiesUtils'
import {
    BasicInfoEditDialog,
    AmenitiesEditDialog,
    PoliciesEditDialog,
    FeesEditDialog
} from './EditDialogs'
import NotesEditDialog from './EditDialogs/NotesEditDialog'
import { Button } from '../ui/button'
import Link from 'next/link'
import DeletePropertyBtn from './DeletePropertyBtn'

interface PropertyDetailsProps {
    property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
    const {
        title,
        description,
        location,
        status,
        bedrooms,
        bathrooms,
        cleaningFee,
        serviceFee,
        internetFee,
        securityDeposit,
        size,
        petsAllowed,
        smokingAllowed,
        pool,
        parking,
        laundry,
        internet,
        securitySystem,
        wheelchairAccessible,
        storage,
        notes,
        coordinates,
        balcony,
        AC,
        cableTV,
        fireplace,
        createdAt,
        updatedAt,
        furnished,
        garden,
        gym,
        heating,
        id
    } = property

    const statusVariants = {
        AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
        BOOKED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        UNAVAILABLE: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    };

    // Get all available amenities with their icons from the consolidated system
    const allAmenitiesWithIcons = getAllAmenities();

    // Create a mapping for quick icon lookup
    const iconMap = allAmenitiesWithIcons.reduce((acc: Record<string, React.ComponentType>, amenity) => {
        acc[amenity.name] = amenity.icon;
        return acc;
    }, {} as Record<string, React.ComponentType>);

    // Basic property info
    const basicInfo = [
        { icon: getStepIcon('basic'), label: 'Property Type', value: size.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) },
        { icon: getPropertyIcon('bedrooms'), label: 'Bedrooms', value: bedrooms.toString() },
        { icon: getPropertyIcon('bathrooms'), label: 'Bathrooms', value: bathrooms.toString() },
        { icon: MapPin, label: 'Location', value: location },
    ];

    // Amenities with icons from the consolidated system
    const amenities = [
        { icon: iconMap.internet, label: 'Internet/WiFi', available: internet },
        { icon: iconMap.parking, label: 'Parking', available: parking },
        { icon: iconMap.pool, label: 'Swimming Pool', available: pool },
        { icon: iconMap.gym, label: 'Gym', available: gym },
        { icon: iconMap.AC, label: 'Air Conditioning', available: AC },
        { icon: iconMap.heating, label: 'Heating', available: heating },
        { icon: iconMap.furnished, label: 'Furnished', available: furnished },
        { icon: iconMap.balcony, label: 'Balcony', available: balcony },
        { icon: iconMap.garden, label: 'Garden', available: garden },
        { icon: iconMap.laundry, label: 'Laundry', available: laundry },
        { icon: iconMap.storage, label: 'Storage', available: storage },
        { icon: iconMap.cableTV, label: 'Cable TV', available: cableTV },
        { icon: iconMap.securitySystem, label: 'Security System', available: securitySystem },
        { icon: iconMap.fireplace, label: 'Fireplace', available: fireplace },
        { icon: iconMap.wheelchairAccessible, label: 'Wheelchair Accessible', available: wheelchairAccessible },
    ].filter(amenity => amenity.available && amenity.icon);

    // Policies with icons from the consolidated system
    const policies = [
        { icon: iconMap.petsAllowed, label: 'Pets Allowed', available: petsAllowed },
        { icon: iconMap.smokingAllowed, label: 'Smoking Allowed', available: smokingAllowed },
    ].filter(policy => policy.available && policy.icon);

    // Fees (only show non-zero fees)
    const fees = [
        { label: 'Cleaning Fee', amount: cleaningFee },
        { label: 'Service Fee', amount: serviceFee },
        { label: 'Internet Fee', amount: internetFee },
        { label: 'Security Deposit', amount: securityDeposit },
    ].filter(fee => fee.amount > 0);

    const containerMotion = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };



    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerMotion}
            className="w-full space-y-2"
        >
            {/* Header Section */}

            <div className="flex items-start justify-between px-4">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {title}
                    </h2>
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="size-3 mr-1" />
                        <span className='text-xs'>
                            {location}
                        </span>
                        {coordinates && (
                            <span className="text-xs opacity-70">({coordinates})</span>
                        )}
                    </div>
                </div>

                <div className='self-end flex flex-col md:flex-row items-center gap-2'>
                    <Badge
                        variant="outline"
                        className={cn("text-sm font-medium", statusVariants[status as keyof typeof statusVariants])}
                    >
                        {status}
                    </Badge>
                    <Button variant="outline" size="default">
                        <Link className='flex items-center gap-2' href={`/dashboard/properties/${id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                    </Button>

                    <DeletePropertyBtn propertyId={id} propertyTitle={title} />
                </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{description}</p>

            {/* Basic Information */}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {React.createElement(getStepIcon('basic'), { className: "w-5 h-5" })}
                            Basic Information
                        </CardTitle>
                        <BasicInfoEditDialog property={property} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {basicInfo.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-md bg-primary/10">
                                    {React.createElement(Icon, { className: "w-4 h-4 text-primary" })}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{label}</p>
                                    <p className="text-sm text-muted-foreground">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>


            {/* Amenities */}
            {
                amenities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    {React.createElement(getStepIcon('amenities'), { className: "w-5 h-5" })}
                                    Amenities & Features
                                </CardTitle>
                                <AmenitiesEditDialog property={property} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {amenities.map(({ icon: Icon, label }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
                                    >
                                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/20">
                                            {Icon && React.createElement(Icon as any, { className: "w-3.5 h-3.5 text-green-600 dark:text-green-400" })}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            {/* Policies */}
            {
                policies.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Policies
                                </CardTitle>
                                <PoliciesEditDialog property={property} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {policies.map(({ icon: Icon, label }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50"
                                    >
                                        <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/20">
                                            {Icon && React.createElement(Icon as any, { className: "w-3.5 h-3.5 text-blue-600 dark:text-blue-400" })}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            {/* Fees */}
            {
                fees.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Fees & Deposits
                                </CardTitle>
                                <FeesEditDialog property={property} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {fees.map(({ label, amount }) => (
                                    <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm font-medium text-foreground">{label}</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {formatCurrency(amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            {/* Additional Notes */}
            {
                notes && (

                    <Card>
                        <CardHeader >
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Additional Notes
                                </CardTitle>

                                <NotesEditDialog property={property} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {notes}
                            </p>
                        </CardContent>
                    </Card>
                )
            }

            {/* Metadata */}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Property Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <span className="text-muted-foreground">Created:</span>
                                <span className="ml-2 font-medium">
                                    {new Date(createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span className="ml-2 font-medium">
                                    {new Date(updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    );
};

export default PropertyDetails
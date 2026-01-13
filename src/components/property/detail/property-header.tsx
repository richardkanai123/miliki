'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    MapPin,
    Building2,
    User,
    Calendar,
    Pencil,
    ChevronLeft,
    Settings
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/format'
import type { PropertyDetails } from '@/lib/dal/properties/get-property-details'


interface PropertyHeaderProps {
    property: NonNullable<PropertyDetails>
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
    const typeLabel = property.type.charAt(0) + property.type.slice(1).toLowerCase().replace('_', ' ')

    return (
        <div className="space-y-4">
            {/* Back navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                    <Link href={`/org/${property.organization.slug}/properties`}>
                        <ChevronLeft className="h-4 w-4" />
                        Back to Properties
                    </Link>
                </Button>
            </div>

            {/* Header content */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    {/* Property name and status */}
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {property.name}
                        </h1>
                        <Badge variant={property.isActive ? 'default' : 'secondary'}>
                            {property.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    {/* Property metadata */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{typeLabel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{property.address}, {property.city}, {property.county}</span>
                        </div>
                        {property.manager && (
                            <div className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                <span>Managed by {property.manager.user.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Created {formatDate(property.createdAt)}</span>
                        </div>
                    </div>

                    {/* Description */}
                    {property.description && (
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            {property.description}
                        </p>
                    )}

                    {/* Amenities */}
                    {property.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {property.amenities.map(({ amenity }) => (
                                <Badge key={amenity.id} variant="outline" className="text-xs">
                                    {amenity.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/org/${property.organization.slug}/properties/${property.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

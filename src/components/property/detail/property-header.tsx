'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    MapPin,
    Building2,
    Calendar,
    Pencil,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    UserIcon
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/format'
import type { PropertyDetails } from '@/lib/dal/properties/get-property-details'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface PropertyHeaderProps {
    property: NonNullable<PropertyDetails>
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
    const typeLabel = property.type.charAt(0) + property.type.slice(1).toLowerCase().replace('_', ' ')

    // Get initials for manager fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
    }

    return (
        <div className="space-y-6">
            {/* Navigation & Actions Bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                    <Link href={`/org/${property.organization.slug}/properties`}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Properties
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/org/${property.organization.slug}/properties/${property.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Property
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Main Header Content */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4 flex-1">
                        {/* Title & Status */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {property.name}
                                </h1>
                                <Badge
                                    variant={property.isActive ? 'default' : 'secondary'}
                                    className="h-6 px-2 gap-1"
                                >
                                    {property.isActive ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-3 w-3" />
                                            Inactive
                                        </>
                                    )}
                                </Badge>
                            </div>

                            {/* Primary Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4" />
                                    <span>{typeLabel}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{property.address}, {property.city}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>Added {formatDate(property.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {property.description && (
                            <p className="text-muted-foreground max-w-3xl leading-relaxed">
                                {property.description}
                            </p>
                        )}
                    </div>

                    {/* Manager Card - Right Side on Desktop */}
                    <div className="w-full md:w-72 shrink-0">
                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Property Manager
                            </h3>
                            {property.manager ? (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={property.manager.user.image || undefined} alt={property.manager.user.name} />
                                        <AvatarFallback>{getInitials(property.manager.user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium truncate">
                                            {property.manager.user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {property.manager.user.email}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-muted-foreground py-1">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-dashed">
                                        <UserIcon className="h-5 w-5 opacity-50" />
                                    </div>
                                    <span className="text-sm">No manager assigned</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                {property.amenities.length > 0 && (
                    <div className="pt-2">
                        <h3 className="text-sm font-medium mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {property.amenities.map(({ amenity }) => (
                                <Badge
                                    key={amenity.id}
                                    variant="secondary"
                                    className="px-3 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors"
                                >
                                    {amenity.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Separator />
        </div>
    )
}


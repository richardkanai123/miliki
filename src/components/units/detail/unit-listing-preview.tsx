'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bed, Bath, Maximize2, Banknote, Eye, EyeOff, ImageIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { UnitDetails } from '@/lib/dal/units/get-unit'
import Image from 'next/image'

interface UnitListingPreviewProps {
    unit: NonNullable<UnitDetails>
}

export function UnitListingPreview({ unit }: UnitListingPreviewProps) {
    // Use listing fields if available, otherwise fallback to unit fields
    const displayTitle = unit.listingTitle || unit.title
    const displayDescription = unit.listingDescription || unit.description

    const hasCustomListing = unit.listingTitle || unit.listingDescription
    const primaryImage = unit.images?.[0]

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Listing Preview
                    </CardTitle>
                    <Badge variant={unit.isListed ? 'default' : 'secondary'}>
                        {unit.isListed ? (
                            <>
                                <Eye className="h-3 w-3 mr-1" />
                                Listed
                            </>
                        ) : (
                            <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Not Listed
                            </>
                        )}
                    </Badge>
                </div>
                {hasCustomListing && (
                    <p className="text-xs text-muted-foreground">
                        Using custom listing content
                    </p>
                )}
            </CardHeader>
            <CardContent>
                {/* Preview Card */}
                <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                    {/* Image Section */}
                    <div className="relative h-48 bg-muted">
                        {primaryImage ? (
                            <Image
                                src={primaryImage}
                                alt={displayTitle}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <div className="text-center">
                                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No image available</p>
                                </div>
                            </div>
                        )}
                        {/* Status Badge on Image */}
                        <div className="absolute top-3 left-3">
                            <Badge
                                variant={unit.status === 'VACANT' ? 'default' : 'secondary'}
                                className={unit.status === 'VACANT' ? 'bg-emerald-600' : ''}
                            >
                                {unit.status === 'VACANT' ? 'Available' : unit.status.charAt(0) + unit.status.slice(1).toLowerCase()}
                            </Badge>
                        </div>
                        {/* Price Badge on Image */}
                        <div className="absolute bottom-3 right-3">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground font-semibold">
                                <Banknote className="h-3 w-3 mr-1" />
                                {formatCurrency(unit.rentAmount)}/mo
                            </Badge>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                        {/* Title */}
                        <h3 className="font-semibold text-lg line-clamp-1">
                            {displayTitle}
                        </h3>

                        {/* Property Name */}
                        <p className="text-sm text-muted-foreground">
                            {unit.property.name}
                            {unit.locationInProperty && ` • ${unit.locationInProperty}`}
                        </p>

                        {/* Description */}
                        {displayDescription && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {displayDescription}
                            </p>
                        )}

                        {/* Features */}
                        <div className="flex items-center gap-4 pt-2 border-t">
                            <div className="flex items-center gap-1.5 text-sm">
                                <Bed className="h-4 w-4 text-muted-foreground" />
                                <span>{unit.bedrooms} {unit.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                                <Bath className="h-4 w-4 text-muted-foreground" />
                                <span>{unit.bathrooms} {unit.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                            </div>
                            {unit.squareMeters && (
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{unit.squareMeters} m²</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info about listing status */}
                {!unit.isListed && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        This unit is not currently visible to potential tenants
                    </p>
                )}
                {unit.isListed && unit.listedAt && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        Listed since {new Date(unit.listedAt).toLocaleDateString()}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

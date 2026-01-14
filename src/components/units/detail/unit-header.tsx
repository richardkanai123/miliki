'use client'

import { Badge } from '@/components/ui/badge'
import {
    MapPin,
    DoorOpen,
    CheckCircle2,
    Building2,
    Banknote
} from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { UnitDetails } from '@/lib/dal/units/get-unit'
import { Separator } from '@/components/ui/separator'

interface UnitHeaderProps {
    unit: NonNullable<UnitDetails>
}

export function UnitHeader({ unit }: UnitHeaderProps) {
    // Format status for display
    const statusLabel = unit.status.charAt(0) + unit.status.slice(1).toLowerCase().replace('_', ' ')

    // Determine status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'OCCUPIED': return 'default'
            case 'VACANT': return 'secondary'
            case 'MAINTENANCE': return 'destructive'
            case 'RESERVED': return 'outline'
            default: return 'outline'
        }
    }

    return (
        <div className="space-y-4">
            {/* Main Header Content */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4 flex-1">
                        {/* Title & Status */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {unit.title}
                                </h1>
                                <Badge
                                    variant={getStatusVariant(unit.status)}
                                    className="h-6 px-2 gap-1"
                                >
                                    {unit.status === 'OCCUPIED' ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                        <DoorOpen className="h-3 w-3" />
                                    )}
                                    {statusLabel}
                                </Badge>
                                {unit.isListed && (
                                    <Badge variant="outline" className="h-6 px-2">
                                        Listed
                                    </Badge>
                                )}
                            </div>

                            {/* Primary Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4" />
                                    <span>{unit.property.name}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1.5">
                                    <Banknote className="h-4 w-4" />
                                    <span>{formatCurrency(unit.rentAmount)} / month</span>
                                </div>
                                {unit.locationInProperty && (
                                    <>
                                        <Separator orientation="vertical" className="h-4" />
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            <span>{unit.locationInProperty}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {unit.description && (
                            <p className="text-muted-foreground max-w-3xl leading-relaxed">
                                {unit.description}
                            </p>
                        )}

                        {/* Unit Features */}
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                <span className="font-medium">{unit.bedrooms}</span> Bedrooms
                            </div>
                            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                <span className="font-medium">{unit.bathrooms}</span> Bathrooms
                            </div>
                            {unit.squareMeters && (
                                <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                    <span className="font-medium">{unit.squareMeters}</span> Square Meters
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Separator />
        </div>
    )
}

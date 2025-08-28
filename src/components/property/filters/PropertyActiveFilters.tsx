'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

interface PropertyActiveFiltersProps {
    searchQuery: string
    statusFilter: string
    sizeFilter: string
    hasActiveFilters: boolean
    className?: string
}

const PropertyActiveFilters = ({
    searchQuery,
    statusFilter,
    sizeFilter,
    hasActiveFilters,
    className = ""
}: PropertyActiveFiltersProps) => {
    if (!hasActiveFilters) return null

    return (
        <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t ${className}`}>
            {searchQuery && (
                <Badge variant="secondary">
                    Search: "{searchQuery}"
                </Badge>
            )}
            {statusFilter !== 'all' && (
                <Badge variant="secondary">
                    Status: {statusFilter}
                </Badge>
            )}
            {sizeFilter !== 'all' && (
                <Badge variant="secondary">
                    Type: {sizeFilter.replace('_', ' ')}
                </Badge>
            )}
        </div>
    )
}

export default PropertyActiveFilters

'use client'

import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface PropertyFiltersProps {
    statusFilter: string
    sizeFilter: string
    uniqueStatuses: string[]
    uniqueSizes: string[]
    onStatusChange: (value: string) => void
    onSizeChange: (value: string) => void
    className?: string
}

const PropertyFilters = ({
    statusFilter,
    sizeFilter,
    uniqueStatuses,
    uniqueSizes,
    onStatusChange,
    onSizeChange,
    className = ""
}: PropertyFiltersProps) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Size Filter */}
            <Select value={sizeFilter} onValueChange={onSizeChange}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueSizes.map(size => (
                        <SelectItem key={size} value={size}>
                            {size.replace('_', ' ')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default PropertyFilters

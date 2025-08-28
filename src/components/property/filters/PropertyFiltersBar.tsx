'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PropertySearchInput from './PropertySearchInput'
import PropertyFilters from './PropertyFilters'
import PropertySortDropdown, { SortOption, SortDirection } from './PropertySortDropdown'
import PropertyActiveFilters from './PropertyActiveFilters'

interface PropertyFiltersBarProps {
    // Search
    searchQuery: string
    onSearchChange: (value: string) => void
    showSearch: boolean

    // Filters
    statusFilter: string
    sizeFilter: string
    uniqueStatuses: string[]
    uniqueSizes: string[]
    onStatusChange: (value: string) => void
    onSizeChange: (value: string) => void
    showFilters: boolean

    // Sort
    sortBy: SortOption
    sortDirection: SortDirection
    onSortChange: (sortBy: SortOption, direction: SortDirection) => void

    // Clear filters
    hasActiveFilters: boolean
    onClearFilters: () => void

    className?: string
}

const PropertyFiltersBar = ({
    searchQuery,
    onSearchChange,
    showSearch,
    statusFilter,
    sizeFilter,
    uniqueStatuses,
    uniqueSizes,
    onStatusChange,
    onSizeChange,
    showFilters,
    sortBy,
    sortDirection,
    onSortChange,
    hasActiveFilters,
    onClearFilters,
}: PropertyFiltersBarProps) => {
    if (!showSearch && !showFilters) return null

    return (
        <Card className="sticky top-10 left-0 w-full rounded-none">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    {showSearch && (
                        <PropertySearchInput
                            value={searchQuery}
                            onChange={onSearchChange}
                        />
                    )}

                    {/* Filters and Sort */}
                    {showFilters && (
                        <div className="flex flex-wrap gap-2">
                            <PropertyFilters
                                statusFilter={statusFilter}
                                sizeFilter={sizeFilter}
                                uniqueStatuses={uniqueStatuses}
                                uniqueSizes={uniqueSizes}
                                onStatusChange={onStatusChange}
                                onSizeChange={onSizeChange}
                            />

                            <PropertySortDropdown
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                onSortChange={onSortChange}
                            />

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClearFilters}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4 mr-1" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Active Filters */}
                <PropertyActiveFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    sizeFilter={sizeFilter}
                    hasActiveFilters={hasActiveFilters}
                />
            </CardContent>
        </Card>
    )
}

export default PropertyFiltersBar

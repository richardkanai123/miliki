'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Property } from '@/generated/prisma'
import PropertyFiltersBar from './filters/PropertyFiltersBar'
import PropertyEmptyState from './PropertyEmptyState'
import PropertyGrid from './PropertyGrid'
import { usePropertyFilters } from './hooks/usePropertyFilters'

interface PropertiesListerProps {
    properties: Property[]
    showSearch?: boolean
    showFilters?: boolean
    emptyStateMessage?: string
    className?: string
}

const PropertiesLister = ({
    properties,
    showSearch = true,
    showFilters = true,
    emptyStateMessage = "No properties found.",
    className = ""
}: PropertiesListerProps) => {
    const {
        searchQuery,
        statusFilter,
        sizeFilter,
        sortBy,
        sortDirection,
        setSearchQuery,
        setStatusFilter,
        setSizeFilter,
        uniqueStatuses,
        uniqueSizes,
        filteredAndSortedProperties,
        hasActiveFilters,
        clearAllFilters,
        handleSortChange,
    } = usePropertyFilters({ properties })

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Filters Bar */}
            <PropertyFiltersBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearch={showSearch}
                statusFilter={statusFilter}
                sizeFilter={sizeFilter}
                uniqueStatuses={uniqueStatuses}
                uniqueSizes={uniqueSizes}
                onStatusChange={setStatusFilter}
                onSizeChange={setSizeFilter}
                showFilters={showFilters}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
            />

            {/* Properties Grid/List */}
            <AnimatePresence mode="wait">
                {filteredAndSortedProperties.length === 0 ? (
                    <PropertyEmptyState
                        hasActiveFilters={hasActiveFilters}
                        emptyStateMessage={emptyStateMessage}
                        onClearFilters={clearAllFilters}
                    />
                ) : (
                    <PropertyGrid properties={filteredAndSortedProperties} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default PropertiesLister

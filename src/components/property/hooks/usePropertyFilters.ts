'use client'

import { useState, useMemo } from 'react'
import { Property } from '@/generated/prisma'

export type SortOption = 'title' | 'status' | 'bedrooms' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

interface UsePropertyFiltersProps {
    properties: Property[]
}

export const usePropertyFilters = ({ properties }: UsePropertyFiltersProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sizeFilter, setSizeFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<SortOption>('title')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    // Get unique statuses and sizes for filters
    const uniqueStatuses = useMemo(() =>
        [...new Set(properties.map(p => p.status))], [properties]
    )

    const uniqueSizes = useMemo(() =>
        [...new Set(properties.map(p => p.size))], [properties]
    )

    // Filter and sort properties
    const filteredAndSortedProperties = useMemo(() => {
        let filtered = properties.filter(property => {
            const matchesSearch = searchQuery === '' ||
                property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === 'all' || property.status === statusFilter
            const matchesSize = sizeFilter === 'all' || property.size === sizeFilter

            return matchesSearch && matchesStatus && matchesSize
        })

        // Sort properties
        filtered.sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title)
                    break
                case 'status':
                    comparison = a.status.localeCompare(b.status)
                    break
                case 'bedrooms':
                    comparison = a.bedrooms - b.bedrooms
                    break
                case 'createdAt':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    break
                default:
                    comparison = 0
            }

            return sortDirection === 'asc' ? comparison : -comparison
        })

        return filtered
    }, [properties, searchQuery, statusFilter, sizeFilter, sortBy, sortDirection])

    const clearAllFilters = () => {
        setSearchQuery('')
        setStatusFilter('all')
        setSizeFilter('all')
        setSortBy('title')
        setSortDirection('asc')
    }

    const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || sizeFilter !== 'all'

    const handleSortChange = (newSortBy: SortOption, newDirection: SortDirection) => {
        setSortBy(newSortBy)
        setSortDirection(newDirection)
    }

    return {
        // State
        searchQuery,
        statusFilter,
        sizeFilter,
        sortBy,
        sortDirection,
        
        // Setters
        setSearchQuery,
        setStatusFilter,
        setSizeFilter,
        setSortBy,
        setSortDirection,
        
        // Computed
        uniqueStatuses,
        uniqueSizes,
        filteredAndSortedProperties,
        hasActiveFilters,
        
        // Actions
        clearAllFilters,
        handleSortChange,
    }
}

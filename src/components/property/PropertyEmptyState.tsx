'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PropertyEmptyStateProps {
    hasActiveFilters: boolean
    emptyStateMessage: string
    onClearFilters: () => void
    className?: string
}

const PropertyEmptyState = ({
    hasActiveFilters,
    emptyStateMessage,
    onClearFilters,
    className = ""
}: PropertyEmptyStateProps) => {
    return (
        <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-center py-12 ${className}`}
        >
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                {hasActiveFilters ? (
                    <Search className="w-8 h-8 text-muted-foreground" />
                ) : (
                    <Home className="w-8 h-8 text-muted-foreground" />
                )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {hasActiveFilters ? 'No properties match your filters' : emptyStateMessage}
            </h3>
            <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                    ? 'Try adjusting your search or filter criteria'
                    : 'Properties will appear here once they are added.'
                }
            </p>
            {hasActiveFilters && (
                <Button variant="outline" onClick={onClearFilters}>
                    Clear All Filters
                </Button>
            )}
        </motion.div>
    )
}

export default PropertyEmptyState

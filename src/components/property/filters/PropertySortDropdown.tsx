'use client'

import React from 'react'
import { SortAsc, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type SortOption = 'title' | 'status' | 'bedrooms' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

interface PropertySortDropdownProps {
    sortBy: SortOption
    sortDirection: SortDirection
    onSortChange: (sortBy: SortOption, direction: SortDirection) => void
    className?: string
}

const PropertySortDropdown = ({
    sortBy,
    sortDirection,
    onSortChange,
    className = ""
}: PropertySortDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={className}>
                    {sortDirection === 'asc' ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                    Sort
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSortChange('title', 'asc')}>
                    Title A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('title', 'desc')}>
                    Title Z-A
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSortChange('bedrooms', 'asc')}>
                    Bedrooms Low-High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('bedrooms', 'desc')}>
                    Bedrooms High-Low
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSortChange('createdAt', 'desc')}>
                    Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('createdAt', 'asc')}>
                    Oldest First
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PropertySortDropdown

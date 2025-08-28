'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface PropertySearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

const PropertySearchInput = ({
    value,
    onChange,
    placeholder = "Search properties by title or location...",
    className = ""
}: PropertySearchInputProps) => {
    return (
        <div className={`relative flex-1 ${className}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10"
            />
        </div>
    )
}

export default PropertySearchInput

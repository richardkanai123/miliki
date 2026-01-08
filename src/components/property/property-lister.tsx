'use client'

import { use, useMemo, useCallback, useState, useEffect, useDeferredValue } from 'react'
import type { Property } from '@/app/_generated/prisma/client/client'
import PropertyCard from './property-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation'
import { PROPERTY_TYPES } from '@/lib/utils'

interface PropertiesReturn {
    message: string,
    success: boolean,
    properties: Property[] | null
}

interface PropertiesListerProps {
    propertiesPromise: Promise<PropertiesReturn>
}

const PropertiesLister = ({ propertiesPromise }: PropertiesListerProps) => {
    const { properties: initialProperties, message, success } = use(propertiesPromise)
    const params = useParams()
    const slug = params?.slug as string
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Read values from URL
    const searchFromUrl = searchParams.get('q') ?? ''
    const typeFromUrl = searchParams.get('type') ?? 'ALL'

    // Local state for immediate input feedback
    const [searchInput, setSearchInput] = useState(searchFromUrl)

    // Deferred value for smooth filtering during typing
    const deferredSearch = useDeferredValue(searchInput)

    // Sync local state when URL changes (back/forward navigation)
    useEffect(() => {
        setSearchInput(searchFromUrl)
    }, [searchFromUrl])

    // Update URL params helper
    const updateParams = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'ALL' && value !== '') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        const queryString = params.toString()
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
    }, [searchParams, pathname, router])

    // Debounced URL update when deferred search changes
    useEffect(() => {
        if (deferredSearch === searchFromUrl) return
        const timeout = setTimeout(() => {
            updateParams('q', deferredSearch)
        }, 200)
        return () => clearTimeout(timeout)
    }, [deferredSearch, searchFromUrl, updateParams])

    // Handle type filter change (immediate)
    const handleTypeChange = (value: string) => {
        updateParams('type', value)
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchInput('')
        router.replace(pathname, { scroll: false })
    }

    const filteredProperties = useMemo(() => {
        if (!initialProperties) return []

        const lowerSearch = deferredSearch.toLowerCase().trim()

        return initialProperties.filter(property => {
            // Search logic
            const matchesSearch = !lowerSearch ||
                property.name.toLowerCase().includes(lowerSearch) ||
                property.address.toLowerCase().includes(lowerSearch) ||
                property.city.toLowerCase().includes(lowerSearch)

            // Filter logic
            const matchesType = typeFromUrl === "ALL" || property.type === typeFromUrl

            return matchesSearch && matchesType
        })
    }, [initialProperties, deferredSearch, typeFromUrl])

    if (!success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-red-50 border-red-100 text-red-600">
                <p>{message}</p>
            </div>
        )
    }

    if (!initialProperties || initialProperties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/30">
                <div className="p-4 rounded-full bg-muted mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No properties yet</h3>
                <p className="text-muted-foreground max-w-sm mt-1 mb-6">
                    Get started by adding your first property to this organization.
                </p>
                <Button asChild>
                    <Link href={`/org/${slug}/properties/create`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Property
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search properties..."
                            className="pl-9 bg-background"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <Select value={typeFromUrl} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-background">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type === "ALL" ? "All Types" : type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Add Button */}
                <Button asChild className="w-full sm:w-auto shrink-0">
                    <Link href={`/org/${slug}/properties/create`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                    </Link>
                </Button>
            </div>

            {/* Results Grid */}
            {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10">
                    <div className="p-3 rounded-full bg-muted/50 mb-3">
                        <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-md font-medium">No matches found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button
                        variant="link"
                        onClick={clearFilters}
                        className="mt-2 text-primary"
                    >
                        Clear filters
                    </Button>
                </div>
            )}
        </div>
    )
}

export default PropertiesLister

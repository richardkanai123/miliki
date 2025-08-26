'use client'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useCallback, useEffect, useState, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const GlobarSearch = () => {
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Debounced search function
    const debouncedSearch = useCallback((value: string) => {
        setIsLoading(true)

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())

            if (value.trim()) {
                params.set('search', value.trim())
            } else {
                params.delete('search')
            }

            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
            router.push(newUrl)
            setIsLoading(false)
        }, 500)
    }, [pathname, router, searchParams])

    // Handle input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearch(value)
        debouncedSearch(value)
    }

    // Open search bar
    const handleOpen = () => {
        setIsOpen(true)
        // Focus input after animation completes
        setTimeout(() => {
            inputRef.current?.focus()
        }, 300)
    }

    // Close search bar
    const handleClose = () => {
        setIsOpen(false)
        setSearch('')
        // Clear search params when closing
        const params = new URLSearchParams(searchParams.toString())
        params.delete('search')
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
        router.push(newUrl)
    }

    // Handle escape key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose()
        }
    }

    // Initialize search value from URL params
    useEffect(() => {
        const searchValue = searchParams.get('search')
        if (searchValue) {
            setSearch(searchValue)
            setIsOpen(true)
        }
    }, [searchParams])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [])

    return (
        <div className="flex items-center gap-4 flex-1 justify-center">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    // Minimized state - just the search icon
                    <motion.div
                        key="minimized"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleOpen}
                            className="h-9 w-9 p-0 hover:bg-muted/50"
                            aria-label="Open search"
                        >
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </motion.div>
                ) : (
                    // Expanded state - full search bar
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative w-full max-w-md"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                value={search}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                                placeholder="Search properties, guests, bookings..."
                                className={cn(
                                    "pl-10 pr-10 h-9 bg-background border border-border",
                                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                                    "transition-all duration-200"
                                )}
                                autoComplete="off"
                            />

                            {/* Loading spinner or close button */}
                            <div className="absolute right-1 top-1 h-7 w-7 flex items-center justify-center">
                                {isLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </motion.div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClose}
                                        className="h-7 w-7 p-0 hover:bg-muted/50"
                                        aria-label="Close search"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default GlobarSearch
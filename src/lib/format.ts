/**
 * Format a number as Kenyan Shillings (KES)
 * Handles numbers, Decimal objects, and serialized Decimal-like objects
 */
export function formatCurrency(amount: number | { toNumber?: () => number } | null | undefined): string {
    if (amount === null || amount === undefined) return 'KES 0'
    
    let numValue: number
    
    if (typeof amount === 'number') {
        numValue = amount
    } else if (typeof amount === 'object' && typeof amount.toNumber === 'function') {
        // Handle Prisma Decimal objects
        numValue = amount.toNumber()
    } else if (typeof amount === 'object' && 'd' in amount && 'e' in amount && 's' in amount) {
        // Handle serialized Decimal objects (they have d, e, s properties)
        // Fall back to parsing or treating as 0
        numValue = Number(amount) || 0
    } else {
        numValue = Number(amount) || 0
    }
    
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numValue)
}

/**
 * Format a date with various formats
 */
export function formatDate(date: Date | string | null | undefined, format: 'short' | 'medium' | 'long' = 'medium'): string {
    if (!date) return '-'
    
    const d = new Date(date)
    
    switch (format) {
        case 'short':
            return new Intl.DateTimeFormat('en-KE', {
                day: 'numeric',
                month: 'short',
            }).format(d)
        case 'medium':
            return new Intl.DateTimeFormat('en-KE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }).format(d)
        case 'long':
            return new Intl.DateTimeFormat('en-KE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(d)
    }
}

/**
 * Format a percentage
 */
export function formatPercent(value: number): string {
    return `${value}%`
}

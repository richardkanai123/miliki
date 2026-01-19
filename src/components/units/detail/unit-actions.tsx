'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UnitActionsProps {
    slug: string
    propertyId: string
    unitId: string
}

export function UnitActions({ slug, propertyId, unitId }: UnitActionsProps) {
    return (
        <div className="flex items-center justify-end">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/org/${slug}/properties/${propertyId}/units/${unitId}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Unit
                </Link>
            </Button>
        </div>
    )
}

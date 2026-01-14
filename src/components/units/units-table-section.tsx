import { getUnitsByProperty } from '@/lib/dal/units/get-units-by-property'
import { UnitsDataTable } from './units-data-table'

interface UnitsTableSectionProps {
    propertyId: string
    slug: string
}

export async function UnitsTableSection({ propertyId, slug }: UnitsTableSectionProps) {
    const result = await getUnitsByProperty(propertyId)

    if (!result.success || !result.units) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">{result.message}</p>
            </div>
        )
    }

    return (
        <UnitsDataTable
            data={result.units}
            propertyId={propertyId}
            slug={slug}
        />
    )
}

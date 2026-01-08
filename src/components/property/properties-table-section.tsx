import { getPropertiesByOrg } from '@/lib/dal/properties/get-properties-by-orgid'
import { PropertiesDataTable } from './properties-data-table'

interface PropertiesTableSectionProps {
    slug: string
}

export async function PropertiesTableSection({ slug }: PropertiesTableSectionProps) {
    const result = await getPropertiesByOrg({ slug })

    if (!result.success || !result.properties) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">{result.message}</p>
            </div>
        )
    }

    return (
        <PropertiesDataTable
            data={result.properties}
            slug={slug}
        />
    )
}

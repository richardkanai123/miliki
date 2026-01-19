import { getTenanciesByOrg } from '@/lib/dal/tenancies/get-tenancies-by-org'
import { TenanciesDataTable } from './tenancies-data-table'

interface TenanciesTableSectionProps {
    slug: string
}

export async function TenanciesTableSection({ slug }: TenanciesTableSectionProps) {
    const result = await getTenanciesByOrg(slug)

    if (!result.success || !result.tenancies) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">{result.message}</p>
            </div>
        )
    }

    return (
        <TenanciesDataTable
            data={result.tenancies}
            slug={slug}
        />
    )
}

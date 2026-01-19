import { getUnitTenancies } from "@/lib/dal/units/get-unit-tenancies"
import { getUnitInvoices } from "@/lib/dal/units/get-unit-invoices"
import { getUnitPayments } from "@/lib/dal/units/get-unit-payments"
import { UnitTabsSection } from '../unit-tabs-section'

interface UnitDataSectionProps {
    unitId: string
}

// Data section with tabs - fetches in parallel
export async function UnitDataSection({ unitId }: UnitDataSectionProps) {
    // Fetch all data in parallel for optimal performance
    const [tenanciesResult, invoicesResult, paymentsResult] = await Promise.all([
        getUnitTenancies(unitId),
        getUnitInvoices(unitId),
        getUnitPayments(unitId),
    ])

    return (
        <UnitTabsSection
            tenancies={tenanciesResult.tenancies}
            invoices={invoicesResult.invoices}
            payments={paymentsResult.payments}
        />
    )
}

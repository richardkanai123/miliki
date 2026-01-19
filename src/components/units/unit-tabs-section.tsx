'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Users, FileText, Wallet } from 'lucide-react'
import { TenanciesTable } from '@/components/property/detail/tenancies-table'
import { InvoicesTable } from '@/components/property/detail/invoices-table'
import { PaymentsTable } from '@/components/property/detail/payments-table'
import type { UnitTenancy } from '@/lib/dal/units/get-unit-tenancies'
import type { UnitInvoice } from '@/lib/dal/units/get-unit-invoices'
import type { UnitPayment } from '@/lib/dal/units/get-unit-payments'
// Import Property types to cast if needed, or rely on structural compatibility
import type { PropertyTenancy } from '@/lib/dal/properties/get-property-tenancies'
import type { PropertyInvoice } from '@/lib/dal/properties/get-property-invoices'
import type { PropertyPayment } from '@/lib/dal/properties/get-property-payments'

interface UnitTabsSectionProps {
    tenancies: UnitTenancy[]
    invoices: UnitInvoice[]
    payments: UnitPayment[]
}

export function UnitTabsSection({
    tenancies,
    invoices,
    payments,
}: UnitTabsSectionProps) {
    const tenanciesCount = tenancies?.filter(t => t.status === 'ACTIVE').length ?? 0
    const invoicesCount = invoices?.filter(i => ['PENDING', 'PARTIAL', 'OVERDUE'].includes(i.status)).length ?? 0
    const paymentsCount = payments?.filter(p => p.status === 'COMPLETED').length ?? 0

    return (
        <Card>
            <Tabs defaultValue="tenancies">
                <CardHeader className="pb-0">
                    <TabsList variant="line">
                        <TabsTrigger value="tenancies" className="gap-1.5">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Tenancies</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">
                                {tenanciesCount}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="invoices" className="gap-1.5">
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Invoices</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">
                                {invoicesCount}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="gap-1.5">
                            <Wallet className="h-4 w-4" />
                            <span className="hidden sm:inline">Payments</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">
                                {paymentsCount}
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent className="pt-4">
                    <TabsContent value="tenancies" className="m-0">
                        <TenanciesTable tenancies={tenancies as unknown as PropertyTenancy[]} />
                    </TabsContent>

                    <TabsContent value="invoices" className="m-0">
                        <InvoicesTable invoices={invoices as unknown as PropertyInvoice[]} />
                    </TabsContent>

                    <TabsContent value="payments" className="m-0">
                        <PaymentsTable payments={payments as unknown as PropertyPayment[]} />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}

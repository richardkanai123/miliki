'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DoorOpen, Users, FileText, Wallet } from 'lucide-react'
import { UnitsTable } from './detail/units-table'
import { TenanciesTable } from './detail/tenancies-table'
import { InvoicesTable } from './detail/invoices-table'
import { PaymentsTable } from './detail/payments-table'
import type { PropertyDetails } from '@/lib/dal/properties/get-property-details'
import type { PropertyTenancy } from '@/lib/dal/properties/get-property-tenancies'
import type { PropertyInvoice } from '@/lib/dal/properties/get-property-invoices'
import type { PropertyPayment } from '@/lib/dal/properties/get-property-payments'

interface PropertyTabsSectionProps {
    units: NonNullable<PropertyDetails>['units']
    tenancies: PropertyTenancy[]
    invoices: PropertyInvoice[]
    payments: PropertyPayment[]
    propertyId: string
    slug: string
}

export function PropertyTabsSection({
    units,
    tenancies,
    invoices,
    payments,
    propertyId,
    slug,
}: PropertyTabsSectionProps) {
    // Calculate counts directly - no need for useMemo as these are simple calculations
    const unitsCount = units?.length ?? 0
    const tenanciesCount = tenancies?.filter(t => t.status === 'ACTIVE').length ?? 0
    const invoicesCount = invoices?.filter(i => ['PENDING', 'PARTIAL', 'OVERDUE'].includes(i.status)).length ?? 0
    const paymentsCount = payments?.filter(p => p.status === 'COMPLETED').length ?? 0

    return (
        <Card>
            <Tabs defaultValue="units">
                <CardHeader className="pb-0">
                    <TabsList variant="line">
                        <TabsTrigger value="units" className="gap-1.5">
                            <DoorOpen className="h-4 w-4" />
                            <span className="hidden sm:inline">Units</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">
                                {unitsCount}
                            </span>
                        </TabsTrigger>
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
                    <TabsContent value="units" className="m-0">
                        <UnitsTable
                            units={units ?? []}
                            propertyId={propertyId}
                            slug={slug}
                        />
                    </TabsContent>

                    <TabsContent value="tenancies" className="m-0">
                        <TenanciesTable tenancies={tenancies ?? []} />
                    </TabsContent>

                    <TabsContent value="invoices" className="m-0">
                        <InvoicesTable invoices={invoices ?? []} />
                    </TabsContent>

                    <TabsContent value="payments" className="m-0">
                        <PaymentsTable payments={payments ?? []} />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}

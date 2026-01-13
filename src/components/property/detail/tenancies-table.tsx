'use client'

import { useMemo, useState } from 'react'
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Users } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import type { PropertyTenancy } from '@/lib/dal/properties/get-property-tenancies'

interface TenanciesTableProps {
    tenancies: PropertyTenancy[]
}

const statusConfig: Record<string, { label: string; variant: 'outline' | 'secondary' | 'default' | 'destructive'; className: string }> = {
    PENDING: { label: 'Pending', variant: 'outline', className: 'border-amber-500 text-amber-600' },
    ACTIVE: { label: 'Active', variant: 'default', className: '' },
    EXPIRED: { label: 'Expired', variant: 'secondary', className: '' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive', className: '' },
    RENEWED: { label: 'Renewed', variant: 'outline', className: 'border-emerald-500 text-emerald-600' },
}

const columns: ColumnDef<PropertyTenancy>[] = [
    {
        accessorKey: 'unit',
        header: 'Unit',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.unit?.title ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'tenant',
        header: 'Tenant',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.tenant?.user?.name ?? '-'}</span>
                <span className="text-[10px] text-muted-foreground">{row.original.tenant?.user?.email ?? ''}</span>
            </div>
        ),
    },
    {
        accessorKey: 'monthlyRent',
        header: 'Rent',
        cell: ({ row }) => (
            <span className="tabular-nums">{formatCurrency(row.original.monthlyRent)}</span>
        ),
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{formatDate(row.original.startDate, 'short')}</span>
        ),
    },
    {
        accessorKey: 'endDate',
        header: 'End Date',
        cell: ({ row }) => {
            if (!row.original.endDate) return <span>-</span>
            const endDate = new Date(row.original.endDate)
            const now = new Date()
            const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            const isExpiringSoon = daysUntilEnd > 0 && daysUntilEnd <= 30

            return (
                <span className={isExpiringSoon ? 'text-amber-600 font-medium' : 'text-muted-foreground'}>
                    {formatDate(row.original.endDate, 'short')}
                    {isExpiringSoon && <span className="ml-1 text-[10px]">({daysUntilEnd}d)</span>}
                </span>
            )
        },
    },
    {
        accessorKey: 'depositPaid',
        header: 'Deposit',
        cell: ({ row }) => (
            <Badge variant={row.original.depositPaid ? 'default' : 'outline'}>
                {row.original.depositPaid ? 'Paid' : 'Pending'}
            </Badge>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status
            const config = statusConfig[status] ?? { label: status ?? '-', variant: 'outline' as const, className: '' }
            return (
                <Badge variant={config.variant} className={config.className}>
                    {config.label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
]

export function TenanciesTable({ tenancies }: TenanciesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: tenancies ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    const statusFilter = table.getColumn('status')?.getFilterValue() as string[] | undefined

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex gap-2 items-center">
                <Select
                    value={statusFilter?.[0] ?? 'all'}
                    onValueChange={(value) =>
                        table.getColumn('status')?.setFilterValue(
                            value === 'all' ? undefined : [value]
                        )
                    }
                >
                    <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-xs">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-xs py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Users className="h-8 w-8 mb-2" />
                                        <p>No tenancies found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} tenancy(ies)
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

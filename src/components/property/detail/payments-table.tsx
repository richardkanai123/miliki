'use client'

import { useState } from 'react'
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
import { Wallet } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import type { PropertyPayment } from '@/lib/dal/properties/get-property-payments'

interface PaymentsTableProps {
    payments: PropertyPayment[]
}

const statusConfig: Record<string, { label: string; variant: 'outline' | 'secondary' | 'default' | 'destructive'; className: string }> = {
    PENDING: { label: 'Pending', variant: 'outline', className: 'border-amber-500 text-amber-600' },
    PROCESSING: { label: 'Processing', variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
    COMPLETED: { label: 'Completed', variant: 'default', className: 'bg-emerald-600' },
    FAILED: { label: 'Failed', variant: 'destructive', className: '' },
    CANCELLED: { label: 'Cancelled', variant: 'outline', className: 'text-muted-foreground' },
    REFUNDED: { label: 'Refunded', variant: 'secondary', className: '' },
}

const methodConfig: Record<string, { label: string }> = {
    MPESA: { label: 'M-Pesa' },
    BANK_TRANSFER: { label: 'Bank Transfer' },
    CASH: { label: 'Cash' },
    CARD: { label: 'Card' },
    CHEQUE: { label: 'Cheque' },
    OTHER: { label: 'Other' },
}

const columns: ColumnDef<PropertyPayment>[] = [
    {
        accessorKey: 'initiatedAt',
        header: 'Date',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {formatDate(row.original.completedAt ?? row.original.initiatedAt, 'short')}
            </span>
        ),
    },
    {
        accessorKey: 'invoice',
        header: 'Invoice',
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.invoice?.invoiceNumber ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.invoice?.tenancy?.unit?.title ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'tenant',
        header: 'Tenant',
        cell: ({ row }) => (
            <span>{row.original.invoice?.tenancy?.tenant?.user?.name ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
            <span className="tabular-nums font-medium">
                {formatCurrency(row.original.amount)}
            </span>
        ),
    },
    {
        accessorKey: 'method',
        header: 'Method',
        cell: ({ row }) => {
            const method = row.original.method
            return <span>{methodConfig[method]?.label ?? method ?? '-'}</span>
        },
    },
    {
        accessorKey: 'mpesaReceiptNumber',
        header: 'Receipt',
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {row.original.mpesaReceiptNumber ?? row.original.transactionRef ?? '-'}
            </span>
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

export function PaymentsTable({ payments }: PaymentsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: payments ?? [],
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
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
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
                                        <Wallet className="h-8 w-8 mb-2" />
                                        <p>No payments found.</p>
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
                        {table.getFilteredRowModel().rows.length} payment(s)
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

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
import { FileText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import type { PropertyInvoice } from '@/lib/dal/properties/get-property-invoices'

interface InvoicesTableProps {
    invoices: PropertyInvoice[]
}

const statusConfig: Record<string, { label: string; variant: 'outline' | 'secondary' | 'default' | 'destructive'; className: string }> = {
    DRAFT: { label: 'Draft', variant: 'outline', className: '' },
    PENDING: { label: 'Pending', variant: 'secondary', className: 'bg-amber-100 text-amber-700' },
    PARTIAL: { label: 'Partial', variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
    PAID: { label: 'Paid', variant: 'default', className: 'bg-emerald-600' },
    OVERDUE: { label: 'Overdue', variant: 'destructive', className: '' },
    CANCELLED: { label: 'Cancelled', variant: 'outline', className: 'text-muted-foreground' },
    WRITTEN_OFF: { label: 'Written Off', variant: 'outline', className: 'text-muted-foreground' },
}

const typeConfig: Record<string, { label: string }> = {
    RENT: { label: 'Rent' },
    DEPOSIT: { label: 'Deposit' },
    UTILITY: { label: 'Utility' },
    PENALTY: { label: 'Penalty' },
    OTHER: { label: 'Other' },
}

const columns: ColumnDef<PropertyInvoice>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice #',
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.invoiceNumber ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.tenancy?.unit?.title ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'tenant',
        header: 'Tenant',
        cell: ({ row }) => (
            <span>{row.original.tenancy?.tenant?.user?.name ?? '-'}</span>
        ),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.original.type
            return <span>{typeConfig[type]?.label ?? type ?? '-'}</span>
        },
    },
    {
        accessorKey: 'totalAmount',
        header: 'Amount',
        cell: ({ row }) => (
            <span className="tabular-nums">{formatCurrency(row.original.totalAmount)}</span>
        ),
    },
    {
        accessorKey: 'balance',
        header: 'Balance',
        cell: ({ row }) => (
            <span className="tabular-nums font-medium">
                {formatCurrency(row.original.balance)}
            </span>
        ),
    },
    {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
            if (!row.original.dueDate) return <span>-</span>
            const dueDate = new Date(row.original.dueDate)
            const now = new Date()
            const isOverdue = row.original.status !== 'PAID' && dueDate < now

            return (
                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                    {formatDate(row.original.dueDate, 'short')}
                </span>
            )
        },
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

export function InvoicesTable({ invoices }: InvoicesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: invoices ?? [],
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
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
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
                                        <FileText className="h-8 w-8 mb-2" />
                                        <p>No invoices found.</p>
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
                        {table.getFilteredRowModel().rows.length} invoice(s)
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

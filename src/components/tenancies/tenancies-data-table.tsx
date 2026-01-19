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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, Users, MoreHorizontal, Eye, X } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/format'
import type { OrgTenancy } from '@/lib/dal/tenancies/get-tenancies-by-org'

interface TenanciesDataTableProps {
    data: OrgTenancy[]
    slug: string
}

const statusConfig: Record<string, { label: string; variant: 'outline' | 'secondary' | 'default' | 'destructive'; className: string }> = {
    PENDING: { label: 'Pending', variant: 'outline', className: 'border-amber-500 text-amber-600' },
    ACTIVE: { label: 'Active', variant: 'default', className: '' },
    EXPIRED: { label: 'Expired', variant: 'secondary', className: '' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive', className: '' },
    RENEWED: { label: 'Renewed', variant: 'outline', className: 'border-emerald-500 text-emerald-600' },
}

function createColumns(slug: string): ColumnDef<OrgTenancy>[] {
    return [
        {
            accessorKey: 'unit',
            header: 'Unit',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <Link
                        href={`/org/${slug}/properties/${row.original.unit.property.id}/units/${row.original.unit.id}`}
                        className="font-medium hover:underline"
                    >
                        {row.original.unit?.title ?? '-'}
                    </Link>
                    <span className="text-xs text-muted-foreground">{row.original.unit?.property?.name ?? '-'}</span>
                </div>
            ),
        },
        {
            accessorKey: 'tenant',
            header: 'Tenant',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.tenant?.user?.name ?? '-'}</span>
                    <span className="text-xs text-muted-foreground">{row.original.tenant?.user?.email ?? ''}</span>
                </div>
            ),
        },
        {
            accessorKey: 'monthlyRent',
            header: 'Rent',
            cell: ({ row }) => (
                <span className="tabular-nums">{formatCurrency(Number(row.original.monthlyRent))}</span>
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
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/org/${slug}/properties/${row.original.unit.property.id}/units/${row.original.unit.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Unit
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]
}

export function TenanciesDataTable({ data, slug }: TenanciesDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(() => createColumns(slug), [slug])

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    const statusFilter = table.getColumn('status')?.getFilterValue() as string[] | undefined

    const clearFilters = () => {
        setGlobalFilter('')
        setColumnFilters([])
    }

    const hasFilters = globalFilter || columnFilters.length > 0

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-1 flex-wrap gap-2 items-center w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tenancies..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select
                        value={statusFilter?.[0] ?? 'all'}
                        onValueChange={(value) =>
                            table.getColumn('status')?.setFilterValue(
                                value === 'all' ? undefined : [value]
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="EXPIRED">Expired</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="RENEWED">Renewed</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                <Button asChild className="w-full sm:w-auto shrink-0">
                    <Link href={`/org/${slug}/tenancies/add`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tenancy
                    </Link>
                </Button>
            </div>

            {/* Table */}
            <div className="border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Users className="h-8 w-8 mb-2" />
                                        <p>No tenancies found.</p>
                                        {hasFilters && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="mt-1"
                                            >
                                                Clear filters
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {table.getRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} tenancy(ies)
                </p>
                <div className="flex items-center space-x-2 order-1 sm:order-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </div>
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
        </div>
    )
}

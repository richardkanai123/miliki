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
import { Search, Plus, DoorOpen, MoreHorizontal, Eye, Pencil, X } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/format'
import type { UnitWithDetails } from '@/lib/dal/units/get-units-by-property'

interface UnitsDataTableProps {
    data: UnitWithDetails[]
    propertyId: string
    slug: string
}

const statusConfig: Record<string, { label: string; variant: 'outline' | 'secondary' | 'default'; className: string }> = {
    VACANT: { label: 'Vacant', variant: 'outline', className: 'border-emerald-500 text-emerald-600' },
    OCCUPIED: { label: 'Occupied', variant: 'default', className: '' },
    MAINTENANCE: { label: 'Maintenance', variant: 'secondary', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    RESERVED: { label: 'Reserved', variant: 'secondary', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
}

function createColumns(slug: string, propertyId: string): ColumnDef<UnitWithDetails>[] {
    return [
        {
            accessorKey: 'title',
            header: 'Unit',
            cell: ({ row }) => (
                <Link
                    href={`/org/${slug}/properties/${propertyId}/units/${row.original.id}`}
                    className="font-medium hover:underline"
                >
                    {row.getValue('title') ?? '-'}
                </Link>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string
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
            accessorKey: 'rentAmount',
            header: 'Rent',
            cell: ({ row }) => (
                <span className="tabular-nums">
                    {formatCurrency(row.getValue('rentAmount'))}
                </span>
            ),
        },
        {
            accessorKey: 'bedrooms',
            header: 'Bedrooms',
            cell: ({ row }) => <span className="tabular-nums">{row.getValue('bedrooms') ?? '-'}</span>,
        },
        {
            accessorKey: 'bathrooms',
            header: 'Bathrooms',
            cell: ({ row }) => <span className="tabular-nums">{row.getValue('bathrooms') ?? '-'}</span>,
        },
        {
            accessorKey: 'isListed',
            header: 'Listed',
            cell: ({ row }) => {
                const isListed = row.getValue('isListed') as boolean
                return (
                    <Badge variant={isListed ? 'default' : 'outline'}>
                        {isListed ? 'Yes' : 'No'}
                    </Badge>
                )
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
                            <Link href={`/org/${slug}/properties/${propertyId}/units/${row.original.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/org/${slug}/properties/${propertyId}/units/${row.original.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]
}

export function UnitsDataTable({ data, propertyId, slug }: UnitsDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(() => createColumns(slug, propertyId), [slug, propertyId])

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
                            placeholder="Search units..."
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
                            <SelectItem value="VACANT">Vacant</SelectItem>
                            <SelectItem value="OCCUPIED">Occupied</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                            <SelectItem value="RESERVED">Reserved</SelectItem>
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
                    <Link href={`/org/${slug}/properties/${propertyId}/units/add`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Unit
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
                                        <DoorOpen className="h-8 w-8 mb-2" />
                                        <p>No units found.</p>
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
                    {table.getFilteredRowModel().rows.length} unit(s)
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

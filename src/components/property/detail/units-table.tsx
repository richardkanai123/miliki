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
import { Search, Plus, DoorOpen, MoreHorizontal, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/format'
import type { PropertyDetails } from '@/lib/dal/properties/get-property-details'

type Unit = NonNullable<PropertyDetails>['units'][number]

interface UnitsTableProps {
    units: Unit[]
    propertyId: string
    slug: string
}

const statusConfig: Record<string, { label: string; variant: 'outline' | 'secondary' | 'default'; className: string }> = {
    VACANT: { label: 'Vacant', variant: 'outline', className: 'border-emerald-500 text-emerald-600' },
    OCCUPIED: { label: 'Occupied', variant: 'default', className: '' },
    MAINTENANCE: { label: 'Maintenance', variant: 'secondary', className: 'bg-amber-100 text-amber-700' },
    RESERVED: { label: 'Reserved', variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
}

function createColumns(slug: string, propertyId: string): ColumnDef<Unit>[] {
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
            header: 'Actions',
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

export function UnitsTable({ units, propertyId, slug }: UnitsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(() => createColumns(slug, propertyId), [slug, propertyId])

    const table = useReactTable({
        data: units ?? [],
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

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                    <div className="relative w-full sm:w-48">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search units..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Select
                        value={statusFilter?.[0] ?? 'all'}
                        onValueChange={(value) =>
                            table.getColumn('status')?.setFilterValue(
                                value === 'all' ? undefined : [value]
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[130px] h-9">
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
                </div>
                <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/org/${slug}/properties/${propertyId}/units/create`}>
                        <Plus className="h-4 w-4 mr-1" />
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
                                        <DoorOpen className="h-8 w-8 mb-2" />
                                        <p>No units found.</p>
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
                        {table.getFilteredRowModel().rows.length} unit(s)
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

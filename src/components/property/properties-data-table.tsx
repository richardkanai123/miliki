'use client'

import { useMemo, useState } from 'react'
import type {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Plus, X, Building2 } from 'lucide-react'
import Link from 'next/link'
import { createColumns, type PropertyWithCount } from './columns'
import { PROPERTY_TYPES } from '@/lib/utils'

interface DataTableProps {
    data: PropertyWithCount[]
    slug: string
}


export function PropertiesDataTable({
    data,
    slug,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = useState('')

    // Create columns on the client side
    const columns = useMemo(() => createColumns(slug), [slug])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    const typeFilter = table.getColumn('type')?.getFilterValue() as string[] | undefined
    const statusFilter = table.getColumn('isActive')?.getFilterValue() as boolean[] | undefined

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
                            placeholder="Search properties..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Type Filter */}
                    <Select
                        value={typeFilter?.[0] ?? 'all'}
                        onValueChange={(value) =>
                            table.getColumn('type')?.setFilterValue(
                                value === 'all' ? undefined : [value]
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={statusFilter === undefined ? 'all' : statusFilter[0] ? 'active' : 'inactive'}
                        onValueChange={(value) =>
                            table.getColumn('isActive')?.setFilterValue(
                                value === 'all' ? undefined : [value === 'active']
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                    <Link href={`/org/${slug}/properties/create`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
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
                                        <Building2 className="h-8 w-8 mb-2" />
                                        <p>No properties found.</p>
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
                    Showing {table.getRowModel().rows.length} of {''}
                    {table.getFilteredRowModel().rows.length}
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

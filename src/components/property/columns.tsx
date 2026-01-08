'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Property } from '@/app/_generated/prisma/client/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, ToggleRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export type PropertyWithCount = Property & { _count?: { units: number } }

export const createColumns = (slug: string): ColumnDef<PropertyWithCount>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link
                href={`/org/${slug}/properties/${row.original.id}`}
                className="font-medium hover:underline"
            >
                {row.getValue('name')}
            </Link>
        ),
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const type = row.getValue('type') as string
            return (
                <Badge variant="outline" className="capitalize">
                    {type.toLowerCase().replace('_', ' ')}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'city',
        header: 'Location',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.city}, {row.original.county}
            </span>
        ),
    },
    {
        id: 'units',
        accessorFn: (row) => row._count?.units ?? 0,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Units
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="tabular-nums">{row.original._count?.units ?? 0}</span>
        ),
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') as boolean
            return (
                <Badge variant={isActive ? 'default' : 'secondary'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as Date
            return <span className="text-muted-foreground">{format(new Date(date), 'MMM d, yyyy')}</span>
        },
    },
    {
        id: 'actions',
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
                        <Link href={`/org/${slug}/properties/${row.original.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/org/${slug}/properties/${row.original.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={cn("text-secondary focus:text-secondary", !row.original.isActive ? 'text-green-500 focus:text-green-500' : 'text-red-500 focus:text-red-500')}>
                        <ToggleRight className="mr-2 h-4 w-4" />
                        {row.original.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
    },
]

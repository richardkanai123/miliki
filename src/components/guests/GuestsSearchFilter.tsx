'use client'

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export type FilterType = "all" | "active" | "inactive";

interface GuestsSearchFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterType: FilterType;
    onFilterChange: (value: FilterType) => void;
    searchPlaceholder?: string;
}

const GuestsSearchFilter = ({
    searchTerm,
    onSearchChange,
    filterType,
    onFilterChange,
    searchPlaceholder = "Search by name, email, or ID number..."
}: GuestsSearchFilterProps) => {
    return (
        <Card className="rounded-lg sticky top-4 z-10 shadow-sm border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardContent className="pt-4 pb-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 h-10"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <Select value={filterType} onValueChange={(value: FilterType) => onFilterChange(value)}>
                            <SelectTrigger className="w-full sm:w-[180px] h-10">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Guests</SelectItem>
                                <SelectItem value="active">Active Only</SelectItem>
                                <SelectItem value="inactive">Inactive Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GuestsSearchFilter;

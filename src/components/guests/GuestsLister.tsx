'use client'

import { useState, useMemo } from "react";
import { Guest } from "@/generated/prisma";
import GuestsHeader from "./GuestsHeader";
import GuestsStats from "./GuestsStats";
import GuestsSearchFilter, { FilterType } from "./GuestsSearchFilter";
import GuestsViewTabs, { ViewType } from "./GuestsViewTabs";
import GuestsTable from "./GuestsTable";
import GuestsGrid from "./GuestsGrid";

interface GuestsListerProps {
    guests: Guest[];
}

const GuestsLister = ({ guests }: GuestsListerProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [currentView, setCurrentView] = useState<ViewType>("table");

    // Filter and search guests
    const filteredGuests = useMemo(() => {
        return guests.filter((guest) => {
            // Filter by active status
            const statusMatch =
                filterType === "all" ||
                (filterType === "active" && guest.isActive) ||
                (filterType === "inactive" && !guest.isActive);

            // Search by name or ID number
            const searchMatch =
                searchTerm === "" ||
                guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest.email?.toLowerCase().includes(searchTerm.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [guests, searchTerm, filterType]);

    return (
        <div className="w-full space-y-6 p-4 relative">
            <GuestsHeader />

            <GuestsStats guests={guests} />

            <GuestsSearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
            />

            <GuestsViewTabs
                currentView={currentView}
                onViewChange={setCurrentView}
                tableContent={
                    <GuestsTable
                        guests={filteredGuests}
                        searchTerm={searchTerm}
                        filterType={filterType}
                    />
                }
                gridContent={
                    <GuestsGrid
                        guests={filteredGuests}
                        searchTerm={searchTerm}
                        filterType={filterType}
                    />
                }
            />
        </div>
    );
};

export default GuestsLister;
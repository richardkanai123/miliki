'use client'

import { Guest } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import GuestCard from "./GuestCard";
import { FilterType } from "./GuestsSearchFilter";

interface GuestsGridProps {
    guests: Guest[];
    searchTerm?: string;
    filterType?: FilterType;
}

const GuestsGrid = ({ guests, searchTerm, filterType }: GuestsGridProps) => {
    if (guests.length === 0) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center text-muted-foreground">
                        {searchTerm || (filterType && filterType !== "all")
                            ? "No guests match your search criteria"
                            : "No guests found"
                        }
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guests.map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
            ))}
        </div>
    );
};

export default GuestsGrid;

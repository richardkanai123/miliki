'use client'

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface GuestsHeaderProps {
    title?: string;
    description?: string;
    addGuestLink?: string;
}

const GuestsHeader = ({
    title = "Guests",
    description = "Manage your guest information and bookings",
    addGuestLink = "/dashboard/guests/add"
}: GuestsHeaderProps) => {
    return (
        <div className="w-full flex items-center justify-between px-4 py-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <Button asChild>
                <Link href={addGuestLink}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Guest
                </Link>
            </Button>
        </div>
    );
};

export default GuestsHeader;

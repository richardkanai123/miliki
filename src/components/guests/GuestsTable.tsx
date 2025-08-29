'use client'

import { useState } from "react";
import { Guest } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import GuestDetailsDialog from "./GuestDetailsDialog";

interface GuestsTableProps {
    guests: Guest[];
    searchTerm?: string;
    filterType?: string;
}

const GuestsTable = ({ guests, searchTerm, filterType }: GuestsTableProps) => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewGuest = (guest: Guest) => {
        setSelectedGuest(guest);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedGuest(null);
    };

    return (
        <>
            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%] sm:w-auto">Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden lg:table-cell">ID Number</TableHead>
                                <TableHead className="w-[25%] sm:w-auto">Status</TableHead>
                                <TableHead className="text-right w-[25%] sm:w-auto">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <div className="text-muted-foreground">
                                            {searchTerm || (filterType && filterType !== "all")
                                                ? "No guests match your search criteria"
                                                : "No guests found"
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                guests.map((guest) => (
                                    <TableRow key={guest.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{guest.name}</span>
                                                {/* Show phone and email on mobile as subtitle */}
                                                <div className="text-xs text-muted-foreground sm:hidden space-y-1 mt-1">
                                                    <div>{guest.phone}</div>
                                                    {guest.email && <div>{guest.email}</div>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{guest.phone}</TableCell>
                                        <TableCell className="hidden md:table-cell">{guest.email || "—"}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{guest.idNumber || "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant={guest.isActive ? "default" : "secondary"}>
                                                {guest.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewGuest(guest)}
                                                className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                                            >
                                                <Eye className="h-4 w-4 sm:mr-2" />
                                                <span className="hidden sm:inline">View</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Guest Details Dialog */}
            {selectedGuest && (
                <GuestDetailsDialog
                    guest={selectedGuest}
                    open={isDialogOpen}
                    onOpenChange={handleCloseDialog}
                />
            )}
        </>
    );
};

export default GuestsTable;

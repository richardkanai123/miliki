'use client'

import React from "react";
import { Guest } from "@/generated/prisma";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    AlertTriangle,
    Calendar,
    StickyNote,
    CalendarPlus,
    Edit,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GuestDetailsDialogProps {
    guest: Guest;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const GuestDetailsDialog = ({
    guest,
    open,
    onOpenChange,
}: GuestDetailsDialogProps) => {
    const {
        name,
        email,
        address,
        idNumber,
        emergencyContact,
        isActive,
        notes,
        phone,
        createdAt,
    } = guest;

    // Generate initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Format phone number for display
    const formatPhone = (phone: string) => {
        if (phone.length === 10) {
            return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
        }
        return phone;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{name}</div>
                            <Badge
                                variant={isActive ? "default" : "secondary"}
                                className={`text-xs ${isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                    }`}>
                                {isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </DialogTitle>

                    <DialogDescription className="my-3">
                        Guest Details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Phone className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Phone
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {formatPhone(phone)}
                                    </p>
                                </div>
                            </div>

                            {email && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <Mail className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Email
                                        </p>
                                        <p className="text-gray-900 dark:text-white truncate">
                                            {email}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Personal Details */}
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Personal Details
                        </h4>
                        <div className="space-y-4">
                            {idNumber && (
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-purple-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            ID Number
                                        </p>
                                        <p className="text-gray-900 dark:text-white font-mono">
                                            {idNumber}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {address && (
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Address
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            {address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {emergencyContact && (
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Emergency Contact
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            {emergencyContact}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {notes && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <StickyNote className="h-4 w-4" />
                                    Notes
                                </h4>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {notes}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Account Information */}
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Account Information
                        </h4>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Member Since
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => console.log("book | unbook")}
                            className="flex-1">
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Book Guest
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            className="flex-1">
                            <Link href={`/dashboard/guests/${guest.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GuestDetailsDialog;

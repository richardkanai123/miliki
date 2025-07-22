"use client";

import React, { useState } from "react";
import { Guest } from "@/generated/prisma";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    CheckCircle,
    XCircle,
    MoreHorizontal,
    CalendarPlus,
    Eye,
    Edit,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DeleteGuestButton } from "../Buttons/DeleteGuestButton";

interface GuestCardProps {
    guest: Guest;
}

const GuestCard = ({ guest }: GuestCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        updatedAt
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}>
            <Card className=" h-full  border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm group">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-gray-700 dark:text-gray-300 font-semibold">
                                    {getInitials(name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant={isActive ? "default" : "secondary"}
                                        className={`text-xs ${isActive
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>
                                        {isActive ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Inactive
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="size-5 font-extrabold" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => console.log("Edit guest")}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Guest
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    asChild
                                    className="text-red-600 dark:text-red-400">
                                    <DeleteGuestButton setDialogOpen={setIsDialogOpen} guestId={guest.id} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                        {phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{formatPhone(phone)}</span>
                            </div>
                        )}

                        {email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="h-4 w-4 text-green-500" />
                                <span className="truncate">{email}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Last Updated {new Date(updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Details
                                </Button>
                            </DialogTrigger>

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
                                            onClick={() => console.log("Edit guest")}
                                            className="flex-1">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Details
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default GuestCard;

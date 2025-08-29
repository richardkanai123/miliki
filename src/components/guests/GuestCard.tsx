"use client";

import React, { useState } from "react";
import { Guest } from "@/generated/prisma";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    XCircle,
    MoreHorizontal,
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
import GuestDetailsDialog from "./GuestDetailsDialog";

interface GuestCardProps {
    guest: Guest;
}

const GuestCard = ({ guest }: GuestCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {
        name,
        email,
        isActive,
        phone,
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
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsDialogOpen(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                    </Button>

                    {/* Guest Details Dialog */}
                    <GuestDetailsDialog
                        guest={guest}
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default GuestCard;

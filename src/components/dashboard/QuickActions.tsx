"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, CreditCard, UserPlus, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                    Common tasks and shortcuts
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                <Button asChild className="justify-start h-auto p-4">
                    <Link href="/dashboard/bookings/add">
                        <Calendar className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Create New Booking</div>
                            <div className="text-xs text-muted-foreground">Book a property for a guest</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="justify-start h-auto p-4">
                    <Link href="/dashboard/properties/add">
                        <Building2 className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Add Property</div>
                            <div className="text-xs text-muted-foreground">List a new property</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="justify-start h-auto p-4">
                    <Link href="/dashboard/finances/record-payment">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Record Payment</div>
                            <div className="text-xs text-muted-foreground">Log a payment received</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="justify-start h-auto p-4">
                    <Link href="/dashboard/guests/add">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Add Guest</div>
                            <div className="text-xs text-muted-foreground">Register a new guest</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start h-auto p-4">
                    <Link href="/dashboard/reports">
                        <FileText className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">View Reports</div>
                            <div className="text-xs text-muted-foreground">Detailed analytics</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start h-auto p-4">
                    <Link href="/dashboard/finances">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Financial Overview</div>
                            <div className="text-xs text-muted-foreground">Income and expenses</div>
                        </div>
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

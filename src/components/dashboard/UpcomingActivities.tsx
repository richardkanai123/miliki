"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CreditCard, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy data for upcoming activities
const upcomingActivities = [
    {
        id: 1,
        type: "checkin",
        title: "Check-in: Sarah Johnson",
        property: "Sunset Villa",
        time: "10:00 AM",
        date: "Today",
        status: "confirmed",
        icon: Calendar,
    },
    {
        id: 2,
        type: "checkout",
        title: "Check-out: Michael Brown",
        property: "Ocean View Apartment",
        time: "11:00 AM",
        date: "Today",
        status: "pending",
        icon: Clock,
    },
    {
        id: 3,
        type: "payment",
        title: "Payment Due: Emma Wilson",
        property: "Garden House",
        time: "",
        date: "Tomorrow",
        status: "overdue",
        amount: "KSh 15,000",
        icon: CreditCard,
    },
    {
        id: 4,
        type: "checkin",
        title: "Check-in: David Lee",
        property: "City Center Studio",
        time: "3:00 PM",
        date: "Tomorrow",
        status: "confirmed",
        icon: Calendar,
    },
    {
        id: 5,
        type: "maintenance",
        title: "Maintenance: AC Service",
        property: "Beachfront Condo",
        time: "9:00 AM",
        date: "Dec 20",
        status: "scheduled",
        icon: AlertCircle,
    },
    {
        id: 6,
        type: "checkout",
        title: "Check-out: Lisa Chen",
        property: "Mountain View Lodge",
        time: "12:00 PM",
        date: "Dec 21",
        status: "confirmed",
        icon: Clock,
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "overdue":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        case "scheduled":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case "checkin":
            return "text-green-600 dark:text-green-400";
        case "checkout":
            return "text-blue-600 dark:text-blue-400";
        case "payment":
            return "text-orange-600 dark:text-orange-400";
        case "maintenance":
            return "text-purple-600 dark:text-purple-400";
        default:
            return "text-gray-600 dark:text-gray-400";
    }
};

export function UpcomingActivities() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Activities</CardTitle>
                <CardDescription>
                    Check-ins, check-outs, and pending payments
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {upcomingActivities.map((activity) => {
                            const IconComponent = activity.icon;
                            return (
                                <div key={activity.id} className="flex items-start space-x-4 rounded-lg border p-3">
                                    <div className={`rounded-full p-2 ${getTypeColor(activity.type)}`}>
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.title}
                                            </p>
                                            <Badge variant="secondary" className={getStatusColor(activity.status)}>
                                                {activity.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.property}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{activity.date}</span>
                                            {activity.time && <span>{activity.time}</span>}
                                            {activity.amount && (
                                                <span className="font-medium text-orange-600">
                                                    {activity.amount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

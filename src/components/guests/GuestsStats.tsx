'use client'

import { Guest } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface GuestsStatsProps {
    guests: Guest[];
}

const GuestsStats = ({ guests }: GuestsStatsProps) => {
    const activeCount = guests.filter(g => g.isActive).length;
    const inactiveCount = guests.filter(g => !g.isActive).length;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className='rounded-none'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{guests.length}</div>
                </CardContent>
            </Card>

            <Card className='rounded-none'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
                    <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeCount}</div>
                </CardContent>
            </Card>

            <Card className='rounded-none'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inactive Guests</CardTitle>
                    <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{inactiveCount}</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GuestsStats;

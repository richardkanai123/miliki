import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperties } from "@/lib/actions/properties/getUserProperties";
import { Calendar, CreditCard, TrendingUp } from "lucide-react";
import { Suspense } from "react";
import PropertiesStatCard from "./PropertiesStatCard";
import { checkAuth } from "@/lib/checkAuth";
import UnAuthenticated from "../authentication/Unauthenticated";



// Dummy data - in real app this would come from your API
const stats = {
    totalProperties: 24,
    activeBookings: 18,
    upcomingCheckins: 5,
    upcomingCheckouts: 3,
    outstandingPayments: 8,
    revenueThisMonth: 45750,
    occupancyRate: 75
};

export async function DashboardStats() {

    const session = await checkAuth()

    if (!session) {
        return (
            <Card>
                <UnAuthenticated />
            </Card>
        )
    }

    const { session: { userId } } = session

    const propertiesPromise = await getProperties(userId)
    return (
        <>

            <Suspense fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                </Card>
            }>
                <PropertiesStatCard propertiesPromise={Promise.resolve(propertiesPromise)} />
            </Suspense>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.upcomingCheckins} check-ins, {stats.upcomingCheckouts} check-outs today
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        KSh {stats.revenueThisMonth.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        +12% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.outstandingPayments} outstanding payments
                    </p>
                </CardContent>
            </Card>
        </>
    );
}

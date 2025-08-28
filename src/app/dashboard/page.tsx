import UnAuthenticated from "@/components/authentication/Unauthenticated";
import { checkAuth } from "@/lib/checkAuth";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingActivities } from "@/components/dashboard/UpcomingActivities";

export default async function MainDashboard() {
  const session = await checkAuth()

  if (!session) {
    return (
      <UnAuthenticated />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart />
        </div>
        <div className="col-span-3">
          <OccupancyChart />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <UpcomingActivities />
        </div>
        <div className="col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

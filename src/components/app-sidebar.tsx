"use client";

import { Suspense } from "react";
import {
  BookmarkIcon as Bookmark,
  LayoutDashboard,
  UsersRoundIcon as Users,
  Building2,
  TrendingUp,
  BarChart3,
  FileText,
  CreditCard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

const NavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Today's Summary",
          url: "/dashboard?duration=today",
        },
        {
          title: "This Week",
          url: "/dashboard?duration=this-week",
        },
        {
          title: "This Month",
          url: "/dashboard?duration=this-month",
        },
        {
          title: "Financial Summary",
          url: "/dashboard/financial",
        },
      ],
    },
    {
      title: "Properties",
      url: "/dashboard/properties",
      icon: Building2,
      items: [
        {
          title: "All Properties",
          url: "/dashboard/properties",
        },
        {
          title: "Add Property",
          url: "/dashboard/properties/add",
        },
        {
          title: "Property Analytics",
          url: "/dashboard/properties/analytics",
        },
        {
          title: "Maintenance Schedule",
          url: "/dashboard/properties/maintenance",
        },
        {
          title: "Property Photos",
          url: "/dashboard/properties/photos",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/dashboard/bookings",
      icon: Bookmark,
      items: [
        {
          title: "All Bookings",
          url: "/dashboard/bookings",
        },
        {
          title: "New Booking",
          url: "/dashboard/bookings/add",
        },
        {
          title: "Upcoming",
          url: "/dashboard/bookings?status=upcoming",
        },
        {
          title: "Active",
          url: "/dashboard/bookings?status=active",
        },
        {
          title: "Check-ins Today",
          url: "/dashboard/bookings?type=checkin",
        },
        {
          title: "Check-outs Today",
          url: "/dashboard/bookings?type=checkout",
        },
        {
          title: "Cancelled",
          url: "/dashboard/bookings?status=cancelled",
        },
      ],
    },
    {
      title: "Guests",
      url: "/dashboard/guests",
      icon: Users,
      items: [
        {
          title: "All Guests",
          url: "/dashboard/guests",
        },
        {
          title: "Add Guest",
          url: "/dashboard/guests/add",
        },
        {
          title: "Guest Directory",
          url: "/dashboard/guests/directory",
        },
        {
          title: "Guest Reviews",
          url: "/dashboard/guests/reviews",
        },
      ],
    },
    {
      title: "Finances",
      url: "/dashboard/finances",
      icon: CreditCard,
      items: [
        {
          title: "Income Overview",
          url: "/dashboard/finances/income",
        },
        {
          title: "Expenses",
          url: "/dashboard/finances/expenses",
        },
        {
          title: "Rent Collection",
          url: "/dashboard/finances/rent",
        },
        {
          title: "M-Pesa Transactions",
          url: "/dashboard/finances/mpesa",
        },
        {
          title: "Bank Transfers",
          url: "/dashboard/finances/bank",
        },
        {
          title: "Tax Reports",
          url: "/dashboard/finances/tax",
        },
      ],
    },
  ],
  Reports: [
    {
      name: "Occupancy Reports",
      url: "/dashboard/reports/occupancy",
      icon: BarChart3,
    },
    {
      name: "Revenue Analytics",
      url: "/dashboard/reports/revenue",
      icon: TrendingUp,
    },
    {
      name: "Guest Statistics",
      url: "/dashboard/reports/guests",
      icon: Users,
    },
    {
      name: "Property Performance",
      url: "/dashboard/reports/properties",
      icon: Building2,
    },
    {
      name: "Maintenance Logs",
      url: "/dashboard/reports/maintenance",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, error, isPending } = useSession();
  if (!data || error) {
    return null;
  }


  return (
    <Sidebar
      collapsible="icon"
      {...props}>

      {
        isPending && !data ? (
          <SidebarHeader className="border-b border-sidebar-border bg-sidebar-accent/10">
            <SidebarMenuItem>
              <SidebarMenuButton className="group relative">
                <div className="w-8 h-8 bg-sidebar-accent rounded-full animate-pulse"></div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarHeader>
        )
          : (
            <>
              <SidebarHeader className="border-b border-sidebar-border bg-sidebar-accent/10 p-2 list-none">
                <SidebarMenuItem>
                  <SidebarMenuButton className="group relative">
                    <div className="relative">
                      <Image
                        src="/playstore.png"
                        alt="Miliki"
                        width={32}
                        height={32}
                        className="mr-3 rounded-lg border border-sidebar-border"
                      />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Miliki</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarHeader>
              <SidebarContent className="p-2 space-y-4">
                <div className="space-y-2">
                  <div className="px-3 mb-2">
                    <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                      Main Navigation
                    </h2>
                  </div>
                  <NavMain items={NavData.navMain} />
                </div>

                <div className="space-y-2">
                  <div className="px-3 mb-2">
                    <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                      Reports & Analytics
                    </h2>
                  </div>
                  <NavProjects projects={NavData.Reports} />
                </div>
              </SidebarContent>
              <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/10 p-2">
                <div className="space-y-2 group-data-[collapsible=icon]:hidden">
                  <div className="px-3">
                    <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
                      Support
                    </h2>
                    <div className="space-y-1 list-none">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/help" className="text-xs">
                            <FileText className="w-3 h-3" />
                            <span>Help Center</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/contact" className="text-xs">
                            <Users className="w-3 h-3" />
                            <span>Contact Support</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </div>
                  </div>
                </div>
                <Suspense
                  fallback={
                    <div className="flex items-center space-x-3 p-2 rounded-lg animate-pulse">
                      <div className="w-8 h-8 bg-sidebar-accent rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-sidebar-accent rounded w-3/4"></div>
                        <div className="h-2 bg-sidebar-accent/50 rounded w-1/2"></div>
                      </div>
                    </div>
                  }>
                  <NavUser />
                </Suspense>
              </SidebarFooter>
            </>

          )}
    </Sidebar>
  );
}

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
      ],
    },
    {
      title: "Bookings",
      url: "/dashboard/bookings",
      icon: Bookmark,
      items: [
        {
          title: "View Bookings",
          url: "/dashboard/bookings",
        },
        {
          title: "New Booking",
          url: "/dashboard/bookings/add",
        },
        {
          title: "Check-ins Today",
          url: "/dashboard/bookings?type=checkin",
        },
        {
          title: "Check-outs Today",
          url: "/dashboard/bookings?type=checkout",
        },
      ],
    },
    {
      title: "Guests",
      url: "/dashboard/guests",
      icon: Users,
      items: [
        {
          title: "View Guests",
          url: "/dashboard/guests",
        },
        {
          title: "Add Guest",
          url: "/dashboard/guests/add",
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
          <SidebarHeader>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <div className="h-8 w-8 animate-pulse rounded-full bg-sidebar-accent"></div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarHeader>
        )
          : (
            <>
              <SidebarHeader className="p-0 list-none">
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                    <Link href="/dashboard">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Image
                          src="/playstore.png"
                          alt="Miliki"
                          width={32}
                          height={32}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Miliki</span>
                        <span className="truncate text-xs">Property Management</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarHeader>
              <SidebarContent>
                <NavMain items={NavData.navMain} />
                <NavProjects projects={NavData.Reports} />
              </SidebarContent>
              <SidebarFooter>
                <Suspense fallback={
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <div className="h-8 w-8 animate-pulse rounded-full bg-sidebar-accent"></div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-sidebar-accent"></div>
                        <div className="h-2 w-1/2 animate-pulse rounded bg-sidebar-accent/50"></div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                }>
                  <NavUser />
                </Suspense>
              </SidebarFooter>
            </>
          )}
    </Sidebar>
  );
}

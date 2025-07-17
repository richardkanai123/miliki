"use client";

import { Suspense } from "react";
import {
  BanknoteArrowUp,
  Map,
  BookmarkIcon as Bookmark,
  LayoutDashboard,
  UsersRoundIcon as Users,
  ReceiptText,
  Building2,
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

const NavData = {
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Today's",
          url: "/dashboard?duration=today",
        },
        {
          title: "This Week",
          url: "/dashboard?duration=this-week",
        },
        {
          title: "Last Week",
          url: "/dashboard?duration=last-week",
        },
        {
          title: "This Month",
          url: "/dashboard?duration=this-month",
        },
        {
          title: "Last Month",
          url: "/dashboard?duration=last-month",
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
          title: "Query Properties",
          url: "/dashboard/properties/query",
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
      ],
    },
  ],
  Reports: [
    {
      name: "Payments",
      url: "/dashboard/reports/payments",
      icon: BanknoteArrowUp,
    },
    {
      name: "Bills",
      url: "/dashboard/reports/bills",
      icon: ReceiptText,
    },
    {
      name: "Pricing",
      url: "/dashboard/pricing",
      icon: Map,
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
      className=" transition-all duration-300 ease-in-out 
    border-r border-sidebar-border 
    shadow-lg backdrop-blur-sm
    data-[state=collapsed]:shadow-none
    data-[state=expanded]:shadow-xl "
      collapsible="icon"
      {...props}>

      {
        isPending && !data ? (
          <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-primary/10 list-none">
            <SidebarMenuItem>
              <SidebarMenuButton className="group relative text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 active:bg-sidebar-accent transition-all duration-200 rounded-lg border border-transparent hover:border-sidebar-border/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                <div className="w-8 h-8 bg-sidebar-accent rounded-full animate-pulse"></div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarHeader>
        )
          : (
            <>
              <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-primary/10 list-none">
                <SidebarMenuItem>
                  <SidebarMenuButton className="group relative text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 active:bg-sidebar-accent transition-all duration-200  rounded-lg border border-transparent hover:border-sidebar-border/50 hover:shadow-sm focus-visible:ring-2  focus-visible:ring-sidebar-ring">
                    <div className="relative">
                      <Image
                        src="/playstore.png"
                        alt="Miliki"
                        width={32}
                        height={32}
                        className="mr-3 rounded-lg shadow-sm border border-sidebar-border"
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
              <SidebarFooter className="border-t border-sidebar-border bg-gradient-to-t from-sidebar-accent/10 to-transparent p-2">
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

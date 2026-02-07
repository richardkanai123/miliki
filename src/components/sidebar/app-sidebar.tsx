import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import SidebarHeaderComponent from "./sidebar-header"
import SidebarNav from "./sidebar-nav"
import { Suspense } from "react"
import { Skeleton } from "../ui/skeleton"
import LogoutBtn from "../auth/logout-btn"

const AppSidebar = () => {

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeaderComponent />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <Suspense fallback={<SidebarMenuSkeleton />}>
                            <SidebarNav />
                        </Suspense>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Suspense fallback={<Skeleton className="w-full h-full" />}>
                    <LogoutBtn />
                </Suspense>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
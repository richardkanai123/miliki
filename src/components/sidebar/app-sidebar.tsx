import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import SidebarHeaderComponent from "./sidebar-header"
import SidebarNav from "./sidebar-nav"
import { Suspense } from "react"
import SidebarFooterComponent from "./sidebar-footer"

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
            <SidebarFooterComponent />
        </Sidebar>
    )
}

export default AppSidebar
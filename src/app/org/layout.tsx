import AppSidebar from "@/components/sidebar/app-sidebar"
import { ReactNode, Suspense } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="w-full min-h-screen max-hit m-auto flex ">
                <Suspense fallback={<div className="w-full min-h-screen max-hit m-auto flex"><Skeleton className="w-full h-full" /></div>}>
                    <AppSidebar />
                </Suspense>
                <div className="w-full min-h-screen max-hit m-auto relative flex-1 ">
                    <SidebarTrigger className="absolute top-2 left-2 size-6" />
                    <div className="h-6 w-full bg-transparent" />
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}

export default Layout
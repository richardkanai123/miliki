import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/navigation/Header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="w-full max-h-fit flex flex-1 flex-col gap-4 p-4 ">
          {children}
        </div>
      </SidebarInset >
    </SidebarProvider >
  )
}

export default DashLayout
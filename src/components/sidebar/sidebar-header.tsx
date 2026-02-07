import { SidebarHeader } from "@/components/ui/sidebar"
import Image from "next/image"
import OrgSwitcher from "./org-toggle"

const SidebarHeaderComponent = () => {
    return (
        <SidebarHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image src="/favicon-32x32.png" alt="Miliki" className="rounded-full" width={32} height={32} />
                </div>
                {/* <SidebarTrigger className="size-6" /> */}
            </div>
            <OrgSwitcher />
        </SidebarHeader>
    )
}

export default SidebarHeaderComponent
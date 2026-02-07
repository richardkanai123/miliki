'use client'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Loader2Icon, TriangleAlertIcon } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useActiveOrganization, useListOrganizations, organization } from "@/lib/auth-client"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ErrorContext } from "better-auth/client"
import { useTransition } from "react"


const OrgSwitcher = () => {

    const router = useRouter()
    const [isTransitioning, startTransition] = useTransition()
    const { data: organizations, isPending, error, refetch } = useListOrganizations()
    const { data: activeOrganization, isPending: isActiveOrganizationPending, error: activeOrganizationError, refetch: refetchActiveOrganization } = useActiveOrganization()

    const handleRefetch = () => {
        error ? refetch() : refetchActiveOrganization()
    }

    if (isPending || isActiveOrganizationPending || isTransitioning) return <Skeleton className="w-full rounded-lg" />
    if (error || activeOrganizationError) return (
        <div className="w-full flex flex-col gap-2 items-center justify-center">
            <p className="text-sm text-muted-foreground">{error?.message || activeOrganizationError?.message}</p>
            <Button variant="outline" onClick={() => handleRefetch()}><TriangleAlertIcon className="size-4" />
                {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
                Retry
            </Button>
        </div>
    )


    const handleSelectOrganization = (organizationId: string, organizationName: string, organizationSlug: string) => {
        startTransition(async () => {
            toast.loading(`Switching to ${organizationName}...`)
            try {
                organization.setActive({ organizationId }, {
                    onSuccess: () => {
                        toast.dismiss()
                        toast.success(`${organizationName} is now your active organization`)
                        router.push(`/org/${organizationSlug}`)
                    },
                    onError: (error: ErrorContext) => {
                        toast.dismiss()
                        toast.error(error.error.message || "An unknown error occurred")
                    }
                })
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "An unknown error occurred")
            }
        })
    }


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            {
                                activeOrganization ? (
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-medium">Organizations</span>
                                        <span className="">{activeOrganization.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-medium">Organizations</span>
                                        <span className="">Select an organization</span>
                                    </div>
                                )
                            }
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    {organizations && (
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width)"
                            align="start"
                        >
                            {organizations.map((organization) => (
                                <DropdownMenuItem
                                    key={organization.id}
                                    onSelect={() => handleSelectOrganization(organization.id, organization.name, organization.slug)}
                                >
                                    {organization.name}
                                    {activeOrganization?.id === organization.id && <Check className="ml-auto" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default OrgSwitcher
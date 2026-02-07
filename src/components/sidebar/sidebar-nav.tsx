'use client'

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSubButton, SidebarMenuSubItem, SidebarMenuSub, } from '@/components/ui/sidebar'
import { useParams, usePathname } from 'next/navigation'
import { BuildingIcon, ChevronRight, FileIcon, LayoutDashboardIcon, PlusIcon, UsersIcon, WalletIcon } from 'lucide-react'
import Link from 'next/link'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"


const SidebarNav = () => {
    const searchParams = useParams()
    const orgSlug = searchParams?.slug as string
    const pathname = usePathname()

    const isActive = (href: string) => pathname === href

    const links = [
        {
            label: 'Dashboard',
            href: `/org/${orgSlug}`,
            icon: LayoutDashboardIcon,
        },
        {
            label: 'Properties',
            href: `/org/${orgSlug}/properties`,
            icon: BuildingIcon,
            subLinks: [
                {
                    label: 'Add Property',
                    href: `/org/${orgSlug}/properties/create`,
                    icon: PlusIcon,
                },
            ],
        },
        {
            label: 'Tenants',
            href: `/org/${orgSlug}/tenancies`,
            icon: UsersIcon,
            subLinks: [
                {
                    label: 'Add Tenant',
                    href: `/org/${orgSlug}/tenancies/add`,
                    icon: PlusIcon,
                },
            ],
        },
        {
            label: 'Invoices',
            href: `/org/${orgSlug}/invoices`,
            icon: FileIcon,
        },
        {
            label: 'Payments',
            href: `/org/${orgSlug}/payments`,
            icon: WalletIcon,
        }
    ]

    return (
        <SidebarMenu>
            {links.map((link) => {
                // Check if link or any sublink is active
                const linkIsActive = isActive(link.href)
                const hasSubLinks = link.subLinks && link.subLinks.length > 0
                const anySubLinkActive = hasSubLinks
                    ? link.subLinks.some(subLink => isActive(subLink.href))
                    : false
                const isParentActive = linkIsActive || anySubLinkActive

                // If link has sublinks, use Collapsible
                if (hasSubLinks) {
                    return (
                        <Collapsible
                            key={link.label}
                            asChild
                            defaultOpen={isParentActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild className="w-full">
                                    <SidebarMenuButton
                                        tooltip={link.label}
                                        isActive={linkIsActive}
                                        asChild
                                    >
                                        <Link href={link.href}>
                                            {link.icon && <link.icon />}
                                            <span>{link.label}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {link.subLinks.map((subLink) => (
                                            <SidebarMenuSubItem key={subLink.label}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isActive(subLink.href)}
                                                >
                                                    <Link href={subLink.href}>
                                                        {subLink.icon && <subLink.icon />}
                                                        <span>{subLink.label}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                }

                // If link has no sublinks, render without Collapsible
                return (
                    <SidebarMenuItem key={link.label}>
                        <SidebarMenuButton
                            tooltip={link.label}
                            isActive={linkIsActive}
                            asChild
                        >
                            <Link href={link.href}>
                                {link.icon && <link.icon />}
                                <span>{link.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
    )
}

export default SidebarNav
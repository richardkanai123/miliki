'use client'
import {
    Loader2,
    Bell,
    Settings,
    Home,
    ChevronRight
} from "lucide-react"
import SignInBtn from "../authentication/SignInBtn"
import { ModeToggle } from "../theme-toggle"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CustomAvatarImage from "./Avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import GlobarSearch from "./GlobarSearch"
import Notifications from "../notifications/Notifications"
const Header = () => {
    const { data: session, isPending, error } = useSession()
    const pathname = usePathname()

    if (error) {
        return null
    }

    const imageSrc = session?.user?.image as string || "/favicon-32x32.png"
    const userName = session?.user?.name as string || "User"

    // Generate breadcrumb from pathname
    const generateBreadcrumb = () => {
        const segments = pathname.split('/').filter(Boolean)
        const breadcrumbs = [{ name: 'Dashboard', href: '/dashboard', original: 'Dashboard', isId: false }]

        let currentPath = ''
        segments.forEach((segment) => {
            if (segment === 'dashboard') return
            currentPath += `/${segment}`

            // Check if segment looks like an ID (long alphanumeric string)
            const isId = segment.length > 10 && /^[a-zA-Z0-9]+$/.test(segment)

            let name: string
            if (isId) {
                // Truncate long IDs to 5 characters with ellipsis
                name = segment.slice(0, 5) + '...'
            } else {
                // Format regular segments (capitalize and replace hyphens)
                name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
            }

            breadcrumbs.push({
                name,
                href: `/dashboard${currentPath}`,
                original: segment,
                isId
            })
        })

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumb()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-2 sm:px-4">
                {/* Mobile Layout */}
                <div className="flex items-center justify-between w-full md:hidden">
                    {/* Left - Sidebar trigger and home */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Link href="/dashboard" className="p-1">
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    </div>

                    {/* Center - Search */}
                    <div className="flex-1 max-w-xs mx-2">
                        <GlobarSearch />
                    </div>

                    {/* Right - Essential actions only */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Notifications />

                        {/* Theme Toggle - Mobile */}
                        <div className="md:hidden">
                            <ModeToggle />
                        </div>

                        {/* User Menu */}
                        {isPending ? (
                            <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </Button>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                        <CustomAvatarImage src={imageSrc} alt={userName} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{userName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/financial">Billing</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <SignInBtn />
                        )}
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center w-full">
                    {/* Left Section - Sidebar Trigger & Breadcrumb */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />

                        {/* Breadcrumb Navigation */}
                        <nav className="flex items-center space-x-1 text-sm text-muted-foreground min-w-0">
                            <Home className="h-4 w-4 flex-shrink-0" />
                            <TooltipProvider>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <div key={breadcrumb.href} className="flex items-center min-w-0">
                                        {index > 0 && <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />}
                                        {breadcrumb.isId ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={breadcrumb.href}
                                                        className={`hover:text-foreground transition-colors truncate ${index === breadcrumbs.length - 1
                                                            ? 'text-foreground font-medium'
                                                            : 'text-muted-foreground'
                                                            }`}
                                                    >
                                                        {breadcrumb.name}
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>ID: {breadcrumb.original}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Link
                                                href={breadcrumb.href}
                                                className={`hover:text-foreground transition-colors truncate ${index === breadcrumbs.length - 1
                                                    ? 'text-foreground font-medium'
                                                    : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {breadcrumb.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </TooltipProvider>
                        </nav>
                    </div>

                    {/* Center Section - Search */}
                    <div className="flex items-center gap-4 flex-1 justify-center">
                        <GlobarSearch />
                    </div>

                    {/* Right Section - Actions & User */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                                    <Bell className="h-4 w-4" />
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                                    >
                                        3
                                    </Badge>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <div className="flex items-center justify-between p-2">
                                    <h4 className="font-semibold">Notifications</h4>
                                    <Badge variant="secondary">3</Badge>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                    <div className="font-medium">Check-in today</div>
                                    <div className="text-sm text-muted-foreground">2 guests checking in at Property A</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                    <div className="font-medium">Maintenance due</div>
                                    <div className="text-sm text-muted-foreground">Kitchen repair needed at Property B</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                    <div className="font-medium">Payment received</div>
                                    <div className="text-sm text-muted-foreground">KES 25,000 via M-Pesa</div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Settings */}
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" asChild>
                            <Link href="/dashboard/settings">
                                <Settings className="h-4 w-4" />
                            </Link>
                        </Button>

                        <ModeToggle />

                        <Separator orientation="vertical" className="h-6" />

                        {/* User Section */}
                        {isPending ? (
                            <Button variant="ghost" size="sm" disabled>
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </Button>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <CustomAvatarImage src={imageSrc} alt={userName} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{userName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/financial">Billing</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <SignInBtn />
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
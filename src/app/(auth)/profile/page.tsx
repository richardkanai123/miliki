import SignOutBtn from '@/components/authentication/SignOutBtn'
import { checkAuth } from '@/lib/checkAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    MailIcon,
    UserIcon,
    AtSignIcon,
    ClockIcon,
    SettingsIcon,
    ChevronRightIcon,
    CameraIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async () => {
    const session = await checkAuth()

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="p-4 text-center space-y-4">
                        <UserIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                            <h1 className="text-xl font-semibold">Not Authenticated</h1>
                            <p className="text-muted-foreground">Please log in to view your profile.</p>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/signin">Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const username = session.user.username
    const email = session.user.email
    const name = session.user.name
    const image = session.user.image as string
    const lastSeen = session.session.updatedAt

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="text-center pt-8 pb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4 pb-6">
                            <div className="relative group">
                                <div className="relative">
                                    <Image
                                        src={image}
                                        alt={name}
                                        width={120}
                                        height={120}
                                        className="rounded-full border-4 border-background shadow-lg"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <CameraIcon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-semibold">{name}</h2>
                                <Badge variant="secondary" className="text-xs">
                                    @{username}
                                </Badge>
                            </div>
                        </div>

                        <Separator className="mb-6" />

                        {/* Profile Information */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <AtSignIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                                    <p className="text-sm text-foreground font-mono">@{username}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <MailIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm text-foreground truncate">{email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-sm text-foreground">{name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <ClockIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                                    <p className="text-sm text-foreground">
                                        {new Date(lastSeen).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions Card */}
                <Card>
                    <CardContent className="p-4 space-y-2">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-between h-12"
                        >
                            <Link href="/settings">
                                <div className="flex items-center space-x-3">
                                    <SettingsIcon className="h-5 w-5" />
                                    <span>Account Settings</span>
                                </div>
                                <ChevronRightIcon className="h-4 w-4" />
                            </Link>
                        </Button>

                        <Separator />

                        <div className="pt-2">
                            <SignOutBtn />
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground pb-8">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
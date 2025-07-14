import SignOutBtn from '@/components/authentication/SignOutBtn'
import { checkAuth } from '@/lib/checkAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import UpdateProfile from '@/components/authentication/UpdateProfile'
import VerifyEmailButton from '@/components/authentication/VerifyEmailButton'

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

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto p-4 space-y-2">
                {/* Header */}
                <div className="text-center p-4">
                    <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <Card className="overflow-hidden">
                    <CardContent className="p-2">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-2 pb-6">
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
                            <div className="text-center flex flex-col items-center space-y-1">
                                <h2 className="text-xl font-semibold">{name}</h2>
                                <Badge variant="secondary" className="text-xs">
                                    @{username}
                                </Badge>

                                <VerifyEmailButton />
                            </div>
                        </div>

                        <Separator className="mb-4" />

                        {/* Profile Information */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <AtSignIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                                    <p className="text-sm text-foreground font-mono">@{username}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <MailIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm text-foreground truncate">{email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0">
                                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-sm text-foreground">{name}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions Card */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-medium">Actions</h3>
                    </CardHeader>
                    <CardContent className="w-full flex flex-wrap justify-center gap-4 items-center ">
                        <UpdateProfile />
                        <SignOutBtn />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePage
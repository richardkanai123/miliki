import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { CameraIcon, CheckIcon, MailWarning, ArrowRightIcon } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LogoutBtn from "./logout-btn"
import Link from "next/link"
import UpdateInformationDialog from "./update-information"

const ProfileComponent = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }

    const user = session.user

    const { name, email, role, image, banned, banReason, banExpires, emailVerified, createdAt } = user
    const { activeOrganizationId } = session.session
    const organizations = await auth.api.listOrganizations({
        headers: await headers(),
    });

    const activeOrganization = organizations?.find((org) => org.id === activeOrganizationId)


    // Split name into first and last name for display
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto">

            {/* Top Card: User Summary */}
            <Card className="w-full border-none shadow-sm bg-card">
                <CardContent className="w-full p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-background ring-2 ring-muted">
                            <Image
                                src={image || '/profile.jpg'}
                                alt={name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background p-1.5 shadow-sm border text-muted-foreground hover:text-primary transition-colors">
                            <CameraIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">{name}</h2>
                        <Badge className="rounded-xl" variant="default">
                            {role}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-1 items-end ">
                        <LogoutBtn />
                    </div>
                </CardContent>
            </Card>

            {/* Ban Information (if banned) */}
            {banned && (
                <Card className="border-destructive/50 bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            Account Suspended
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                                <p className="font-medium">{banReason || 'Violation of terms'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Expires</p>
                                <p className="font-medium">
                                    {banExpires ? new Date(banExpires).toLocaleDateString() : 'Indefinite'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Personal Information */}
            <Card className=" border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold text-primary">Personal Information</CardTitle>
                    <UpdateInformationDialog email={email} name={name} phoneNumber="0712345678" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">First Name</p>
                        <p className="font-medium">{firstName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Name</p>
                        <p className="font-medium">{lastName || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium break-all">{email} <span>{emailVerified ? <CheckIcon className="h-3 w-3 text-green-500" /> : <MailWarning className="h-3 w-3 text-yellow-500" />}</span> </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">0712345678</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">User Role</p>
                        <p className="font-medium">{role || 'User'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Joined</p>
                        <p className="font-medium">{new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </CardContent>
            </Card>

            {activeOrganization ? (
                <Card className=" border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg font-semibold text-primary">Active Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Link href={`/org/${activeOrganization.slug}`} className="w-full flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-primary/50 cursor-pointer hover:bg-primary/10 transition-colors">
                            <span className="text-xs text-muted-foreground">Click to view organization</span>
                            <span className="font-medium text-primary transition-colors">{activeOrganization.name}</span>
                        </Link>
                    </CardContent>
                </Card >
            ) :
                <Card className=" border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-primary">No Active Organization</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Link href="/organizations" className="bg-primary/50 max-w-md mx-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:text-primary transition-colors">Create Organization <ArrowRightIcon className="h-3 w-3" /></Link>
                    </CardContent>
                </Card>

            }


        </div >
    )
}

export default ProfileComponent

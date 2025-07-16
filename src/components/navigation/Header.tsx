'use client'
import { Loader2 } from "lucide-react"
import SignInBtn from "../authentication/SignInBtn"
import SignOutBtn from "../authentication/SignOutBtn"
import { ModeToggle } from "../theme-toggle"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import CustomAvatarImage from "./Avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
const Header = () => {
    const { data: session, isPending, error } = useSession()

    if (error) {
        return null
    }

    const imageSrc = session?.user?.image as string || "/favicon-32x32.png"

    return (
        <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 sticky top-0 z-40 w-full backdrop-blur-md border-b pb-2">
            <div className="w-full flex items-center gap-2 h-full  ">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-10"
                />
                <div className="mx-auto w-full px-2  flex  justify-between">
                    <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                        <Image src="/favicon-32x32.png" className="rounded-full hover:rotate-360 transition-all ease-in duration-500" alt="Miliki" width={32} height={32} />
                        Miliki
                    </Link>


                    <div className="flex items-center gap-2">
                        {
                            isPending ? (
                                <Button className="text-sm " disabled>
                                    <Loader2 className="size-4 animate-spin" />
                                </Button>
                            ) : (
                                session ? (
                                    <Link href='/profile' className="flex items-center gap-2 ">
                                        <CustomAvatarImage src={imageSrc} alt={session.user.name} />
                                    </Link>
                                ) : <SignInBtn />
                            )
                        }
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
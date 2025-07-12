'use client'
import { Loader2 } from "lucide-react"
import SignInBtn from "../authentication/SignInBtn"
import SignOutBtn from "../authentication/SignOutBtn"
import { ModeToggle } from "../theme-toggle"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
const Header = () => {
    const { data: session, isPending, error } = useSession()
    return (
        <header className="mx-auto w-full p-4 shadow-md backdrop-blur-md sticky top-0 left-0 right-0 z-50 flex  justify-between">
            <div className="">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                    <Image src="/favicon-32x32.png" className="rounded-full hover:rotate-360 transition-all ease-in duration-500" alt="Miliki" width={32} height={32} />
                    Miliki
                </Link>
            </div>


            <div className="flex items-center gap-2">
                <ModeToggle />
                {
                    isPending ? (
                        <Button className="text-sm " disabled>
                            <Loader2 className="size-4 animate-spin" />
                            Loading...
                        </Button>
                    ) : (
                        session ? <SignOutBtn /> : <SignInBtn />
                    )
                }
            </div>
        </header>
    )
}

export default Header
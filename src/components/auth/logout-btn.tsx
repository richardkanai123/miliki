'use client'

import { signOut } from "@/lib/auth-client"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LoaderIcon, LogOutIcon } from "lucide-react"
import { useTransition } from "react"

const LogoutBtn = () => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const handleLogout = async () => {
        startTransition(async () => {
            try {
                await signOut()
                toast.success("Bye, see you soon!")
                router.push("/login")
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
                toast.error("Unable to logout", {
                    description: errorMessage,
                })
            }
        })
    }

    return (
        <Button type="button" variant="destructive" onClick={handleLogout} className="mx-auto p-3 flex items-center justify-center gap-2 text-lg font-semibold group" >

            {isPending ? <LoaderIcon className="size-4 animate-spin" /> : <LogOutIcon className="size-4 group-hover:rotate-180 transition-all duration-300" />}
            {isPending ? "Logging out..." : "Logout"}
        </Button >
    )
}

export default LogoutBtn
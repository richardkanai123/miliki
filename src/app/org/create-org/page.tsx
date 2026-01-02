'use client'

import CreateOrgForm from "@/components/org/create-org-form"
import AuthRequired from "@/components/auth/auth-required"
import DefaultLoader from "@/components/skeletons/default-loader"
import { useSession } from "@/lib/auth-client"
import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"

const CreateOrgPage = () => {
    const { data: session, isPending, error } = useSession()

    if (isPending) return <DefaultLoader message="Loading..." />
    if (error) return null
    if (!session) {
        return <AuthRequired />
    }

    const userId = session.user.id

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <Suspense fallback={<div className="w-full max-w-md m-auto">
                <Loader2Icon className="size-6 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
                <p className="text-xs text-muted-foreground">This may take a few seconds</p>
            </div>}>
                <CreateOrgForm userId={userId} />
            </Suspense>
        </div >
    )
}

export default CreateOrgPage
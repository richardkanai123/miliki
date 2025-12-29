'use client'
import { Loader2Icon } from 'lucide-react'

const DefaultLoader = ({ message }: { message?: string }) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-card">
            <Loader2Icon className="size-6 animate-spin" />
            <p className="text-lg text-muted-foreground">{message || "Loading..."}</p>
            <p className="text-sm text-muted-foreground">This may take a few seconds</p>
        </div>
    )
}

export default DefaultLoader
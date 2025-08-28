import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 animate-pulse ease-in-out">
                <div className="h-4 w-24 bg-muted rounded-full " />
                <Loader2 className="mx-auto size-10 animate-spin" />
            </div>
            <div className="flex flex-col gap-2"></div>
        </div>

    )
}

export default loading
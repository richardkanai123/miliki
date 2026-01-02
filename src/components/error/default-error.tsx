'use client'

import { AlertCircle, RotateCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const DefaultErrorComponent = ({ message, reset, label = "Reset" }: { message: string, reset: () => void, label?: string }) => {
    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-md w-full shadow-lg bg-card border-destructive/20">
                <AlertCircle className="size-6 text-destructive" />
                <AlertTitle className="text-destructive font-semibold">Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p className="text-foreground/90 font-medium">An unexpected error occurred.</p>
                    <p className="text-muted-foreground text-sm wrap-break-word">{message}</p>
                    <div className="flex justify-end pt-2">
                        <Button
                            variant="default"
                            onClick={reset}
                            className="gap-2"
                        >
                            <RotateCw className="size-4" />
                            {label}
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default DefaultErrorComponent

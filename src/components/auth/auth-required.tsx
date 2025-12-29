'use client'
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { LogInIcon, ShieldAlertIcon } from "lucide-react"


const AuthRequired = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 h-[80vh]">
            <Card className="w-full max-w-sm shadow-md border-none bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-muted/50">
                            <ShieldAlertIcon className="size-8 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-xl">Authentication Required</CardTitle>
                    <CardDescription>
                        Please sign in to access this content.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button asChild className="w-full" size="lg">
                        <Link href="/login" className="flex items-center justify-center gap-2">
                            <LogInIcon className="size-4" />
                            Log in now
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div >
    )
}

export default AuthRequired
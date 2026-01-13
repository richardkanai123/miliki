'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LockKeyhole, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnauthorisedProps {
    link?: string
    message?: string
    solution?: string
    linkText?: string
}

const Unauthorised = ({
    link = "/",
    message = "You do not have permission to access this resource.",
    solution,
    linkText = "Return Home"
}: UnauthorisedProps) => {
    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-muted/40">
                <CardHeader className="text-center space-y-2 pb-2">
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
                        <ShieldAlert className="w-10 h-10 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Access Denied</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {message}
                    </p>
                    {solution && (
                        <div className="bg-muted/30 p-3 rounded-md border border-muted/50">
                            <p className="text-xs font-medium text-foreground/80 flex items-center justify-center gap-2">
                                <LockKeyhole className="w-3 h-3" />
                                {solution}
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-center pt-2 pb-6">
                    <Button asChild className="w-full sm:w-auto min-w-[140px] shadow-sm">
                        <Link href={link} className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            {linkText}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Unauthorised

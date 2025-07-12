'use client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, LogOut } from 'lucide-react'
import SignOutBtn from './SignOutBtn'
const LoggedUserDialog = ({ CurrentUserEmail, CurrentUserName }: { CurrentUserEmail: string, CurrentUserName: string }) => {
    return (
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl">Already Signed In</CardTitle>
                    <CardDescription>
                        You're currently logged in as <span className="font-medium text-foreground">{CurrentUserName || CurrentUserEmail}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild className="flex-1" variant="default">
                            <Link href="/" className="flex items-center justify-center gap-2">
                                <Home className="h-4 w-4" />
                                Go to Home
                            </Link>
                        </Button>

                        <SignOutBtn />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoggedUserDialog
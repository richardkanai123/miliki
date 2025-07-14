import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Mail, Clock, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const SuccessSentEmailPage = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Back to Sign In */}
                <div className="flex items-center">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/signin" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </Button>
                </div>

                <Card className="w-full">
                    <CardHeader className="text-center space-y-4">
                        {/* Logo */}
                        <div className="mx-auto">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <Image
                                    src="/playstore.png"
                                    alt="Miliki"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Success Icon */}
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-xl">Check Your Email</CardTitle>
                            <CardDescription className="text-center">
                                We've sent password reset instructions to your email address
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Email Info */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-2 p-4 bg-muted rounded-lg">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div className="text-center">
                                    <p className="text-sm font-medium">Email sent successfully!</p>
                                    <p className="text-xs text-muted-foreground">
                                        Check your inbox and spam folder
                                    </p>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">
                                        1
                                    </Badge>
                                    <div className="flex-1">
                                        <p className="text-sm">Check your email inbox</p>
                                        <p className="text-xs text-muted-foreground">
                                            Look for an email from Miliki
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">
                                        2
                                    </Badge>
                                    <div className="flex-1">
                                        <p className="text-sm">Click the reset link</p>
                                        <p className="text-xs text-muted-foreground">
                                            This will take you to the password reset page
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">
                                        3
                                    </Badge>
                                    <div className="flex-1">
                                        <p className="text-sm">Create your new password</p>
                                        <p className="text-xs text-muted-foreground">
                                            Choose a strong, secure password
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time Warning */}
                        <div className="flex items-center justify-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Reset link expires in 1 hour for security
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button asChild className="w-full">
                                <Link href="/signin">
                                    Return to Sign In
                                </Link>
                            </Button>

                            <div className="text-center">
                                <Button variant="link" size="sm" asChild>
                                    <Link href="/forgot-password" className="flex items-center gap-1">
                                        <RefreshCw className="h-3 w-3" />
                                        Didn't receive the email? Try again
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="text-center pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                Still having trouble?{" "}
                                <Link
                                    href="mailto:support@miliki.com"
                                    className="text-primary hover:underline"
                                >
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Help */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        Make sure to check your spam or junk folder if you don't see the email in your inbox.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SuccessSentEmailPage
'use client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutDashboardIcon, LogOut } from 'lucide-react'
import SignOutBtn from './SignOutBtn'
import { motion } from 'framer-motion'

const LoggedUserDialog = ({ CurrentUserEmail, CurrentUserName }: { CurrentUserEmail: string, CurrentUserName: string }) => {
    return (
        <div className="h-full flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    staggerChildren: 0.1
                }}
                className="w-full max-w-md"
            >
                <Card className="overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <CardHeader className="text-center relative">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" />

                            {/* Animated SVG */}
                            <motion.div
                                className="mx-auto mb-4 relative z-10"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.6,
                                    type: "spring",
                                    stiffness: 200
                                }}
                            >
                                <svg
                                    width="80"
                                    height="80"
                                    viewBox="0 0 80 80"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="drop-shadow-sm"
                                >
                                    {/* Outer Ring */}
                                    <motion.circle
                                        cx="40"
                                        cy="40"
                                        r="35"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        className="text-green-200 dark:text-green-800"
                                        initial={{ pathLength: 0, rotate: 0 }}
                                        animate={{ pathLength: 1, rotate: 360 }}
                                        transition={{
                                            pathLength: { duration: 1.5, delay: 0.5 },
                                            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                                        }}
                                    />

                                    {/* Success Background */}
                                    <motion.circle
                                        cx="40"
                                        cy="40"
                                        r="28"
                                        fill="currentColor"
                                        className="text-green-500 dark:text-green-600"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 300
                                        }}
                                    />

                                    {/* Checkmark */}
                                    <motion.path
                                        d="M28 40L36 48L52 32"
                                        stroke="white"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.6,
                                            ease: "easeInOut"
                                        }}
                                    />

                                    {/* Floating Particles */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.circle
                                            key={i}
                                            cx={25 + (i * 10)}
                                            cy={15}
                                            r="2"
                                            fill="currentColor"
                                            className="text-green-300 dark:text-green-700"
                                            initial={{ y: 0, opacity: 1 }}
                                            animate={{
                                                y: [-5, -15, -5],
                                                opacity: [1, 0.5, 1]
                                            }}
                                            transition={{
                                                delay: i * 0.2 + 1,
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </svg>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                className="relative z-10"
                            >
                                <CardTitle className="text-xl text-green-700 dark:text-green-300">
                                    Welcome Back!
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    You're signed in as{" "}
                                    <motion.span
                                        className="font-medium text-foreground bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md"
                                        initial={{ backgroundColor: "transparent" }}
                                        animate={{ backgroundColor: ["transparent", "currentColor", "transparent"] }}
                                        transition={{ delay: 1.2, duration: 1.5 }}
                                    >
                                        {CurrentUserName || CurrentUserEmail}
                                    </motion.span>
                                </CardDescription>
                            </motion.div>
                        </CardHeader>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                    >
                        <CardContent className="space-y-4 relative z-10">
                            {/* Status Indicator */}
                            <motion.div
                                className="flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 rounded-lg p-3"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.3 }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🟢
                                </motion.div>
                                <span className="font-medium">Session Active</span>
                            </motion.div>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.4 }}
                            >
                                <motion.div
                                    className="flex-1"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button asChild className="w-full" variant="default">
                                        <Link href="/dashboard" className="flex items-center justify-center gap-2">
                                            <LayoutDashboardIcon className="h-4 w-4" />
                                            Go to Dashboard
                                        </Link>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <SignOutBtn />
                                </motion.div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.4 }}
                                className="pt-4 border-t"
                            >
                                <p className="text-xs text-muted-foreground text-center mb-3">
                                    Quick Actions
                                </p>
                                <div className="flex justify-center gap-2 p-2">
                                    {[
                                        { href: "/profile", label: "Profile", emoji: "👤" },
                                        { href: "/dashboard/properties", label: "Properties", emoji: "🏠" },
                                    ].map((action, index) => (
                                        <motion.div
                                            key={action.href}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 0.75 }}
                                            transition={{ delay: 1.6 + index * 0.2, duration: 0.3 }}
                                        >
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={action.href} className="flex flex-col items-center gap-1 p-2">
                                                    <span className="text-lg">{action.emoji}</span>
                                                    <span className="text-xs">{action.label}</span>
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </CardContent>
                    </motion.div>
                </Card>
            </motion.div >
        </div >
    )
}

export default LoggedUserDialog
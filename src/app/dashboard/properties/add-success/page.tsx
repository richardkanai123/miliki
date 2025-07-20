'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LayoutDashboardIcon, Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const AddSuccessPage = () => {
    const queryParams = useSearchParams()
    const propertyTitle = queryParams.get('ptitle')
    const message = propertyTitle ? `Property: ${propertyTitle} was added successfully` : 'Property Added Successfully'

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-background/70 to-background/30  flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Card className="border-0 shadow-xl backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            {/* Success Icon with Animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    duration: 0.6,
                                    type: "spring",
                                    stiffness: 200
                                }}
                                className="mb-6"
                            >
                                <div className="relative mx-auto w-20 h-20">
                                    {/* Success SVG */}
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="w-full h-full"
                                    >
                                        {/* Background Circle */}
                                        <motion.circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.4, duration: 0.8 }}
                                        />

                                        {/* Checkmark */}
                                        <motion.path
                                            d="M30 50 L45 65 L70 35"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.8, duration: 0.6 }}
                                        />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Success Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="mb-6"
                            >
                                <h1 className="text-2xl font-bold mb-2">
                                    Success
                                </h1>
                                <p className="text-sm">
                                    {message}
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="space-y-3"
                            >
                                {/* View Dashboard Button */}
                                <Link href="/dashboard" className="block">
                                    <Button
                                        className="w-full hover:bg-accent text-white h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
                                        size="lg"
                                    >
                                        <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                                        Go to Dashboard
                                    </Button>
                                </Link>

                                {/* Add Another Property Button */}
                                <Link href="/dashboard/properties/add" className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-base font-medium border transition-all duration-200 hover:scale-[1.02]"
                                        size="lg"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Property
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Additional Info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                            >
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    You can manage your properties from the dashboard
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

export default AddSuccessPage
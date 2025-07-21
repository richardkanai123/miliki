'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    User,
    Phone,
    Mail,
    CreditCard,
    MapPin,
    UserPlus,
    Save,
    StickyNote,
    AlertTriangle,
    CheckCircle,
    Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { createGuestSchema, CreateGuestSchemaType } from '@/lib/schemas/NewGuestSchema'
import { useRouter } from 'next/navigation'

const AddGuestForm = () => {
    const router = useRouter()

    const form = useForm<CreateGuestSchemaType>({
        resolver: zodResolver(createGuestSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            idNumber: '',
            address: '',
            emergencyContact: '',
            notes: '',
            isActive: true,
        },
        mode: 'onChange',
    })

    const onSubmit = async (values: CreateGuestSchemaType) => {
        try {
            // Simulate API call - replace with actual action
            console.log('Submitting guest:', values)

            // const { message, success } = await AddGuest(values)
            // if (!success) {
            //     toast.error(message || 'Failed to create guest')
            //     return
            // }

            toast.success('Guest added successfully!')
            form.reset()
            router.push('/dashboard/guests')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(errorMessage)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            className="w-full mx-auto space-y-6 p-4 max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </motion.div>
                            <div>
                                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                                    Add New Guest
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    Create a new guest profile with contact and identification details
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information Section */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <CardTitle className="text-lg">Personal Information</CardTitle>
                                </div>
                                <CardDescription>
                                    Basic details about the guest
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Full Name *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter guest's full name"
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone Field */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    Phone Number *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        placeholder="+1234567890"
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email Field */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="guest@example.com"
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Optional - for sending booking confirmations
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* ID Number Field */}
                                    <FormField
                                        control={form.control}
                                        name="idNumber"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    ID Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="National ID or Passport number"
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    National ID, passport, or other identification number
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact & Address Section */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <CardTitle className="text-lg">Contact & Address Details</CardTitle>
                                </div>
                                <CardDescription>
                                    Address and emergency contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Address Field */}
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Home Address
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Enter guest's home address"
                                                    className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Guest's permanent or current address
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Emergency Contact Field */}
                                <FormField
                                    control={form.control}
                                    name="emergencyContact"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                Emergency Contact
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Name and phone number of emergency contact"
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Person to contact in case of emergency
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Additional Information Section */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <StickyNote className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <CardTitle className="text-lg">Additional Information</CardTitle>
                                </div>
                                <CardDescription>
                                    Optional notes and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Notes Field */}
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2">
                                                <StickyNote className="h-4 w-4" />
                                                Notes
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Any additional notes about the guest (preferences, special requirements, etc.)"
                                                    className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                    rows={4}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Special requirements, preferences, or other relevant information
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Active Status Field */}
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                                            <div className="space-y-0.5">
                                                <FormLabel className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Active Guest
                                                </FormLabel>
                                                <FormDescription>
                                                    Active guests can make new bookings
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-end gap-4 pt-4"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            Cancel
                        </Button>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="flex items-center gap-2 min-w-[140px]"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Adding Guest...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Add Guest
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    )
}

export default AddGuestForm
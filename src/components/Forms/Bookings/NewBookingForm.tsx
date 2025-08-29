'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Calendar,
    CalendarDays,
    Users,
    MapPin,
    CreditCard,
    User,
    Home,
    CalendarPlus,
    Save,
    Loader2,
    ArrowLeft,
    Clock,
    DollarSign,
    Check,
    ChevronsUpDown
} from 'lucide-react'
import { toast } from 'sonner'
import { NewBookingSchema, NewBookingSchemaType } from '@/lib/schemas/NewBookingSchema'
import { createBooking } from '@/lib/actions/bookings/CreateBooking'
import { Guest, Property } from '@/generated/prisma'

interface PricingUnit {
    unit: 'NIGHT' | 'WEEK' | 'MONTH';
    price: number;
    minDuration?: number;
    maxDuration?: number;
}

interface NewBookingFormProps {
    guests: Guest[];
    properties: Property[];
    pricingUnits?: PricingUnit[];
}

const NewBookingForm = ({ guests, properties, pricingUnits = [] }: NewBookingFormProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get initial values from search params
    const initialPropertyId = searchParams.get('property') || ''
    const initialGuestId = searchParams.get('guest') || ''

    // Combobox open states
    const [guestComboOpen, setGuestComboOpen] = React.useState(false)
    const [propertyComboOpen, setPropertyComboOpen] = React.useState(false)
    const [bookingUnitComboOpen, setBookingUnitComboOpen] = React.useState(false)
    const [statusComboOpen, setStatusComboOpen] = React.useState(false)

    const form = useForm<NewBookingSchemaType>({
        resolver: zodResolver(NewBookingSchema),
        defaultValues: {
            guestId: initialGuestId,
            propertyId: initialPropertyId,
            checkIn: new Date(),
            checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
            duration: 1,
            guestsCount: 1,
            bookingUnit: "NIGHT",
            totalPrice: 0,
            status: "PENDING",
            notes: "",
        },
        mode: 'onChange',
    })

    const { watch, setValue } = form
    const [checkIn, checkOut, duration, bookingUnit, propertyId] = watch([
        'checkIn', 'checkOut', 'duration', 'bookingUnit', 'propertyId'
    ])

    // Get selected property for pricing calculation
    const selectedProperty = useMemo(() => {
        return properties.find(p => p.id === propertyId)
    }, [properties, propertyId])

    // Calculate duration and price when dates change
    useEffect(() => {
        if (checkIn && checkOut) {
            const timeDiff = checkOut.getTime() - checkIn.getTime()
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

            if (daysDiff > 0) {
                let calculatedDuration = daysDiff
                let calculatedPrice = 0

                // Find applicable pricing unit
                const pricing = pricingUnits.find(p => p.unit === bookingUnit)
                if (pricing) {
                    switch (bookingUnit) {
                        case 'NIGHT':
                            calculatedDuration = daysDiff
                            calculatedPrice = calculatedDuration * pricing.price
                            break
                        case 'WEEK':
                            calculatedDuration = Math.ceil(daysDiff / 7)
                            calculatedPrice = calculatedDuration * pricing.price
                            break
                        case 'MONTH':
                            calculatedDuration = Math.ceil(daysDiff / 30)
                            calculatedPrice = calculatedDuration * pricing.price
                            break
                    }
                }

                // Add property fees if available
                if (selectedProperty) {
                    calculatedPrice += selectedProperty.cleaningFee + selectedProperty.serviceFee
                }

                setValue('duration', calculatedDuration)
                setValue('totalPrice', calculatedPrice)
            }
        }
    }, [checkIn, checkOut, bookingUnit, selectedProperty, pricingUnits, setValue])

    const onSubmit = async (values: NewBookingSchemaType) => {
        try {
            const { message, success } = await createBooking(values)
            if (!success) {
                toast.error(message || 'Failed to create booking')
                return
            }

            toast.success('Booking created successfully!')
            router.push('/dashboard/bookings')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(errorMessage)
        }
    }

    return (
        <motion.div
            className="w-full mx-auto space-y-6 p-4 max-w-4xl"
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <CalendarPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </motion.div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                                    Create New Booking
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    Schedule a new property booking for your guest
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.back()}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Guest & Property Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <CardTitle className="text-lg">Guest & Property Selection</CardTitle>
                                </div>
                                <CardDescription>
                                    Choose the guest and property for this booking
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Guest Selection */}
                                    <FormField
                                        control={form.control}
                                        name="guestId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Guest *
                                                </FormLabel>
                                                <Popover open={guestComboOpen} onOpenChange={setGuestComboOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={guestComboOpen}
                                                                className="w-full justify-between"
                                                            >
                                                                {field.value
                                                                    ? guests.find((guest) => guest.id === field.value)?.name
                                                                    : "Select a guest"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search guests..." className="h-9" />
                                                            <CommandList>
                                                                <CommandEmpty>No guest found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {guests.filter(g => g.isActive).map((guest) => (
                                                                        <CommandItem
                                                                            key={guest.id}
                                                                            value={guest.name}
                                                                            onSelect={() => {
                                                                                field.onChange(guest.id)
                                                                                setGuestComboOpen(false)
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center justify-between w-full">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="font-medium">{guest.name}</span>
                                                                                    <Badge variant="outline" className="text-xs">
                                                                                        {guest.phone}
                                                                                    </Badge>
                                                                                </div>
                                                                                <Check
                                                                                    className={`ml-auto h-4 w-4 ${guest.id === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                        }`}
                                                                                />
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Property Selection */}
                                    <FormField
                                        control={form.control}
                                        name="propertyId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Home className="h-4 w-4" />
                                                    Property *
                                                </FormLabel>
                                                <Popover open={propertyComboOpen} onOpenChange={setPropertyComboOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={propertyComboOpen}
                                                                className="w-full justify-between"
                                                            >
                                                                {field.value
                                                                    ? properties.find((property) => property.id === field.value)?.title
                                                                    : "Select a property"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search properties..." className="h-9" />
                                                            <CommandList>
                                                                <CommandEmpty>No property found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {properties.filter(p => p.status === 'AVAILABLE').map((property) => (
                                                                        <CommandItem
                                                                            key={property.id}
                                                                            value={`${property.title} ${property.location}`}
                                                                            onSelect={() => {
                                                                                field.onChange(property.id)
                                                                                setPropertyComboOpen(false)
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center justify-between w-full">
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span className="font-medium">{property.title}</span>
                                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                        <MapPin className="h-3 w-3" />
                                                                                        {property.location}
                                                                                    </div>
                                                                                </div>
                                                                                <Check
                                                                                    className={`ml-auto h-4 w-4 ${property.id === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                        }`}
                                                                                />
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Booking Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <CardTitle className="text-lg">Booking Details</CardTitle>
                                </div>
                                <CardDescription>
                                    Set the dates and booking preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Check-in Date */}
                                    <FormField
                                        control={form.control}
                                        name="checkIn"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" />
                                                    Check-in Date *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Check-out Date */}
                                    <FormField
                                        control={form.control}
                                        name="checkOut"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" />
                                                    Check-out Date *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Booking Unit */}
                                    <FormField
                                        control={form.control}
                                        name="bookingUnit"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Billing Unit
                                                </FormLabel>
                                                <Popover open={bookingUnitComboOpen} onOpenChange={setBookingUnitComboOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={bookingUnitComboOpen}
                                                                className="w-full justify-between"
                                                            >
                                                                {field.value === "NIGHT" && "Per Night"}
                                                                {field.value === "WEEK" && "Per Week"}
                                                                {field.value === "MONTH" && "Per Month"}
                                                                {!field.value && "Select billing unit"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandList>
                                                                <CommandGroup>
                                                                    <CommandItem
                                                                        value="night"
                                                                        onSelect={() => {
                                                                            field.onChange("NIGHT")
                                                                            setBookingUnitComboOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${field.value === "NIGHT" ? "opacity-100" : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        Per Night
                                                                    </CommandItem>
                                                                    <CommandItem
                                                                        value="week"
                                                                        onSelect={() => {
                                                                            field.onChange("WEEK")
                                                                            setBookingUnitComboOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${field.value === "WEEK" ? "opacity-100" : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        Per Week
                                                                    </CommandItem>
                                                                    <CommandItem
                                                                        value="month"
                                                                        onSelect={() => {
                                                                            field.onChange("MONTH")
                                                                            setBookingUnitComboOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${field.value === "MONTH" ? "opacity-100" : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        Per Month
                                                                    </CommandItem>
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Guests Count */}
                                    <FormField
                                        control={form.control}
                                        name="guestsCount"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Number of Guests
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Pricing & Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <CardTitle className="text-lg">Pricing & Status</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Duration (Auto-calculated) */}
                                    <FormField
                                        control={form.control}
                                        name="duration"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Duration
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Auto-calculated from dates
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Total Price */}
                                    <FormField
                                        control={form.control}
                                        name="totalPrice"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Total Price
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Including all fees
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Status */}
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Booking Status</FormLabel>
                                                <Popover open={statusComboOpen} onOpenChange={setStatusComboOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={statusComboOpen}
                                                                className="w-full justify-between"
                                                            >
                                                                {field.value === "PENDING" && "Pending"}
                                                                {field.value === "CONFIRMED" && "Confirmed"}
                                                                {field.value === "CHECKED_IN" && "Checked In"}
                                                                {!field.value && "Select status"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandList>
                                                                <CommandGroup>
                                                                    <CommandItem
                                                                        value="pending"
                                                                        onSelect={() => {
                                                                            field.onChange("PENDING")
                                                                            setStatusComboOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${field.value === "PENDING" ? "opacity-100" : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        Pending
                                                                    </CommandItem>
                                                                    <CommandItem
                                                                        value="confirmed"
                                                                        onSelect={() => {
                                                                            field.onChange("CONFIRMED")
                                                                            setStatusComboOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${field.value === "CONFIRMED" ? "opacity-100" : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        Confirmed
                                                                    </CommandItem>
                                                                    <CommandItem
                                                                        value="checked-in"
                                                                        onSelect={() => {
                                                                            field.onChange("CHECKED_IN")
                                                                            setStatusComboOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${field.value === "CHECKED_IN" ? "opacity-100" : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        Checked In
                                                                    </CommandItem>
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    This is the status of the booking.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Notes */}
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel>Additional Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Any special requirements or notes for this booking"
                                                    className="min-h-[80px]"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
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
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                                className="flex items-center gap-2 min-w-[140px]"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Add Booking
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

export default NewBookingForm

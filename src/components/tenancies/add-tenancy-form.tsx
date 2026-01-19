'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { createTenancySchema, type CreateTenancyFormValues, TenancyStatusEnum } from "@/lib/validations/create-tenancy-schema"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Loader2Icon,
    CalendarIcon,
    BanknoteIcon,
    UserIcon,
    HomeIcon,
    ChevronsUpDownIcon,
    CheckIcon,
    LayoutGridIcon,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { addTenancy } from "@/lib/dal/tenancies/add-tenancy"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import type { UnitForTenancy } from "@/lib/dal/tenancies/get-units-for-tenancy"
import type { MemberForTenancy } from "@/lib/dal/tenancies/get-members-for-tenancy"

interface AddTenancyFormProps {
    slug: string
    units: UnitForTenancy[]
    members: MemberForTenancy[]
}

const AddTenancyForm = ({ slug, units, members }: AddTenancyFormProps) => {
    const router = useRouter()
    const [unitOpen, setUnitOpen] = useState(false)
    const [memberOpen, setMemberOpen] = useState(false)
    const unitTriggerRef = useRef<HTMLButtonElement>(null)
    const memberTriggerRef = useRef<HTMLButtonElement>(null)

    const form = useForm<CreateTenancyFormValues>({
        resolver: zodResolver(createTenancySchema),
        defaultValues: {
            unitId: "",
            tenantId: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: "",
            monthlyRent: 0,
            depositAmount: undefined,
            depositPaid: false,
            billingDay: 1,
            status: "PENDING",
        },
        mode: "onChange",
        reValidateMode: 'onBlur'
    })

    const selectedUnit = form.watch("unitId")
    const selectedUnitData = units.find(u => u.id === selectedUnit)

    // Auto-fill rent and deposit amounts when unit is selected
    const handleUnitChange = (unitId: string) => {
        form.setValue("unitId", unitId)
        const unit = units.find(u => u.id === unitId)
        if (unit) {
            // Auto-fill monthly rent from unit
            form.setValue("monthlyRent", unit.rentAmount)

            // Auto-fill deposit amount from unit (if available), otherwise use rent as default
            if (unit.depositAmount !== null && unit.depositAmount > 0) {
                form.setValue("depositAmount", unit.depositAmount)
            } else if (unit.rentAmount > 0 && !form.getValues("depositAmount")) {
                // Fallback: Set deposit to 1 month rent as default
                form.setValue("depositAmount", unit.rentAmount)
            }
        }
    }

    const handleSubmit = async (data: CreateTenancyFormValues) => {
        try {
            const isValid = createTenancySchema.safeParse(data)
            if (!isValid.success) {
                const firstError = isValid.error.issues[0]
                toast.error(firstError?.message || "Please check the form for errors")
                return
            }

            const { message, success, tenancy } = await addTenancy(isValid.data)

            if (!success) {
                toast.error(message)
                return
            }

            if (!tenancy) {
                toast.error("Tenancy not found")
                return
            }

            form.reset()
            toast.success(message)
            router.push(`/org/${slug}/tenancies`)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred")
        }
    }

    return (
        <form id="create-tenancy-form" onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-7xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-12">

                {/* Header Section */}
                <div className="lg:col-span-12 space-y-1 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight">Add New Tenancy</h1>
                    <p className="text-muted-foreground">Fill in the details below to create a new tenancy agreement.</p>
                </div>

                {/* Left Column - Main Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Unit & Tenant Selection Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <LayoutGridIcon className="h-5 w-5" />
                                Unit & Tenant Selection
                            </CardTitle>
                            <CardDescription>
                                Select the unit and tenant for this tenancy agreement.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Controller
                                    name="unitId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="tenancy-unit">
                                                Unit <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="tenancy-unit"
                                                        ref={unitTriggerRef}
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={unitOpen}
                                                        aria-invalid={fieldState.invalid}
                                                        disabled={!units?.length}
                                                        className={cn(
                                                            "w-full justify-between h-10 bg-muted/30",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <HomeIcon className="h-4 w-4 text-muted-foreground" />
                                                            <span className="truncate">
                                                                {!units?.length
                                                                    ? "No units available"
                                                                    : field.value
                                                                        ? `${selectedUnitData?.property.name} - ${selectedUnitData?.title}`
                                                                        : "Select a unit"}
                                                            </span>
                                                        </span>
                                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[400px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search units..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {units?.length ? "No unit found." : "No units available."}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {units?.map((unit) => (
                                                                    <CommandItem
                                                                        key={unit.id}
                                                                        value={`${unit.property.name} ${unit.title} ${unit.id}`}
                                                                        onSelect={() => {
                                                                            handleUnitChange(unit.id)
                                                                            setUnitOpen(false)
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium">{unit.title}</span>
                                                                            <span className="text-xs text-muted-foreground">{unit.property.name}</span>
                                                                        </div>
                                                                        {field.value === unit.id && <CheckIcon className="ml-auto h-4 w-4" />}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="tenantId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="tenancy-tenant">
                                                Tenant <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Popover open={memberOpen} onOpenChange={setMemberOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="tenancy-tenant"
                                                        ref={memberTriggerRef}
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={memberOpen}
                                                        aria-invalid={fieldState.invalid}
                                                        disabled={!members?.length}
                                                        className={cn(
                                                            "w-full justify-between h-10 bg-muted/30",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                            <span className="truncate">
                                                                {!members?.length
                                                                    ? "No members available"
                                                                    : field.value
                                                                        ? members?.find((member) => member.id === field.value)?.name
                                                                        : "Select a tenant"}
                                                            </span>
                                                        </span>
                                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search tenants..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {members?.length ? "No tenant found." : "No members available."}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {members?.map((member) => (
                                                                    <CommandItem
                                                                        key={member.id}
                                                                        value={`${member.name} ${member.id}`}
                                                                        onSelect={() => {
                                                                            field.onChange(member.id)
                                                                            setMemberOpen(false)
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium">{member.name}</span>
                                                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                                                        </div>
                                                                        {field.value === member.id && <CheckIcon className="ml-auto h-4 w-4" />}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tenancy Terms Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CalendarIcon className="h-5 w-5" />
                                Tenancy Terms
                            </CardTitle>
                            <CardDescription>
                                Set the start and end dates for the tenancy period.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Controller
                                    name="startDate"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="start-date">
                                                Start Date <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value as string}
                                                type="date"
                                                id="start-date"
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="endDate"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="end-date">
                                                End Date <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value as string}
                                                type="date"
                                                id="end-date"
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Financials & Status */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Financials Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BanknoteIcon className="h-4 w-4" />
                                Financials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Controller
                                name="monthlyRent"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="monthly-rent">
                                            Monthly Rent <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <div className="relative flex items-center justify-center align-middle">
                                            <span className="absolute left-3 top-[50%] translate-y-[-50%] text-sm font-medium text-muted-foreground">KES</span>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="100"
                                                value={(field.value ?? "") as string | number}
                                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                                                className="pl-12 font-medium bg-muted/30"
                                            />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="depositAmount"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="deposit">Security Deposit</FieldLabel>
                                        <div className="relative">
                                            <span className="absolute left-3 top-[50%] translate-y-[-50%] text-sm font-medium text-muted-foreground">KES</span>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="100"
                                                value={(field.value ?? "") as string | number}
                                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                                                className="pl-12 bg-muted/30"
                                            />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="depositPaid"
                                control={form.control}
                                render={({ field }) => (
                                    <Field className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FieldLabel className="text-sm font-medium">Deposit Paid</FieldLabel>
                                            <p className="text-xs text-muted-foreground">Mark if deposit received</p>
                                        </div>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="billingDay"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="billing-day">Billing Day</FieldLabel>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={1}
                                            max={28}
                                            value={(field.value ?? "") as string | number}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                                            className="bg-muted/30"
                                        />
                                        <p className="text-xs text-muted-foreground">Day of month rent is due (1-28)</p>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarIcon className="h-4 w-4" />
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Controller
                                name="status"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="bg-muted/30">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TenancyStatusEnum.options.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 sticky bottom-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full shadow-lg"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Tenancy...
                                </>
                            ) : (
                                "Create Tenancy"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => router.back()}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>

                    {form.formState.errors.root?.serverError && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <FieldError errors={[form.formState.errors.root.serverError]} className="text-sm text-destructive font-medium">
                                {form.formState.errors.root.serverError.message}
                            </FieldError>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}

export default AddTenancyForm

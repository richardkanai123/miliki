'use client'

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { updatePropertySchema, type UpdatePropertyFormValues } from "@/lib/validations/update-property-schema"
import { PropertyTypeEnum } from "@/lib/validations/create-property-schema"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"
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
    Building2Icon,
    MapPinIcon,
    ImageIcon,
    UserIcon,
    ChevronsUpDownIcon,
    CheckIcon,
    ChevronLeft,
    LayoutGridIcon,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { kenyaCounties } from "@/lib/counties"
import { updateProperty } from "@/lib/dal/properties/update-property"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { PropertyDetails } from "@/lib/dal/properties/get-property-details"

interface Manager {
    id: string
    name: string
    image: string
}

interface EditPropertyFormProps {
    property: NonNullable<PropertyDetails>
    slug: string
    managers?: Manager[]
}

const EditPropertyForm = ({ property, slug, managers }: EditPropertyFormProps) => {
    const [managerOpen, setManagerOpen] = useState(false)
    const router = useRouter()
    const managerTriggerRef = useRef<HTMLButtonElement>(null)

    const form = useForm<UpdatePropertyFormValues>({
        resolver: zodResolver(updatePropertySchema),
        defaultValues: {
            name: property.name,
            description: property.description ?? "",
            address: property.address,
            city: property.city,
            county: property.county as UpdatePropertyFormValues['county'],
            postalCode: property.postalCode ?? "",
            type: property.type as UpdatePropertyFormValues['type'],
            images: property.images ?? [],
            managerId: property.managerId ?? undefined,
            isActive: property.isActive,
        },
        mode: "onChange",
        reValidateMode: 'onBlur'
    })

    const handleSubmit = async (data: UpdatePropertyFormValues) => {
        try {
            const isValid = updatePropertySchema.safeParse(data)
            if (!isValid.success) {
                const firstError = isValid.error.issues[0]
                toast.error(firstError?.message || "Please check the form for errors")
                return
            }
            const { message, success } = await updateProperty(property.id, isValid.data)

            if (!success) {
                toast.error(message)
                return
            }

            toast.success(message)
            router.push(`/org/${slug}/properties/${property.id}`)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "An unknown error occurred")
        }
    }

    return (
        <form id="edit-property-form" onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-7xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-12">

                {/* Header Section */}
                <div className="lg:col-span-12 space-y-4">
                    <Button variant="ghost" size="sm" asChild className="-ml-2">
                        <Link href={`/org/${slug}/properties/${property.id}`}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Property
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
                        <p className="text-muted-foreground">Update the details for {property.name}.</p>
                    </div>
                </div>

                {/* Left Column - Main Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* General Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <LayoutGridIcon className="h-5 w-5" />
                                General Information
                            </CardTitle>
                            <CardDescription>
                                Basic details and description of the property.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="edit-property-name">
                                                Property Name <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <div className="relative">
                                                <Building2Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    {...field}
                                                    id="edit-property-name"
                                                    placeholder="e.g. Sunset Apartments"
                                                    className="pl-9 bg-muted/30"
                                                />
                                            </div>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="edit-property-type">Property Type</FieldLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger id="edit-property-type" className="bg-muted/30">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PropertyTypeEnum.options.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="edit-property-description">
                                            Description <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="edit-property-description"
                                            placeholder="What makes this property special? Add amenities, neighborhood highlights..."
                                            className="min-h-[100px] resize-none bg-muted/30"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Location Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPinIcon className="h-5 w-5" />
                                Location Details
                            </CardTitle>
                            <CardDescription>
                                Add an address so tenants can find the property easily.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Controller
                                name="address"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="edit-property-address">
                                            Street Address <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <div className="relative">
                                            <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                id="edit-property-address"
                                                placeholder="e.g. 123 Main Street"
                                                className="pl-9 bg-muted/30"
                                            />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Controller
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="edit-property-city">
                                                City <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="edit-property-city"
                                                placeholder="e.g. Nairobi"
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="county"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="edit-property-county">
                                                County <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger id="edit-property-county" className="bg-muted/30">
                                                    <SelectValue placeholder="Select county" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kenyaCounties.map((county) => (
                                                        <SelectItem key={county} value={county}>
                                                            {county}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Controller
                                    name="postalCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="edit-property-postal-code">
                                                Postal Code <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                id="edit-property-postal-code"
                                                placeholder="e.g. 00100"
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="h-5 w-5" />
                                Media
                            </CardTitle>
                            <CardDescription>
                                Upload photos of the property.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-muted-foreground/15 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors">
                                <div className="rounded-full bg-background p-4 shadow-sm">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium">Drag & drop images here</p>
                                    <p className="text-xs text-muted-foreground">or click to browse</p>
                                </div>
                                <Button variant="outline" size="sm" disabled type="button">
                                    Select Files
                                </Button>
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    Upload feature coming soon
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Management & Settings */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Management Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserIcon className="h-4 w-4" />
                                Property Manager
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Controller
                                name="managerId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <Popover open={managerOpen} onOpenChange={setManagerOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="edit-property-manager"
                                                    ref={managerTriggerRef}
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={managerOpen}
                                                    aria-invalid={fieldState.invalid}
                                                    disabled={!managers?.length}
                                                    className={cn(
                                                        "w-full justify-between h-10 bg-muted/30",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="truncate">
                                                            {!managers?.length
                                                                ? "No managers available"
                                                                : field.value
                                                                    ? managers?.find((manager) => manager.id === field.value)?.name
                                                                    : "Select a manager"}
                                                        </span>
                                                    </span>
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search managers..." className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            {managers?.length ? "No manager found." : "No managers available."}
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value="__unassigned__"
                                                                onSelect={() => {
                                                                    field.onChange(undefined)
                                                                    setManagerOpen(false)
                                                                }}
                                                            >
                                                                No manager (unassigned)
                                                                {field.value === undefined && <CheckIcon className="ml-auto h-4 w-4" />}
                                                            </CommandItem>
                                                            {managers?.map((manager) => (
                                                                <CommandItem
                                                                    key={manager.id}
                                                                    value={`${manager.name} ${manager.id}`}
                                                                    onSelect={() => {
                                                                        field.onChange(manager.id)
                                                                        setManagerOpen(false)
                                                                    }}
                                                                >
                                                                    {manager.name}
                                                                    {field.value === manager.id && <CheckIcon className="ml-auto h-4 w-4" />}
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
                        </CardContent>
                    </Card>

                    {/* Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2 text-base">
                                <div className="flex items-center gap-2">
                                    <Building2Icon className="h-4 w-4" />
                                    Property Status
                                </div>
                                <Controller
                                    name="isActive"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </CardTitle>
                            <CardDescription>
                                Toggle to activate or deactivate this property. Inactive properties are hidden.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 sticky bottom-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full shadow-lg"
                            disabled={form.formState.isSubmitting || !form.formState.isDirty}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                "Save Changes"
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

export default EditPropertyForm

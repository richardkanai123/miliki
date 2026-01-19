'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { updateUnitSchema, type UpdateUnitFormValues } from "@/lib/validations/update-unit-schema"
import { UnitStatusEnum, UnitTypeEnum } from "@/lib/validations/create-unit-schema"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Loader2Icon,
    HomeIcon,
    RulerIcon,
    BanknoteIcon,
    MapPinIcon,
    ImageIcon,
    MegaphoneIcon,
    LayoutGridIcon,
    ChevronLeft,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { updateUnit } from "@/lib/dal/units/update-unit"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import type { UnitDetails } from "@/lib/dal/units/get-unit"

interface EditUnitFormProps {
    unit: NonNullable<UnitDetails>
    slug: string
}

const EditUnitForm = ({ unit, slug }: EditUnitFormProps) => {
    const router = useRouter()

    const form = useForm<UpdateUnitFormValues>({
        resolver: zodResolver(updateUnitSchema),
        defaultValues: {
            title: unit.title,
            description: unit.description ?? "",
            rentAmount: unit.rentAmount,
            depositAmount: unit.depositAmount ?? undefined,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            squareMeters: unit.squareMeters ?? undefined,
            locationInProperty: unit.locationInProperty ?? "",
            status: unit.status as UpdateUnitFormValues['status'],
            type: unit.type as UpdateUnitFormValues['type'],
            isListed: unit.isListed,
            listingTitle: unit.listingTitle ?? "",
            listingDescription: unit.listingDescription ?? "",
            images: unit.images ?? [],
        },
        mode: "onChange",
        reValidateMode: 'onBlur'
    })

    const handleSubmit = async (data: UpdateUnitFormValues) => {
        try {
            const isValid = updateUnitSchema.safeParse(data)
            if (!isValid.success) {
                const firstError = isValid.error.issues[0]
                toast.error(firstError?.message || "Please check the form for errors")
                return
            }

            const { message, success } = await updateUnit(unit.id, isValid.data)

            if (!success) {
                toast.error(message)
                return
            }

            toast.success(message)
            router.push(`/org/${slug}/properties/${unit.propertyId}/units/${unit.id}`)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred")
        }
    }

    const isListed = form.watch("isListed")

    return (
        <form id="edit-unit-form" onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-7xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-12">

                {/* Header Section */}
                <div className="lg:col-span-12 space-y-4">
                    <Button variant="ghost" size="sm" asChild className="-ml-2">
                        <Link href={`/org/${slug}/properties/${unit.propertyId}/units/${unit.id}`}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Unit
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Edit Unit</h1>
                        <p className="text-muted-foreground">Update the details for {unit.title}</p>
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
                                Basic details and description of the unit.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="unit-title">
                                                Unit Title/Number <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="unit-title"
                                                placeholder="e.g. Apt 4B, Unit 101"
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="unit-type">Unit Type</FieldLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="bg-muted/30">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {UnitTypeEnum.options.map((type) => (
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
                                        <FieldLabel htmlFor="unit-description">
                                            Description <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="unit-description"
                                            placeholder="Internal notes or details about this unit..."
                                            className="min-h-[100px] resize-none bg-muted/30"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Specifications Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <RulerIcon className="h-5 w-5" />
                                Specifications & Location
                            </CardTitle>
                            <CardDescription>
                                Physical attributes and location within the property.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-3">
                                <Controller
                                    name="bedrooms"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={0}
                                                value={(field.value ?? "") as string | number}
                                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="bathrooms"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={0}
                                                value={(field.value ?? "") as string | number}
                                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="squareMeters"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="sqm">Square Meters</FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                value={(field.value ?? "") as string | number}
                                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="locationInProperty"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="location">Location Detail</FieldLabel>
                                        <div className="relative">
                                            <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="e.g. 2nd Floor, Block A, North Wing"
                                                className="pl-9 bg-muted/30"
                                            />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
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
                                Upload photos of the unit.
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

                {/* Right Column - Financials & Status */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <HomeIcon className="h-4 w-4" />
                                Occupancy Status
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
                                                {UnitStatusEnum.options.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`h-2 w-2 rounded-full ${status === 'VACANT' ? 'bg-emerald-500' :
                                                                status === 'OCCUPIED' ? 'bg-blue-500' :
                                                                    status === 'MAINTENANCE' ? 'bg-amber-500' : 'bg-gray-500'
                                                                }`} />
                                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                                        </div>
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

                    {/* Financials Card */}
                    <Card className="overflow-hidden border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BanknoteIcon className="h-4 w-4" />
                                Financials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <Controller
                                name="rentAmount"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="space-y-2">
                                        <FieldLabel htmlFor="rent">Monthly Rent <span className="text-destructive">*</span></FieldLabel>
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

                            <Separator />

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
                        </CardContent>
                    </Card>

                    {/* Listing Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2 text-base">
                                <div className="flex items-center gap-2">
                                    <MegaphoneIcon className="h-4 w-4" />
                                    Public Listing
                                </div>
                                <Controller
                                    name="isListed"
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
                                Toggle to list this unit on the public site.
                            </CardDescription>
                        </CardHeader>
                        {isListed && (
                            <CardContent className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Controller
                                    name="listingTitle"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="listing-title">Listing Title <span className="text-destructive">*</span></FieldLabel>
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="e.g. Spacious 2-Bedroom with View"
                                                className="bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="listingDescription"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="listing-desc">Public Description</FieldLabel>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="Marketing description for potential tenants..."
                                                className="min-h-[100px] resize-none bg-muted/30"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </CardContent>
                        )}
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

export default EditUnitForm

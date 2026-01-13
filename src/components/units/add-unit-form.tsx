'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { createUnitSchema, type CreateUnitFormValues, UnitStatusEnum, UnitTypeEnum } from "@/lib/validations/create-unit-schema"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldLegend,
    FieldSeparator,
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
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { addUnit } from "@/lib/dal/units/add-unit"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import z from "zod"

interface AddUnitFormProps {
    propertyId: string
    slug: string
}

const AddUnitForm = ({ propertyId, slug }: AddUnitFormProps) => {
    const router = useRouter()

    const form = useForm<CreateUnitFormValues>({
        resolver: zodResolver(createUnitSchema),
        defaultValues: {
            title: "",
            description: "",
            rentAmount: 0,
            depositAmount: 0,
            bedrooms: 1,
            bathrooms: 1,
            squareMeters: undefined,
            locationInProperty: "",
            status: "VACANT",
            isListed: false,
            listingTitle: "",
            listingDescription: "",
            images: [],
        },
        mode: "onChange",
        reValidateMode: 'onBlur'
    })

    const handleSubmit = async (data: z.input<typeof createUnitSchema>) => {
        try {

            if (!propertyId) {
                toast.error("Property ID is required to add a unit")
                return
            }

            const isValid = createUnitSchema.safeParse(data)
            if (!isValid.success) {
                // Better error handling - show first error message
                const firstError = isValid.error.issues[0]
                toast.error(firstError?.message || "Please check the form for errors")
                return
            }

            // We pass the parsed data (which includes default values from schema)
            const { message, success, unit } = await addUnit(isValid.data, propertyId)

            if (!success) {
                toast.error(message)
                return
            }

            if (!unit) {
                toast.error("Unit not found")
                return
            }

            form.reset()
            toast.success(message)
            router.push(`/org/${slug}/properties/${propertyId}/units/${unit.id}`)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred")
        }
    }

    // Watch isListed to conditionally show listing fields
    const isListed = form.watch("isListed")

    return (
        <Card className="w-full shadow-lg border-muted/20 ">
            <CardHeader className="space-y-2 border-b bg-muted/20">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Add a new unit
                        </CardTitle>
                        <CardDescription>
                            Add a new unit for current property. Fields marked with <span className="text-destructive">*</span> are required.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form id="create-unit-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FieldGroup className="gap-8">
                        {/* Basic Information */}
                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <HomeIcon className="h-4 w-4 text-muted-foreground" />
                                Basic Information
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Essential details about the unit.
                            </FieldDescription>
                            <FieldGroup className="mt-6">
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="unit-title" className="text-sm font-medium">
                                                Unit Title/Number <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="unit-title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="e.g. Apt 4B, Unit 101"
                                                className="h-10"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} className="text-sm" />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="unit-description" className="text-sm font-medium">
                                                Description <span className="text-muted-foreground font-normal">(optional)</span>
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                id="unit-description"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Add details about this specific unit..."
                                                className="min-h-[80px] resize-none"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} className="text-sm" />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="unit-type" className="text-sm font-medium">
                                                Unit Type
                                            </FieldLabel>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                aria-invalid={fieldState.invalid}
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Select unit type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {UnitTypeEnum.options.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} className="text-sm" />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>

                        <FieldSeparator>Specifications</FieldSeparator>

                        {/* Specifications */}
                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <RulerIcon className="h-4 w-4 text-muted-foreground" />
                                Specifications
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Physical attributes of the unit.
                            </FieldDescription>
                            <FieldGroup className="mt-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <Controller
                                        name="bedrooms"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            const { value, onChange, ...fieldProps } = field
                                            return (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="unit-bedrooms" className="text-sm font-medium">
                                                        Bedrooms
                                                    </FieldLabel>
                                                    <Input
                                                        {...fieldProps}
                                                        type="number"
                                                        min={0}
                                                        value={(value ?? "") as string | number}
                                                        onChange={(e) => {
                                                            const val = e.target.value === "" ? undefined : e.target.value
                                                            onChange(val as any)
                                                        }}
                                                        id="unit-bedrooms"
                                                        aria-invalid={fieldState.invalid}
                                                        className="h-10"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <Controller
                                        name="bathrooms"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            const { value, onChange, ...fieldProps } = field
                                            return (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="unit-bathrooms" className="text-sm font-medium">
                                                        Bathrooms
                                                    </FieldLabel>
                                                    <Input
                                                        {...fieldProps}
                                                        type="number"
                                                        min={0}
                                                        value={(value ?? "") as string | number}
                                                        onChange={(e) => {
                                                            const val = e.target.value === "" ? undefined : e.target.value
                                                            onChange(val as any)
                                                        }}
                                                        id="unit-bathrooms"
                                                        aria-invalid={fieldState.invalid}
                                                        className="h-10"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <Controller
                                        name="squareMeters"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            const { value, onChange, ...fieldProps } = field
                                            return (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="unit-sqm" className="text-sm font-medium">
                                                        Square Meters <span className="text-muted-foreground font-normal">(optional)</span>
                                                    </FieldLabel>
                                                    <Input
                                                        {...fieldProps}
                                                        value={(value ?? "") as string | number}
                                                        type="number"
                                                        step="0.01"
                                                        onChange={(e) => {
                                                            const val = e.target.value === "" ? undefined : e.target.value
                                                            onChange(val as any)
                                                        }}
                                                        id="unit-sqm"
                                                        aria-invalid={fieldState.invalid}
                                                        className="h-10"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                </div>
                            </FieldGroup>
                        </FieldSet>

                        <FieldSeparator>Financials & Location</FieldSeparator>

                        {/* Financials & Location */}
                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                                Financials & Location
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Rent details and specific location within the property.
                            </FieldDescription>
                            <FieldGroup className="mt-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Controller
                                        name="rentAmount"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            const { value, onChange, ...fieldProps } = field
                                            return (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="unit-rent" className="text-sm font-medium">
                                                        Rent Amount <span className="text-destructive">*</span>
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                                                        <Input
                                                            {...fieldProps}
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            value={(value ?? "") as string | number}
                                                            onChange={(e) => {
                                                                const val = e.target.value === "" ? undefined : e.target.value
                                                                onChange(val as any)
                                                            }}
                                                            id="unit-rent"
                                                            aria-invalid={fieldState.invalid}
                                                            className="pl-12 h-10"
                                                        />
                                                    </div>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <Controller
                                        name="depositAmount"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            const { value, onChange, ...fieldProps } = field
                                            return (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="unit-deposit" className="text-sm font-medium">
                                                        Deposit Amount <span className="text-muted-foreground font-normal">(optional)</span>
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                                                        <Input
                                                            {...fieldProps}
                                                            value={(value ?? "") as string | number}
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            onChange={(e) => {
                                                                const val = e.target.value === "" ? undefined : e.target.value
                                                                onChange(val as any)
                                                            }}
                                                            id="unit-deposit"
                                                            aria-invalid={fieldState.invalid}
                                                            className="pl-12 h-10"
                                                        />
                                                    </div>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                </div>

                                <Controller
                                    name="locationInProperty"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="unit-location" className="text-sm font-medium">
                                                Location in Property <span className="text-muted-foreground font-normal">(optional)</span>
                                            </FieldLabel>
                                            <div className="relative">
                                                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    {...field}
                                                    id="unit-location"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="e.g. 2nd Floor, Block A"
                                                    className="pl-9 h-10"
                                                />
                                            </div>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} className="text-sm" />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>

                        <FieldSeparator>Status & Listing</FieldSeparator>

                        {/* Status & Listing */}
                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <HomeIcon className="h-4 w-4 text-muted-foreground" />
                                Status & Listing
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Current occupancy status and public listing settings.
                            </FieldDescription>
                            <FieldGroup className="mt-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Controller
                                        name="status"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                <FieldLabel htmlFor="unit-status" className="text-sm font-medium">
                                                    Status
                                                </FieldLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="unit-status" className="w-full h-10">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {UnitStatusEnum.options.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="isListed"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Field orientation="horizontal" className="gap-3 rounded-lg border bg-muted/20 p-4 items-start">
                                                <FieldContent className="gap-1">
                                                    <FieldLabel htmlFor="unit-listed" className="font-medium">
                                                        Public Listing
                                                    </FieldLabel>
                                                    <FieldDescription>
                                                        Enable to display this unit in public search results. (optional)
                                                    </FieldDescription>
                                                </FieldContent>
                                                <Switch
                                                    id="unit-listed"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="mt-1"
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>

                                {isListed && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <Controller
                                            name="listingTitle"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="listing-title" className="text-sm font-medium">
                                                        Listing Title <span className="text-destructive">*</span>
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ""}
                                                        id="listing-title"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Catchy title for the listing"
                                                        className="h-10"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="listingDescription"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                    <FieldLabel htmlFor="listing-description" className="text-sm font-medium">
                                                        Listing Description
                                                    </FieldLabel>
                                                    <Textarea
                                                        {...field}
                                                        value={field.value || ""}
                                                        id="listing-description"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Detailed description for the public listing..."
                                                        className="min-h-[110px] resize-none"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                )}
                            </FieldGroup>
                        </FieldSet>

                        <FieldSeparator>Media</FieldSeparator>

                        {/* Media */}
                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                Media
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Add photos of the unit.
                            </FieldDescription>
                            <FieldGroup className="mt-6">
                                <Controller
                                    name="images"
                                    control={form.control}
                                    render={() => (
                                        <Field className="space-y-2">
                                            <FieldLabel className="text-sm font-medium flex items-center gap-2">
                                                Unit Images <span className="text-muted-foreground font-normal">(optional)</span>
                                            </FieldLabel>
                                            <div className="border border-dashed border-muted-foreground/25 rounded-lg p-6 md:p-8 flex flex-col items-center justify-center gap-2 bg-muted/20">
                                                <div className="rounded-full border bg-background p-3">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium text-center">
                                                    Image uploads coming soon
                                                </p>
                                                <p className="text-xs text-muted-foreground text-center max-w-md">
                                                    You will be able to add photos here. For now, create the unit and upload images later.
                                                </p>
                                            </div>
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>

                        {form.formState.errors.root?.serverError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <FieldError errors={[form.formState.errors.root.serverError]} className="text-sm text-destructive font-medium">
                                    {form.formState.errors.root.serverError.message}
                                </FieldError>
                            </div>
                        )}
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="gap-3 flex-col md:flex-row md:justify-end sticky bottom-0 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
                <Button
                    disabled={form.formState.isSubmitting}
                    size="lg"
                    type="submit"
                    form="create-unit-form"
                    className="w-full md:w-auto md:min-w-48"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Adding unit...
                        </>
                    ) : (
                        "Add Unit"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default AddUnitForm

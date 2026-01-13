'use client'
import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { createPropertySchema, type CreatePropertyFormValues } from "@/lib/validations/create-property-schema"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { kenyaCounties } from "@/lib/counties"
import { addProperty } from "@/lib/dal/properties/add-property"
import { toast } from "sonner"
import { usePathname, useRouter } from "next/navigation"

interface Manager {
    id: string
    name: string
    image: string
}

interface CreatePropertyFormProps {
    managers?: Manager[]
}

const CreatePropertyForm = ({ managers }: CreatePropertyFormProps) => {
    // const [orgOpen, setOrgOpen] = useState(false)
    const [managerOpen, setManagerOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    // const orgTriggerRef = useRef<HTMLButtonElement>(null)
    const managerTriggerRef = useRef<HTMLButtonElement>(null)
    // const [orgPopoverWidth, setOrgPopoverWidth] = useState<number>()
    // const [managerPopoverWidth, setManagerPopoverWidth] = useState<number>()

    // useEffect(() => {
    //     const updateOrgWidth = () => {
    //         const el = orgTriggerRef.current
    //         if (!el) return
    //         setOrgPopoverWidth(Math.ceil(el.getBoundingClientRect().width))
    //     }
    //     updateOrgWidth()

    //     if (!orgTriggerRef.current || typeof ResizeObserver === "undefined") return
    //     const ro = new ResizeObserver(() => updateOrgWidth())
    //     ro.observe(orgTriggerRef.current)
    //     return () => ro.disconnect()
    // }, [])

    // useEffect(() => {
    //     const updateManagerWidth = () => {
    //         const el = managerTriggerRef.current
    //         if (!el) return
    //         setManagerPopoverWidth(Math.ceil(el.getBoundingClientRect().width))
    //     }
    //     updateManagerWidth()

    //     if (!managerTriggerRef.current || typeof ResizeObserver === "undefined") return
    //     const ro = new ResizeObserver(() => updateManagerWidth())
    //     ro.observe(managerTriggerRef.current)
    //     return () => ro.disconnect()
    // }, [])

    const form = useForm<CreatePropertyFormValues>({
        resolver: zodResolver(createPropertySchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            city: "",
            county: kenyaCounties[0],
            postalCode: "",
            type: "APARTMENT",
            images: [],
            managerId: undefined,
            isActive: true,
        }
    })

    const handleSubmit = async (data: CreatePropertyFormValues) => {
        console.log(data)
        try {
            const isValid = createPropertySchema.safeParse(data)
            if (!isValid.success) {
                toast.error(isValid.error.message)
                return
            }
            const { message, success, property } = await addProperty(isValid.data)

            if (!success) {
                toast.error(message)
                return
            }
            form.reset()
            toast.success(message)

            const propertySlug = property?.id
            router.push(`${pathname}/success?property=${propertySlug}`)
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "An unknown error occurred")
        }
    }

    return (
        <Card className="w-full shadow-lg border-muted/20 rounded-xl">
            <CardHeader className="space-y-2 border-b bg-muted/20">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            New Property
                        </CardTitle>
                        <CardDescription>
                            Add a new property to your organization. Fields marked with <span className="text-destructive">*</span> are required.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form id="create-property-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FieldGroup className="gap-8">
                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <Building2Icon className="h-4 w-4 text-muted-foreground" />
                                Basic information
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Start with the essentials—name, type, and a short description.
                            </FieldDescription>
                            <FieldGroup className="mt-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Controller
                                        name="type"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                <FieldLabel htmlFor="create-property-type" className="text-sm font-medium">
                                                    Property type
                                                </FieldLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="create-property-type" className="w-full h-10">
                                                        <SelectValue placeholder="Select property type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="APARTMENT">Apartment</SelectItem>
                                                        <SelectItem value="HOUSE">House</SelectItem>
                                                        <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                                                        <SelectItem value="STUDIO">Studio</SelectItem>
                                                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                                        <SelectItem value="BEDSITTER">Bedsitter</SelectItem>
                                                        <SelectItem value="SINGLE_ROOM">Single Room</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2 md:col-span-2">
                                                <FieldLabel htmlFor="create-property-name" className="text-sm font-medium">
                                                    Property name <span className="text-destructive">*</span>
                                                </FieldLabel>
                                                <div className="relative">
                                                    <Building2Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        id="create-property-name"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Sunset Apartments"
                                                        className="pl-9 h-10"
                                                    />
                                                </div>
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
                                            <Field data-invalid={fieldState.invalid} className="space-y-2 md:col-span-2">
                                                <FieldLabel htmlFor="create-property-description" className="text-sm font-medium">
                                                    Description <span className="text-muted-foreground font-normal">(optional)</span>
                                                </FieldLabel>
                                                <Textarea
                                                    {...field}
                                                    id="create-property-description"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="What makes this property special? Add amenities, neighborhood highlights, and other details..."
                                                    className="min-h-[110px] resize-none"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </FieldGroup>
                        </FieldSet>

                        <FieldSeparator>Location</FieldSeparator>

                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                Location details
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Add an address so tenants can find the property easily.
                            </FieldDescription>

                            <FieldGroup className="mt-6">
                                <Controller
                                    name="address"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                                            <FieldLabel htmlFor="create-property-address" className="text-sm font-medium">
                                                Street address <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <div className="relative">
                                                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    {...field}
                                                    id="create-property-address"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="123 Main Street"
                                                    className="pl-9 h-10"
                                                />
                                            </div>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} className="text-sm" />
                                            )}
                                        </Field>
                                    )}
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Controller
                                        name="city"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                <FieldLabel htmlFor="create-property-city" className="text-sm font-medium">
                                                    City <span className="text-destructive">*</span>
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="create-property-city"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Nairobi"
                                                    className="h-10"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="county"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                <FieldLabel htmlFor="create-property-county" className="text-sm font-medium">
                                                    County <span className="text-destructive">*</span>
                                                </FieldLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="create-property-county" className="w-full h-10">
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
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <Controller
                                        name="postalCode"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2 md:col-span-1">
                                                <FieldLabel htmlFor="create-property-postal-code" className="text-sm font-medium">
                                                    Postal code <span className="text-muted-foreground font-normal">(optional)</span>
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="create-property-postal-code"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="00100"
                                                    className="h-10"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </FieldGroup>
                        </FieldSet>

                        <FieldSeparator>Management & media</FieldSeparator>

                        <FieldSet className="rounded-lg border bg-card p-4 md:p-6">
                            <FieldLegend className="mb-0 flex items-center gap-2 text-base">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                Management & media
                            </FieldLegend>
                            <FieldDescription className="mt-1">
                                Assign a manager and (optionally) add photos.
                            </FieldDescription>

                            <FieldGroup className="mt-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Controller
                                        name="managerId"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                                <FieldLabel htmlFor="create-property-manager" className="text-sm font-medium">
                                                    Property manager <span className="text-muted-foreground font-normal">(optional)</span>
                                                </FieldLabel>
                                                <Popover open={managerOpen} onOpenChange={setManagerOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="create-property-manager"
                                                            ref={managerTriggerRef}
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={managerOpen}
                                                            aria-invalid={fieldState.invalid}
                                                            disabled={!managers?.length && !field.value}
                                                            className={cn(
                                                                "w-full justify-between h-10",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                                {field.value ? (
                                                                    <CheckIcon className="h-4 w-4 text-muted-foreground" />
                                                                ) : null}
                                                                <span className="truncate">
                                                                    {!managers?.length && !field.value
                                                                        ? "No managers available"
                                                                        : field.value
                                                                            ? managers?.find((manager) => manager.id === field.value)?.name
                                                                            : "Select a manager"}
                                                                </span>
                                                            </span>
                                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        // style={managerPopoverWidth ? { width: managerPopoverWidth } : undefined}
                                                        className="max-w-[calc(100vw-2rem)] p-0"
                                                        align="start"
                                                    >
                                                        <Command>
                                                            <CommandInput placeholder="Search managers..." className="h-9" />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    {managers?.length ? "No manager found." : "No managers available."}
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    <CommandItem
                                                                        value="__unassigned__"
                                                                        data-checked={!field.value}
                                                                        onSelect={() => {
                                                                            field.onChange(undefined)
                                                                            setManagerOpen(false)
                                                                        }}
                                                                    >
                                                                        No manager (unassigned)
                                                                    </CommandItem>
                                                                    {managers?.map((manager) => (
                                                                        <CommandItem
                                                                            key={manager.id}
                                                                            value={`${manager.name} ${manager.id}`}
                                                                            data-checked={field.value === manager.id}
                                                                            onSelect={() => {
                                                                                field.onChange(manager.id)
                                                                                setManagerOpen(false)
                                                                            }}
                                                                        >
                                                                            {manager.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} className="text-sm" />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="isActive"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Field orientation="horizontal" className="gap-3 rounded-lg border bg-muted/20 p-4 items-start">
                                                <FieldContent className="gap-1">
                                                    <FieldLabel htmlFor="create-property-active" className="font-medium">
                                                        Active listing
                                                    </FieldLabel>
                                                    <FieldDescription>
                                                        Turn off to keep it hidden while you finish setup. On by default.
                                                    </FieldDescription>
                                                </FieldContent>
                                                <Switch
                                                    id="create-property-active"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="mt-1"
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="images"
                                    control={form.control}
                                    render={() => (
                                        <Field className="space-y-2">
                                            <FieldLabel htmlFor="create-property-images" className="text-sm font-medium flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                Property images <span className="text-muted-foreground font-normal">(optional)</span>
                                            </FieldLabel>
                                            <div className="border border-dashed border-muted-foreground/25 rounded-lg p-6 md:p-8 flex flex-col items-center justify-center gap-2 bg-muted/20">
                                                <div className="rounded-full border bg-background p-3">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium text-center">
                                                    Image uploads coming soon
                                                </p>
                                                <p className="text-xs text-muted-foreground text-center max-w-md">
                                                    You will be able to add cover photos and galleries here. For now, create the property and upload images later.
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
                    form="create-property-form"
                    className="w-full md:w-auto md:min-w-48"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Creating property...
                        </>
                    ) : (
                        "Create property"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CreatePropertyForm

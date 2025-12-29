'use client'

import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
const formSchema = z.object({
    email: z.email(),
    fullName: z.string().min(1),
    phoneNumber: z.string().min(1).max(10),
}).refine((data) => data.email !== data.fullName, {
    path: ["email"],
    message: "Email and full name cannot be the same",
}).refine((data) => data.phoneNumber.length === 10 && !isNaN(Number(data.phoneNumber)), {
    path: ["phoneNumber"],
    message: "Phone number must be 10 digits and a number",
})
const UpdateInformationForm = ({ email, fullName, phoneNumber }: { email: string, fullName: string, phoneNumber: string }) => {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
        },
    })

    const handleUpdateInformation = async (data: z.infer<typeof formSchema>) => {
        const userInfo = {
            email: data.email,
            name: data.fullName,
            phoneNumber: data.phoneNumber,
        }
        console.log(userInfo)
    }

    return (
        <form id="form-update-information" onSubmit={form.handleSubmit(handleUpdateInformation)}>
            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-update-information-email">
                                Your Email Address
                            </FieldLabel>
                            <Input
                                disabled={true}
                                {...field}
                                id="form-update-information-email"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <FieldGroup>
                <Controller
                    name="fullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-update-information-fullName">
                                Your Full Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-update-information-fullName"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <FieldGroup>
                <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-update-information-phoneNumber">
                                Your Phone Number
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-update-information-phoneNumber"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button type="submit" className="w-full mt-4" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Updating..." : "Update Information"} {form.formState.isSubmitting ? <Loader2Icon className="size-4" /> : null}</Button>
        </form>
    )
}

export default UpdateInformationForm
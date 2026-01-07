'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../ui/button"
import { organization } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { InputGroup, InputGroupInput } from "../ui/input-group"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Loader2Icon, UserPlusIcon } from "lucide-react"


const formSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }).max(50, { message: "Name must be less than 50 characters long" }),
})

const CreateOrgForm = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    async function createOrganization(values: z.infer<typeof formSchema>) {
        try {
            const slug = values.name.toLowerCase().replace(/ /g, "-")
            const { data, error } = await organization.create({
                name: values.name,
                slug: slug,
                userId: userId,
            })

            if (error) {
                toast.error("Unable to create organization", {
                    description: error.message,
                })
                return
            }

            const orgSlug = data?.slug
            const orgName = data?.name

            if (orgSlug) {
                await organization.setActive({ organizationSlug: orgSlug })
                toast.success("Organization created successfully", {
                    description: `You are now the owner of ${orgName}`,
                })
                form.reset()
                router.prefetch('/org/my-orgs')
                router.push(`/org/${orgSlug}`)
            }
            else {
                toast.error("Unable to create organization", {
                    description: "Please try again",
                })
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error("Unable to create organization", {
                description: errorMessage,
            })
        }


    }


    return (

        <Card className="w-full p-4 max-w-md m-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Organization</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-org-form" onSubmit={form.handleSubmit(createOrganization)} className="space-y-4">
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Name</FieldLabel>
                                <InputGroup className="w-full flex items-center justify-between">
                                    <InputGroupInput
                                        {...field}
                                        type="text"
                                        id="create-org-form-name"
                                        placeholder="Enter your organization name"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">{form.formState.isSubmitting ? <><Loader2Icon className="size-4 animate-spin" /> Creating ...</> : <><UserPlusIcon className="size-4" /> Create Organization</>} </Button>
                </form>
            </CardContent>
        </Card>


    )
}

export default CreateOrgForm
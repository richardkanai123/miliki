"use client";

import React, { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    getStepIcon,
    getNavigationIcon,
    IconWrapper,
    type StepIconKey,
} from "@/lib/Icons";
import {
    createPropertySchema,
    CreatePropertyInput,
} from "@/lib/schemas/NewPropertySchema";
import { CheckCircle, ChevronRight, Loader2, ArrowLeft, Save } from "lucide-react";
import ProgressHeader from "./ProgressHeader";
import {
    AmenitiesStep,
    LocationStep,
    NotesAndFeesStep,
    BasicInformationStep,
} from "./steps";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { UpdateProperty } from "@/lib/actions/properties/UpdateProperty";
import { useRouter } from "next/navigation";
import {
    debouncedSaveFormDraft,
    clearFormDraft,
} from "@/lib/utils/formPersistence";
import { Property } from "@/generated/prisma";
import Link from "next/link";

const steps = [
    {
        id: "basic" as const,
        title: "Basic Information",
        description: "Property details and specifications",
        iconKey: "basic" as StepIconKey,
        fields: ["title", "description", "size", "status", "bedrooms", "bathrooms"],
    },
    {
        id: "location" as const,
        title: "Location Details",
        description: "Where is your property located?",
        iconKey: "location" as StepIconKey,
        fields: ["location", "coordinates"],
    },
    {
        id: "amenities" as const,
        title: "Amenities",
        description: "What features does your property offer?",
        iconKey: "amenities" as StepIconKey,
        fields: [
            "parking",
            "garden",
            "balcony",
            "pool",
            "gym",
            "AC",
            "heating",
            "furnished",
            "petsAllowed",
            "smokingAllowed",
            "wheelchairAccessible",
            "securitySystem",
            "internet",
            "cableTV",
            "laundry",
            "storage",
            "fireplace",
        ],
    },
    {
        id: "fees" as const,
        title: "Notes & Fees",
        description: "Additional information and pricing",
        iconKey: "fees" as StepIconKey,
        fields: [
            "notes",
            "cleaningFee",
            "serviceFee",
            "internetFee",
            "securityDeposit",
        ],
    },
];

interface EditPropertyFormProps {
    property: Property;
}

const EditPropertyForm = ({ property }: EditPropertyFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isValidating, setIsValidating] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const Router = useRouter();

    const form = useForm({
        resolver: zodResolver(createPropertySchema),
        defaultValues: {
            title: property.title || "",
            description: property.description || "",
            size: property.size || "ONE_BEDROOM",
            status: property.status || "AVAILABLE",
            location: property.location || "",
            coordinates: property.coordinates || "",
            bedrooms: property.bedrooms || 1,
            bathrooms: property.bathrooms || 1,
            parking: property.parking || false,
            garden: property.garden || false,
            balcony: property.balcony || false,
            pool: property.pool || false,
            gym: property.gym || false,
            AC: property.AC || false,
            heating: property.heating || false,
            furnished: property.furnished || false,
            petsAllowed: property.petsAllowed || false,
            smokingAllowed: property.smokingAllowed || false,
            wheelchairAccessible: property.wheelchairAccessible || false,
            securitySystem: property.securitySystem || false,
            internet: property.internet || false,
            cableTV: property.cableTV || false,
            laundry: property.laundry || false,
            storage: property.storage || false,
            fireplace: property.fireplace || false,
            notes: property.notes || "",
            cleaningFee: property.cleaningFee || 0,
            serviceFee: property.serviceFee || 0,
            internetFee: property.internetFee || 0,
            securityDeposit: property.securityDeposit || 0,
        },
        mode: "onChange",
    });

    // Track changes to show unsaved indicator
    useEffect(() => {
        const subscription = form.watch(() => {
            setHasUnsavedChanges(true);
            // Auto-save draft for edit form as well
            debouncedSaveFormDraft(form.getValues() as Partial<CreatePropertyInput>, currentStep);
        });
        return () => subscription.unsubscribe();
    }, [form, currentStep]);

    // Warn user about unsaved changes when leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const validateCurrentStep = async () => {
        const fieldsToValidate = steps[currentStep].fields;
        const isValid = await form.trigger(fieldsToValidate as any);
        return isValid;
    };

    const nextStep = async () => {
        setIsValidating(true);
        try {
            const isValid = await validateCurrentStep();
            if (isValid && currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        } finally {
            setIsValidating(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (values: CreatePropertyInput) => {
        // Validate the final step before submission
        const isValid = await validateCurrentStep();
        if (!isValid) {
            toast.error("Please complete all required fields in the current step");
            return;
        }

        try {
            const { message, success } = await UpdateProperty(property.id, values);
            if (!success) {
                toast.error(message || "Failed to update property");
                return;
            }
            toast.success("Property updated successfully!");
            setHasUnsavedChanges(false);
            clearFormDraft(); // Clear any auto-saved drafts
            Router.push(`/dashboard/properties/${property.id}?updated=true`);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error occurred";
            toast.error(errorMessage);
        } finally {
            setIsValidating(false);
        }
    };

    // Quick save function for intermediate saves
    const quickSave = async () => {
        setIsValidating(true);
        try {
            const values = form.getValues();
            const { message, success } = await UpdateProperty(property.id, values as CreatePropertyInput);
            if (!success) {
                toast.error(message || "Failed to save changes");
                return;
            }
            toast.success("Changes saved!");
            setHasUnsavedChanges(false);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to save changes";
            toast.error(errorMessage);
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="w-full mx-auto space-y-4 items-center content-center p-2 max-w-5xl">
            {/* Header with navigation and save status */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/properties/${property.id}`}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Property
                        </Link>
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Edit Property
                        </h1>
                        <p className="text-sm text-muted-foreground">{property.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Unsaved changes</span>
                        </div>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={quickSave}
                        disabled={isValidating || !hasUnsavedChanges}
                        className="flex items-center gap-2"
                    >
                        {isValidating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Quick Save
                    </Button>
                </div>
            </div>

            <ProgressHeader
                currentStep={currentStep}
                steps={steps}
                title="Edit Property"
                description="Update your property information"
            />

            {/* Form Content */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    <Card className="w-full mx-auto">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <IconWrapper
                                        variant="primary"
                                        className="dark:text-w">
                                        {React.createElement(
                                            getStepIcon(steps[currentStep].iconKey)
                                        )}
                                    </IconWrapper>
                                </div>
                                <div>
                                    <CardTitle>{steps[currentStep].title}</CardTitle>
                                    <CardDescription>
                                        {steps[currentStep].description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}>
                                    {currentStep === 0 && (
                                        <BasicInformationStep
                                            form={form as UseFormReturn<Partial<CreatePropertyInput>>}
                                        />
                                    )}
                                    {currentStep === 1 && (
                                        <LocationStep
                                            form={form as UseFormReturn<Partial<CreatePropertyInput>>}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <AmenitiesStep
                                            form={form as UseFormReturn<Partial<CreatePropertyInput>>}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <NotesAndFeesStep
                                            form={form as UseFormReturn<Partial<CreatePropertyInput>>}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="w-full flex items-center justify-between px-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2">
                            <IconWrapper className="h-4 w-4">
                                {React.createElement(getNavigationIcon("previous"))}
                            </IconWrapper>
                            Previous
                        </Button>

                        <div className="flex items-center gap-2">
                            {/* Step indicator */}
                            <span className="text-sm text-muted-foreground">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </div>

                        {currentStep !== steps.length - 1 && (
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={isValidating}
                                className="flex items-center gap-2">
                                {isValidating ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Validating...
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Update Button */}
                        {currentStep === steps.length - 1 && (
                            <Button
                                type="submit"
                                disabled={isValidating || form.formState.isSubmitting}
                                className="flex items-center gap-2">
                                {isValidating ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Validating...
                                    </>
                                ) : (
                                    <>
                                        {form.formState.isSubmitting ? "Updating..." : "Update Property"}
                                        {form.formState.isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4" />
                                        )}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditPropertyForm;

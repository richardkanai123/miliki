"use client";

import React, { useState } from "react";
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
import { CheckCircle, ChevronRight } from "lucide-react";
import ProgressHeader from "./ProgressHeader";
import {
    AmenitiesStep,
    LocationStep,
    NotesAndFeesStep,
    BasicInformationStep,
} from "./steps";
import { Form } from "@/components/ui/form";

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

const AddPropertyForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isValidating, setIsValidating] = useState(false);

    const form = useForm({
        resolver: zodResolver(createPropertySchema),
        defaultValues: {
            title: "",
            description: "",
            size: "ONE_BEDROOM",
            status: "AVAILABLE",
            location: "",
            coordinates: "",
            bedrooms: 1,
            bathrooms: 1,
            parking: false,
            garden: false,
            balcony: false,
            pool: false,
            gym: false,
            AC: false,
            heating: false,
            furnished: false,
            petsAllowed: false,
            smokingAllowed: false,
            wheelchairAccessible: false,
            securitySystem: false,
            internet: false,
            cableTV: false,
            laundry: false,
            storage: false,
            fireplace: false,
            notes: "",
            cleaningFee: 0,
            serviceFee: 0,
            internetFee: 0,
            securityDeposit: 0,
        },
        mode: "onChange",
    });

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
            console.log("Please complete all required fields in the current step");
            return;
        }

        console.log("Submitting property:");
        try {
            console.log("Property values:", values);
            // Your submission logic here
        } catch (error) {
            console.error("Error creating property:", error);
        } finally {
            console.log("Property creation process completed.");
        }
    };

    return (
        <div className="w-full mx-auto space-y-4 items-center content-center p-2 max-w-5xl">
            <ProgressHeader
                currentStep={currentStep}
                steps={steps}
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

                        {/* submit Button */}
                        {currentStep === steps.length - 1 && (
                            <Button
                                type="submit"
                                disabled={isValidating}
                                className="flex items-center gap-2">
                                {isValidating ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Validating...
                                    </>
                                ) : (
                                    <>
                                        Add Property
                                        <CheckCircle className="h-4 w-4" />
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

export default AddPropertyForm;

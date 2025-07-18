import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

interface Step {
    id: string;
    title: string;
    description: string;
    iconKey: string;
    fields: string[];
}

interface ProgressHeaderProps {
    currentStep: number;
    steps: Step[];
    title?: string;
    description?: string;
    showStepIcons?: boolean;
    variant?: "default" | "compact";
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    currentStep,
    steps,
    title = "Create New Property",
    description = "Add a new property to your portfolio",
    showStepIcons = false,
    variant = "default",
}) => {
    const progress = ((currentStep + 1) / steps.length) * 100;

    if (variant === "compact") {
        return (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-3">
                    <Badge
                        variant="outline"
                        className="text-xs">
                        {currentStep + 1}/{steps.length}
                    </Badge>
                    <span className="text-sm font-medium">
                        {steps[currentStep].title}
                    </span>
                </div>
                <Progress
                    value={progress}
                    className="w-32 h-2"
                />
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className="text-sm">
                        Step {currentStep + 1} of {steps.length}
                    </Badge>
                </div>
                <div className="space-y-3">
                    <Progress
                        value={progress}
                        className="w-full"
                    />

                    {showStepIcons ? (
                        <div className="flex justify-between items-center">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="flex flex-col items-center gap-1">
                                    <div
                                        className={`p-1 rounded-full transition-colors duration-200 ${index <= currentStep
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground bg-muted"
                                            }`}>
                                        {index < currentStep ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : (
                                            <Circle className="h-4 w-4" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs transition-colors duration-200 ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-between text-xs text-muted-foreground">
                            {steps.map((step, index) => (
                                <span
                                    key={step.id}
                                    className={`${index <= currentStep ? "text-primary" : ""
                                        } transition-colors duration-200`}>
                                    {step.title}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>
        </Card>
    );
};

export default ProgressHeader;

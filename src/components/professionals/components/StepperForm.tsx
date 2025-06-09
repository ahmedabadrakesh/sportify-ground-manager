import React from "react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperFormProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  stepperHeader?: {
    stepHeading: string;
    subLine: string;
  };
}

const stepperHeader = [
  {
    stepHeading: "Basic Information",
    subLine: "Let's start with your basic details",
  },
  {
    stepHeading: "Professional Details",
    subLine: "Share your achievements and qualifications",
  },
  {
    stepHeading: "Training Details",
    subLine: "Tell us about your sport and training approach",
  },
  {
    stepHeading: "Contact Information",
    subLine: "How can people reach you?",
  },
  {
    stepHeading: "Social Profile",
    subLine: "Connect your social media accounts",
  },
  {
    stepHeading: "Media & Portfolio",
    subLine: "Showcase your work and tell us about yourself",
  },
];

export const StepperForm = ({
  currentStep,
  totalSteps,
  stepTitles,
}: StepperFormProps) => {
  return (
    <div className="flex basis-full flex-row">
      <div className="w-1/2 text-left mb-6">
        <h2 className="text-2xl font-bold flex items-left justify-start gap-2">
          <Star className="w-6 h-6" />
          {stepperHeader[currentStep - 1].stepHeading}
        </h2>
        <p className="text-muted-foreground text-left">
          {stepperHeader[currentStep - 1].subLine}
        </p>
      </div>

      <div className="w-1/2 mb-8 items-center">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-orange-300 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                  </div>
                  <div className="mt-2 text-xs text-center">
                    <span
                      className={cn(
                        "font-medium",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    ></span>
                  </div>
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-2 transition-colors",
                      stepNumber < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperFormProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepperForm = ({
  currentStep,
  totalSteps,
  stepTitles,
}: StepperFormProps) => {
  return (
    <div className="flex h-full px-4 py-6">
      <div className="flex flex-col items-left gap-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-row items-center gap-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    {
                      "border-white text-white": isCompleted || isCurrent,
                      "border-gray-300 text-gray-200": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-base font-medium">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-base text-left max-w-60 text-white transition-colors duration-200",
                    {
                      "font-semibold text-lg": isCurrent,
                      "font-medium ": isCompleted,
                      "text-gray-100": isUpcoming,
                    }
                  )}
                >
                  {stepTitles[index]}
                </span>
              </div>
              {/* {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    {
                      "bg-primary": isCompleted,
                      "bg-gray-300": !isCompleted,
                    }
                  )}
                />
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};


import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperFormProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepperForm = ({ currentStep, totalSteps, stepTitles }: StepperFormProps) => {
  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    {
                      "bg-primary border-primary text-white": isCompleted || isCurrent,
                      "bg-white border-gray-300 text-gray-400": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 text-center max-w-20 transition-colors duration-200",
                    {
                      "text-primary font-medium": isCompleted || isCurrent,
                      "text-gray-400": isUpcoming,
                    }
                  )}
                >
                  {stepTitles[index]}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    {
                      "bg-primary": isCompleted,
                      "bg-gray-300": !isCompleted,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

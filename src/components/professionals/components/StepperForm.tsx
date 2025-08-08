import React from "react";
import { CheckCircle, Circle, Star } from "lucide-react";
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
      <div className="flex md:flex-col items-left gap-4">
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
                      "ml-4 md:ml-0": stepNumber === 1,
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
                    "hidden md:block text-base text-left max-w-60 text-white transition-colors duration-200",
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
              {stepNumber <= totalSteps && (
                <div
                  className={cn(
                    "flex mx-2 h-0.5  items-center transition-colors duration-200",
                    {
                      "bg-white": isCompleted,
                      "bg-white-300": !isCompleted,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
        <div className="mt-24 p-4 bg-gradient-to-r from-blue/10 to-blue/5 rounded-lg border border-blue/20">
          <h3 className="text-sm text-white/70 font-semibold mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Profile Tip
          </h3>
          <p className="text-sm text-white/50 text-muted-foreground">
            Share authentic success stories and training content to build
            credibility. High-quality photos and videos of your training
            sessions help potential clients understand your coaching style.
          </p>
        </div>
      </div>
    </div>
  );
};

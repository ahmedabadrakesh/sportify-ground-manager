
import React from "react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isUpdate?: boolean;
}

export const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  isSubmitting,
  isUpdate = false
}: FormNavigationProps) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  
  const submitButtonText = isUpdate 
    ? (isSubmitting ? "Updating Profile..." : "Update Profile")
    : (isSubmitting ? "Registering..." : "Register as Professional");

  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
      >
        Previous
      </Button>
      
      {isLastStep ? (
        <Button type="submit" disabled={isSubmitting}>
          {submitButtonText}
        </Button>
      ) : (
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      )}
    </div>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting: boolean;
  isUpdate?: boolean;
}

export const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit,
  isSubmitting,
  isUpdate = false
}: FormNavigationProps) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  
  const submitButtonText = isUpdate 
    ? (isSubmitting ? "Updating Profile..." : "Update Profile")
    : (isSubmitting ? "Registering..." : "Register as Professional");

  console.log('FormNavigation render - currentStep:', currentStep, 'totalSteps:', totalSteps, 'isLastStep:', isLastStep);

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
        <Button 
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            console.log('Submit button clicked on step:', currentStep);
            onSubmit?.();
          }}
        >
          {submitButtonText}
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={() => {
            console.log('Next button clicked, moving from step:', currentStep);
            onNext();
          }} 
          disabled={isSubmitting}
        >
          Next
        </Button>
      )}
    </div>
  );
};

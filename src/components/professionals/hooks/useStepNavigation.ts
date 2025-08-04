
import { useState } from "react";
import { useFormValidation } from "./useFormValidation";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useStepNavigation = (form: UseFormReturn<ProfessionalFormValues>) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const stepTitles = ["Basic Info", "Professional", "Professional Details", "Training Info", "Contact & Social", "Media"];
  
  const { validateStepAndShowError } = useFormValidation(form);

  const handleNext = async () => {
    console.log('HandleNext called, current step:', currentStep, 'total steps:', totalSteps);
    
    // Don't proceed if we're on the last step (form submission should handle this)
    if (currentStep >= totalSteps) {
      console.log('Already on last step, not proceeding');
      return;
    }

    const isValid = await validateStepAndShowError(currentStep);
    console.log('Step validation result:', isValid);
    
    if (isValid) {
      const nextStep = currentStep + 1;
      console.log('Moving to step:', nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetNavigation = () => {
    setCurrentStep(1);
  };

  return {
    currentStep,
    totalSteps,
    stepTitles,
    handleNext,
    handlePrevious,
    resetNavigation,
  };
};

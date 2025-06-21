
import { useState } from "react";
import { useFormValidation } from "./useFormValidation";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useStepNavigation = (form: UseFormReturn<ProfessionalFormValues>) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const stepTitles = ["Basic Info", "Professional", "Training", "Contact", "Social", "Media"];
  
  const { validateStepAndShowError } = useFormValidation(form);

  const handleNext = async () => {
    const isValid = await validateStepAndShowError(currentStep);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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

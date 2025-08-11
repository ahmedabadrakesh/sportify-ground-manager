
import { useState } from "react";
import { useFormValidation } from "./useFormValidation";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useStepNavigation = (form: UseFormReturn<ProfessionalFormValues>) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const stepTitles = ["Basic Info", "Contact Details", "Professional Details", "Training Info", "About Me"];
  const stepDetails = [
    {title:"Basic Info", icon:'', tip:'Begin by introducing yourself — your name is the first step to your identity as an athlete or coach. Your punch list highlights your key skills, achievements, or goals. Be clear and confident — this is your foundation.'},
    {title: "Contact Details", icon:'', tip:'Your contact information ensures the right people can reach you at the right time. Whether it is for opportunities, collaborations, or updates — staying connected is essential to your growth.'},
    {title:"Professional Details", icon:'', tip:'Share your career journey, certifications, and professional milestones. This section helps others understand your expertise, experience, and the value you bring to the field.'},
    {title:"Training Info", icon:'', tip:'Your training approach reflects your mindset, commitment, and discipline. Provide details about your routine, specialties, or methods — this is where your preparation meets purpose.'},
    {title:"About Me", icon:'', tip:'Share authentic success stories and training content to build credibility. High-quality photos and videos of your training sessions help potential clients understand your coaching style.'},
  ]
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
    stepDetails,
  };
};


import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { StepFive } from "./StepFive";
import { StepSix } from "./StepSix";

interface StepContentRendererProps {
  currentStep: number;
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const StepContentRenderer = ({ currentStep, form, userEmail, isUpdate }: StepContentRendererProps) => {
  switch (currentStep) {
    case 1:
      return <StepOne form={form} userEmail={userEmail} isUpdate={isUpdate} />;
    case 2:
      return <StepTwo form={form} />;
    case 3:
      return <StepThree form={form} />;
    case 4:
      return <StepFour form={form} />;
    case 5:
      return <StepFive form={form} />;
    case 6:
      return <StepSix form={form} />;
    default:
      return null;
  }
};

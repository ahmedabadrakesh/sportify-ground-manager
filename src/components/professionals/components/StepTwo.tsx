import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { EnhancedContactSection } from "./form-sections/EnhancedContactSection";

interface StepTwoProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const StepTwo = ({ form, userEmail, isUpdate }: StepTwoProps) => {
  return <EnhancedContactSection form={form} userEmail={userEmail} isUpdate={isUpdate} />;
};


import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { EnhancedBasicInfoSection } from "./form-sections/EnhancedBasicInfoSection";

interface StepOneProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const StepOne = ({ form }: StepOneProps) => {
  return <EnhancedBasicInfoSection form={form} />;
};

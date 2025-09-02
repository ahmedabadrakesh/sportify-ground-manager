import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { BasicInformationSection } from "./form-sections/BasicInformationSection";
import { FeeInformationSection } from "./form-sections/FeeInformationSection";
import { ContactInformationSection } from "./form-sections/ContactInformationSection";
import { SocialMediaSection } from "./form-sections/SocialMediaSection";
import { ProfessionalDetailsSection } from "./form-sections/ProfessionalDetailsSection";
import { MediaSection } from "./form-sections/MediaSection";

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const ProfessionalFormFields = ({
  form,
  userEmail,
  isUpdate = false,
}: ProfessionalFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <BasicInformationSection form={form} />
      <FeeInformationSection form={form} />
      <ContactInformationSection
        form={form}
        userEmail={userEmail}
        isUpdate={isUpdate}
      />
      <SocialMediaSection form={form} />
      <ProfessionalDetailsSection form={form} />
      <MediaSection form={form} />
    </div>
  );
};

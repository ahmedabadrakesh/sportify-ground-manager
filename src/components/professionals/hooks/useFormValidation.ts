
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useFormValidation = (form: UseFormReturn<ProfessionalFormValues>) => {
  const getFieldsForStep = (step: number): (keyof ProfessionalFormValues)[] => {
    switch (step) {
      case 1:
        return ["name", "profession_type"];
      case 2:
        return []; // Step 2 has no required fields
      case 3:
        return ["game_id"]; // Only game_id is required in step 3
      case 4:
        return ["contact_number", "city", "address"]; // Required fields in step 4
      case 5:
        return []; // Step 5 has no required fields
      case 6:
        return []; // Step 6 has no required fields
      default:
        return [];
    }
  };

  const validateCurrentStep = async (currentStep: number) => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    console.log(`Validating step ${currentStep} with fields:`, fieldsToValidate);
    const isValid = await form.trigger(fieldsToValidate);
    console.log(`Step ${currentStep} validation result:`, isValid);
    return isValid;
  };

  const validateStepAndShowError = async (currentStep: number) => {
    const isValid = await validateCurrentStep(currentStep);
    if (!isValid) {
      toast.error("Please fill in all required fields before proceeding.");
    }
    return isValid;
  };

  return {
    validateCurrentStep,
    validateStepAndShowError,
  };
};

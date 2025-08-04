
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useFormValidation = (form: UseFormReturn<ProfessionalFormValues>) => {
  const validateStepAndShowError = async (step: number): Promise<boolean> => {
    console.log('Validating step:', step);
    
    let fieldsToValidate: (keyof ProfessionalFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["name", "email", "contact_number"];
        break;
      case 2:
        fieldsToValidate = ["profession_type", "game_id", "fee", "fee_type"];
        break;
      case 3:
        // Step 3 is Professional Details - games_played is the only required field
        fieldsToValidate = ["games_played"];
        break;
      case 4:
        fieldsToValidate = ["punch_line"];
        break;
      case 5:
        // Social media fields are optional, so we can proceed to step 6
        fieldsToValidate = [];
        break;
      case 6:
        // Final step - all validation will be handled by form submission
        fieldsToValidate = [];
        break;
      default:
        return true;
    }

    // If no fields to validate, step is valid
    if (fieldsToValidate.length === 0) {
      console.log('No fields to validate for step', step);
      return true;
    }

    // Validate specific fields
    const isStepValid = await form.trigger(fieldsToValidate);
    console.log('Step validation result:', isStepValid);

    if (!isStepValid) {
      const errors = form.formState.errors;
      const errorFields = fieldsToValidate.filter(field => errors[field]);
      
      if (errorFields.length > 0) {
        toast.error(`Please fill in all required fields before proceeding.`);
      }
    }

    return isStepValid;
  };

  return {
    validateStepAndShowError,
  };
};


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalFormSchema, type ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { useStepNavigation } from "./useStepNavigation";
import { useProfessionalRegistration } from "./useProfessionalRegistration";

export const useRegisterProfessionalForm = (onSuccess: () => void, isUpdate: boolean = false) => {
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: "",
      profession_type: "Athlete",
      game_id: "",
      contact_number: "",
      email: "",
      fee: 0,
      fee_type: "Per Hour",
      city: "",
      address: "",
      comments: "",
      photo: "",
      years_of_experience: 0,
      total_match_played: 0,
      awards: [],
      accomplishments: [],
      certifications: [],
      training_locations: [],
      videos: [],
      images: [],
      punch_line: "",
      instagram_link: "",
      facebook_link: "",
      linkedin_link: "",
      website: "",
      youtube_link: "",
      level: undefined,
      coaching_availability: [],
    },
  });

  const {
    currentStep,
    totalSteps,
    stepTitles,
    handleNext,
    handlePrevious,
    resetNavigation,
  } = useStepNavigation(form);

  const { registerMutation } = useProfessionalRegistration(onSuccess, isUpdate);

  const resetForm = () => {
    resetNavigation();
    form.reset();
  };

  const onSubmit = (values: ProfessionalFormValues) => {
    console.log('Form submission triggered with values:', values);
    console.log('Current step:', currentStep, 'Total steps:', totalSteps);
    console.log('Is update mode:', isUpdate);
    console.log('Current form state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    
    // Only submit if we're on the last step
    if (currentStep !== totalSteps) {
      console.log('Not on last step, preventing submission');
      return;
    }
    
    // Ensure numeric fields are properly converted
    const processedValues = {
      ...values,
      fee: Number(values.fee) || 0,
      years_of_experience: Number(values.years_of_experience) || 0,
      total_match_played: Number(values.total_match_played) || 0,
    };
    
    console.log('Processed values for submission:', processedValues);
    registerMutation.mutate(processedValues);
  };

  return {
    form,
    currentStep,
    totalSteps,
    stepTitles,
    registerMutation,
    handleNext,
    handlePrevious,
    resetForm,
    onSubmit,
  };
};

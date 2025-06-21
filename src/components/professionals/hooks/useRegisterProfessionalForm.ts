
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalFormSchema, type ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { useStepNavigation } from "./useStepNavigation";
import { useProfessionalRegistration } from "./useProfessionalRegistration";

export const useRegisterProfessionalForm = (onSuccess: () => void) => {
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

  const { registerMutation } = useProfessionalRegistration(onSuccess);

  const resetForm = () => {
    resetNavigation();
    form.reset();
  };

  const onSubmit = (values: ProfessionalFormValues) => {
    registerMutation.mutate(values);
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

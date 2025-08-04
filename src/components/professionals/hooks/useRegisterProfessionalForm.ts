
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalFormSchema, type ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { useStepNavigation } from "./useStepNavigation";
import { useProfessionalRegistration } from "./useProfessionalRegistration";

export const useRegisterProfessionalForm = (onSuccess: () => void, isUpdate: boolean = false) => {
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      // Basic Info
      name: "",
      profession_type: "Athlete",
      photo: "",
      academy_name: "",
      years_of_experience: 0,
      game_id: "",
      
      // Contact & Social Details
      contact_number: "",
      whatsapp: "",
      whatsapp_same_as_phone: true,
      email: "",
      instagram_link: "",
      youtube_link: "",
      linkedin_link: "",
      website: "",
      facebook_link: "",
      
      // Professional Details
      district_level_tournaments: 0,
      state_level_tournaments: 0,
      national_level_tournaments: 0,
      international_level_tournaments: 0,
      specialties: [],
      games_played: [],
      certifications: [],
      education: [],
      accomplishments: [],
      training_locations_detailed: [],
      
      // Media & Pricing
      images: [],
      videos: [],
      one_on_one_price: 0,
      group_session_price: 0,
      online_price: 0,
      free_demo_call: false,
      
      // About Me
      about_me: "",
      success_stories: [],
      
      // Legacy fields
      city: "",
      address: "",
      comments: "",
      fee: 0,
      fee_type: "Per Hour",
      total_match_played: 0,
      awards: [],
      training_locations: [],
      punch_line: "",
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
    
    // Only submit if we're on the last step - this prevents accidental submissions
    if (currentStep !== totalSteps) {
      console.log('Not on last step, preventing submission. Current step:', currentStep, 'Total steps:', totalSteps);
      // Don't call handleNext here - let the navigation handle step changes
      return;
    }
    
    console.log('On final step, proceeding with submission');
    
    // Ensure numeric fields are properly converted
    const processedValues = {
      ...values,
      fee: Number(values.fee) || 0,
      years_of_experience: Number(values.years_of_experience) || 0,
      total_match_played: Number(values.total_match_played) || 0,
      district_level_tournaments: Number(values.district_level_tournaments) || 0,
      state_level_tournaments: Number(values.state_level_tournaments) || 0,
      national_level_tournaments: Number(values.national_level_tournaments) || 0,
      international_level_tournaments: Number(values.international_level_tournaments) || 0,
      one_on_one_price: Number(values.one_on_one_price) || 0,
      group_session_price: Number(values.group_session_price) || 0,
      online_price: Number(values.online_price) || 0,
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

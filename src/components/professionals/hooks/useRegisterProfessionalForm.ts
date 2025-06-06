
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { professionalFormSchema, type ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useRegisterProfessionalForm = (onSuccess: () => void) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const stepTitles = ["Basic Info", "Professional", "Training", "Contact", "Social", "Media"];
  
  const queryClient = useQueryClient();
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

  const registerMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      const professionalData = {
        name: values.name,
        profession_type: values.profession_type,
        game_id: values.game_id,
        contact_number: values.contact_number,
        fee: values.fee,
        fee_type: values.fee_type,
        city: values.city,
        address: values.address,
        comments: values.comments || null,
        photo: values.photo || null,
        awards: values.awards || [],
        accomplishments: values.accomplishments || [],
        certifications: values.certifications || [],
        training_locations: values.training_locations || [],
        videos: values.videos || [],
        images: values.images || [],
        punch_line: values.punch_line || null,
        instagram_link: values.instagram_link || null,
        facebook_link: values.facebook_link || null,
        linkedin_link: values.linkedin_link || null,
        website: values.website || null,
        level: values.level || null,
        coaching_availability: values.coaching_availability || [],
      };
      
      const { error } = await supabase
        .from('sports_professionals')
        .insert(professionalData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Successfully registered as a sports professional");
      queryClient.invalidateQueries({ queryKey: ["sports-professionals"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    }
  });

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

  const validateCurrentStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    console.log(`Validating step ${currentStep} with fields:`, fieldsToValidate);
    const isValid = await form.trigger(fieldsToValidate);
    console.log(`Step ${currentStep} validation result:`, isValid);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
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

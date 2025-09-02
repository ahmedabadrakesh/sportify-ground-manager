
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalFormSchema, type ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { useStepNavigation } from "./useStepNavigation";
import { useProfessionalRegistration } from "./useProfessionalRegistration";
import { useDraftSave } from "./useDraftSave";
import { useEffect } from "react";

export const useRegisterProfessionalForm = (onSuccess: () => void, isUpdate: boolean = false) => {
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      // Basic Info
      name: "",
      age: 0,
      sex: undefined,
      profession_type: "Athlete",
      photo: "",
      academy_name: "",
      years_of_experience: 0,
      
      
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
    handleNext: originalHandleNext,
    handlePrevious,
    resetNavigation,
    stepDetails,
  } = useStepNavigation(form);

  const { registerMutation } = useProfessionalRegistration(onSuccess, isUpdate);

  // Initialize draft save functionality
  const { saveDraft, loadDraft, deleteDraft } = useDraftSave(form, currentStep, isUpdate);

  // Load draft data when form initializes (only for new registrations)
  useEffect(() => {
    if (!isUpdate) {
      const loadDraftData = async () => {
        const draft = await loadDraft();
        if (draft) {
          console.log('Loading draft data:', draft);
          // Populate form with draft data
          form.reset({
            name: draft.name || "",
            age: draft.age || 0,
            sex: draft.sex || undefined,
            profession_type: draft.profession_type || "Athlete",
            photo: draft.photo || "",
            academy_name: draft.academy_name || "",
            years_of_experience: draft.years_of_experience || 0,
            contact_number: draft.contact_number || "",
            whatsapp: draft.whatsapp || "",
            whatsapp_same_as_phone: draft.whatsapp_same_as_phone || true,
            email: draft.email || "",
            instagram_link: draft.instagram_link || "",
            youtube_link: draft.youtube_link || "",
            linkedin_link: draft.linkedin_link || "",
            website: draft.website || "",
            facebook_link: draft.facebook_link || "",
            district_level_tournaments: draft.district_level_tournaments || 0,
            state_level_tournaments: draft.state_level_tournaments || 0,
            national_level_tournaments: draft.national_level_tournaments || 0,
            international_level_tournaments: draft.international_level_tournaments || 0,
            specialties: draft.specialties || [],
            games_played: draft.game_ids || [],
            certifications: draft.certifications || [],
            education: draft.education || [],
            accomplishments: draft.accomplishments || [],
            training_locations_detailed: draft.training_locations_detailed || [],
            images: draft.images || [],
            videos: draft.videos || [],
            one_on_one_price: draft.one_on_one_price || 0,
            group_session_price: draft.group_session_price || 0,
            online_price: draft.online_price || 0,
            free_demo_call: draft.free_demo_call || false,
            about_me: draft.about_me || "",
            success_stories: draft.success_stories || [],
            city: draft.city || "",
            address: draft.address || "",
            comments: draft.comments || "",
            fee: draft.fee || 0,
            fee_type: draft.fee_type || "Per Hour",
            total_match_played: draft.total_match_played || 0,
            awards: draft.awards || [],
            training_locations: draft.training_locations || [],
            punch_line: draft.punch_line || "",
            level: draft.level || undefined,
            coaching_availability: draft.coaching_availability || [],
          });
        }
      };
      loadDraftData();
    }
  }, [loadDraft, form, isUpdate]);

  // Custom handleNext that saves data before moving to next step
  const handleNext = async () => {
    if (!isUpdate) {
      const formValues = form.getValues();
      console.log('Saving draft data before moving to next step:', currentStep);
      await saveDraft(formValues);
    }
    await originalHandleNext();
  };

  // Auto-save form data on every step change (backup)
  useEffect(() => {
    if (currentStep > 1 && !isUpdate) {
      const timeoutId = setTimeout(() => {
        const formValues = form.getValues();
        saveDraft(formValues);
        console.log('Auto-saving draft data at step:', currentStep);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, form, saveDraft, isUpdate]);

  const resetForm = () => {
    resetNavigation();
    form.reset();
    // Delete draft when form is reset
    if (!isUpdate) {
      deleteDraft();
    }
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
      age: Number(values.age) || 0,
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
    
    // Delete draft after successful submission
    if (!isUpdate) {
      deleteDraft();
    }
    
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
    stepDetails,
    saveDraft,
    loadDraft,
    deleteDraft,
  };
};

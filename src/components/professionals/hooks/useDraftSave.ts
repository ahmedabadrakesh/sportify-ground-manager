import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalFormValues } from '../schemas/professionalFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/utils/auth';
import { toast } from 'sonner';

export const useDraftSave = (
  form: UseFormReturn<ProfessionalFormValues>,
  currentStep: number,
  isUpdate: boolean = false
) => {
  const { user } = useAuthStore();

  const saveDraft = useCallback(async (values: ProfessionalFormValues) => {
    if (!user?.id || isUpdate) return; // Don't save drafts when updating existing profiles
    
    try {
      // Only save if there's meaningful data filled
      const hasData = values.name || values.contact_number || values.address || values.city;
      if (!hasData) return;

      const draftData = {
        user_id: user.id,
        name: values.name || '',
        contact_number: values.contact_number || '',
        address: values.address || '',
        city: values.city || '',
        about_me: values.about_me || '',
        punch_line: values.punch_line || '',
        whatsapp: values.whatsapp || '',
        instagram_link: values.instagram_link || '',
        linkedin_link: values.linkedin_link || '',
        website: values.website || '',
        youtube_link: values.youtube_link || '',
        age: values.age ? Number(values.age) : null,
        sex: values.sex || '',
        profession_type: values.profession_type || 'coach',
        fee: values.fee ? Number(values.fee) : 0,
        fee_type: values.fee_type || 'hourly',
        years_of_experience: values.years_of_experience ? Number(values.years_of_experience) : 0,
        number_of_clients_served: values.number_of_clients_served ? Number(values.number_of_clients_served) : 0,
        level: values.level || '',
        academy_name: values.academy_name || '',
        game_ids: values.game_ids || [],
        specialties: values.specialties || [],
        certifications: values.certifications || [],
        education: values.education || [],
        awards: values.awards || [],
        accomplishments: values.accomplishments || [],
        coaching_availability: values.coaching_availability || [],
        training_locations: values.training_locations || [],
        district_level_tournaments: values.district_level_tournaments ? Number(values.district_level_tournaments) : 0,
        state_level_tournaments: values.state_level_tournaments ? Number(values.state_level_tournaments) : 0,
        national_level_tournaments: values.national_level_tournaments ? Number(values.national_level_tournaments) : 0,
        international_level_tournaments: values.international_level_tournaments ? Number(values.international_level_tournaments) : 0,
        one_on_one_price: values.one_on_one_price ? Number(values.one_on_one_price) : 0,
        group_session_price: values.group_session_price ? Number(values.group_session_price) : 0,
        online_price: values.online_price ? Number(values.online_price) : 0,
        free_demo_call: values.free_demo_call || false,
        success_stories: values.success_stories || [],
        training_locations_detailed: values.training_locations_detailed || [],
        videos: values.videos || [],
        images: values.images || [],
        comments: values.comments || '',
        is_draft: true
      };

      // Check if draft exists
      const { data: existingDraft } = await supabase
        .from('sports_professionals')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_draft', true)
        .single();

      if (existingDraft) {
        // Update existing draft
        await supabase
          .from('sports_professionals')
          .update(draftData)
          .eq('id', existingDraft.id);
      } else {
        // Create new draft
        await supabase
          .from('sports_professionals')
          .insert(draftData);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [user?.id, isUpdate]);

  const loadDraft = useCallback(async () => {
    if (!user?.id || isUpdate) return null;
    
    try {
      const { data: draft } = await supabase
        .from('sports_professionals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_draft', true)
        .single();

      return draft;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, [user?.id, isUpdate]);

  const deleteDraft = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('sports_professionals')
        .delete()
        .eq('user_id', user.id)
        .eq('is_draft', true);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  }, [user?.id]);

  // Auto-save on step change
  useEffect(() => {
    if (currentStep > 1) {
      const timeoutId = setTimeout(() => {
        const values = form.getValues();
        saveDraft(values);
      }, 1000); // Save 1 second after step change

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, form, saveDraft]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const values = form.getValues();
      saveDraft(values);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [form, saveDraft]);

  return {
    saveDraft,
    loadDraft,
    deleteDraft
  };
};
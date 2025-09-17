import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalFormValues } from '../schemas/professionalFormSchema';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/utils/auth';

// Create a simple client without complex type inference
const simpleSupabase = createClient(
  "https://qlrnxgyvplzrkzhhjhab.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscm54Z3l2cGx6cmt6aGhqaGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjA1MjYsImV4cCI6MjA2MDE5NjUyNn0.LvgrB50gDT3KQz7DhJ7swPPFPmMDxi3IGVtlebUinTI"
);

export const useDraftSave = (
  form: UseFormReturn<ProfessionalFormValues>,
  currentStep: number,
  isUpdate: boolean = false
) => {
  const saveDraft = useCallback(async (values: ProfessionalFormValues) => {
    if(values.name !== '')
    {
      if (isUpdate) return;
      
      try {
        const user = await getCurrentUser();
        if (!user?.id) return;
        
        // Check if form has any meaningful data before saving
        const hasData = values.name || values.contact_number || values.address || values.city || 
                      values.about_me || values.profession_type || values.academy_name ||
                      (values.games_played && values.games_played.length > 0) ||
                      (values.specialties && values.specialties.length > 0);
        
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
          facebook_link: values.facebook_link || '',
          age: values.age ? Number(values.age) : null,
          sex: values.sex || '',
          profession_type: values.profession_type || ['Coach'],
          years_of_experience: values.years_of_experience ? Number(values.years_of_experience) : 0,
          number_of_clients_served: values.number_of_clients_served ? Number(values.number_of_clients_served) : 0,
          level: values.level || null,
          academy_name: values.academy_name || '',
          game_ids: values.games_played || [],
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
          photo: values.photo || '',
          total_match_played: values.total_match_played ? Number(values.total_match_played) : 0,
          is_draft: true
        };

        const { data: existingDraft } = await simpleSupabase
          .from('sports_professionals')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_draft', true)
          .maybeSingle();

        if (existingDraft) {
          const { error } = await simpleSupabase
            .from('sports_professionals')
            .update(draftData)
            .eq('id', existingDraft.id);
          
          if (error) {
            console.error('Error updating draft:', error);
          } else {
            console.log('Draft updated successfully at step', currentStep);
          }
        } else {
          const { error } = await simpleSupabase
            .from('sports_professionals')
            .insert(draftData);
          
          if (error) {
            console.error('Error creating draft:', error);
          } else {
            console.log('Draft saved successfully at step', currentStep);
          }
        }
        
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }
  }, [isUpdate, currentStep]);

  const loadDraft = useCallback(async () => {
    if (isUpdate) return null;
    
    try {
      const user = await getCurrentUser();
      if (!user?.id) return null;
      
      const { data: draft } = await simpleSupabase
        .from('sports_professionals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_draft', true)
        .maybeSingle();

      return draft;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, [isUpdate]);

  const deleteDraft = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user?.id) return;
      
      await simpleSupabase
        .from('sports_professionals')
        .delete()
        .eq('user_id', user.id)
        .eq('is_draft', true);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  }, []);

  // Auto-save on step change
  useEffect(() => {
    if (currentStep > 0) {
      const timeoutId = setTimeout(() => {
        const values = form.getValues();
        saveDraft(values);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, form, saveDraft]);

  return {
    saveDraft,
    loadDraft,
    deleteDraft
  };
};
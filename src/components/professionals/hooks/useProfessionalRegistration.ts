
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrentUser, hasRoleSync } from "@/utils/auth";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useProfessionalRegistration = (onSuccess: () => void, isUpdate: boolean = false) => {
  const queryClient = useQueryClient();
  const isSuperAdmin = hasRoleSync('super_admin');

  const registerMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      console.log('Mutation called with values:', values);
      console.log('Is update mode:', isUpdate);

      // Get current user
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to register as a sports professional");
      }

      let userId: string;

      // Handle user ID resolution
      if ('phone' in currentUser && currentUser.phone) {
        // For phone users, find or create user record
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('phone', currentUser.phone)
          .single();

        if (existingUser) {
          userId = existingUser.id;
        } else {
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              name: currentUser.name,
              email: values.contact_number.includes('@') ? values.contact_number : `${currentUser.phone}@phone.user`,
              phone: currentUser.phone,
              role: isUpdate ? 'sports_professional' : 'user'
            })
            .select('id')
            .single();

          if (userError) {
            console.error('Error creating user record:', userError);
            throw new Error("Failed to create user profile");
          }

          userId = newUser.id;
        }
      } else {
        userId = currentUser.id;
      }

      // Check for existing profile only when not updating
      if (!isSuperAdmin && !isUpdate) {
        const { data: existingProfile } = await supabase
          .from('sports_professionals')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (existingProfile) {
          throw new Error("You already have a professional profile. You can only have one profile.");
        }
      }

      const professionalData = {
        user_id: userId,
        name: values.name,
        profession_type: values.profession_type,
        game_id: values.game_id,
        contact_number: values.contact_number,
        fee: Number(values.fee) || 0,
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
      
      console.log('Professional data to save:', professionalData);
      
      if (isUpdate) {
        // Update existing professional profile
        console.log('Updating professional profile for user_id:', userId);
        const { data, error } = await supabase
          .from('sports_professionals')
          .update(professionalData)
          .eq('user_id', userId)
          .select()
          .single();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Update successful:', data);
      } else {
        // Insert new professional profile
        console.log('Creating new professional profile');
        const { data, error } = await supabase
          .from('sports_professionals')
          .insert(professionalData)
          .select()
          .single();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Insert successful:', data);

        // Update user role to sports_professional only if not already super admin
        if (!isSuperAdmin) {
          const { error: userUpdateError } = await supabase
            .from('users')
            .update({ role: 'sports_professional' })
            .eq('id', userId);

          if (userUpdateError) {
            console.error("Failed to update user role:", userUpdateError);
          }

          // Update localStorage with new role for phone users
          if ('phone' in currentUser && currentUser.phone) {
            const updatedUser = { ...currentUser, role: 'sports_professional' as const };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // Trigger auth state change event
            window.dispatchEvent(new CustomEvent('authStateChanged', { 
              detail: { user: updatedUser, session: null } 
            }));
          }
        }
      }
    },
    onSuccess: () => {
      const successMessage = isUpdate 
        ? "Successfully updated your professional profile" 
        : "Successfully registered as a sports professional";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["sports-professionals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sports-professionals"] });
      onSuccess();
    },
    onError: (error) => {
      const errorMessage = isUpdate 
        ? "Failed to update profile. Please try again." 
        : "Failed to register. Please try again.";
      toast.error(errorMessage);
      console.error("Registration/Update error:", error);
    }
  });

  return {
    registerMutation,
  };
};

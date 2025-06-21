
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrentUser, hasRoleSync } from "@/utils/auth";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useProfessionalRegistration = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const isSuperAdmin = hasRoleSync('super_admin');

  const registerMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      // Get current user
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to register as a sports professional");
      }

      let userId: string;

      // Check if user already has a professional profile (unless super admin)
      if (!isSuperAdmin) {
        // For phone users, we need to find or create a user record in the users table
        if ('phone' in currentUser && currentUser.phone) {
          // First, check if a user record exists for this phone user
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('phone', currentUser.phone)
            .single();

          if (existingUser) {
            userId = existingUser.id;
          } else {
            // Create a user record for phone registration users
            const { data: newUser, error: userError } = await supabase
              .from('users')
              .insert({
                name: currentUser.name,
                email: values.contact_number.includes('@') ? values.contact_number : `${currentUser.phone}@phone.user`,
                phone: currentUser.phone,
                role: 'sports_professional'
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
          // For email users, use the existing user ID
          userId = currentUser.id;
        }

        // Check if user already has a professional profile
        const { data: existingProfile } = await supabase
          .from('sports_professionals')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (existingProfile) {
          throw new Error("You already have a professional profile. You can only have one profile.");
        }
      } else {
        // Super admin can create profiles without user constraints
        // For super admin, we still need a valid user ID
        if ('phone' in currentUser && currentUser.phone) {
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
                role: 'user'
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
      }

      const professionalData = {
        user_id: userId,
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

      // Update user role to sports_professional only if not already super admin
      if (!isSuperAdmin) {
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ role: 'sports_professional' })
          .eq('id', userId);

        if (userUpdateError) {
          console.error("Failed to update user role:", userUpdateError);
          // Don't throw here as the professional profile was created successfully
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
    },
    onSuccess: () => {
      toast.success("Successfully registered as a sports professional");
      queryClient.invalidateQueries({ queryKey: ["sports-professionals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sports-professionals"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    }
  });

  return {
    registerMutation,
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrentUser, hasRoleSync } from "@/utils/auth";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const useProfessionalRegistration = (onSuccess: () => void, isUpdate: boolean = false, existingUserId?: string) => {
  const queryClient = useQueryClient();
  const isSuperAdmin = hasRoleSync('super_admin');

  const registerMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      console.log('Professional registration/update called with values:', values);
      console.log('Is update mode:', isUpdate);
      console.log('Is super admin:', isSuperAdmin);

      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to register as a sports professional");
      }

      let userId: string;

      // If we're updating an existing professional and have their user_id, use that
      if (isUpdate && existingUserId) {
        userId = existingUserId;
        console.log('Using existing user ID for update:', userId);
      } else if (isSuperAdmin && !isUpdate) {
        console.log('Super admin registering professional with email:', values.email);
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: "123456",
          options: {
            data: {
              name: values.name,
              user_type: 'sports_professional'
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (authError) {
          console.error('Auth registration error:', authError);
          throw new Error(`Failed to create user account: ${authError.message}`);
        }

        if (!authData.user) {
          throw new Error("Failed to create user account");
        }

        console.log('Auth user created:', authData.user.id);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', authData.user.id)
          .maybeSingle();

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('Error checking user profile:', userCheckError);
          throw new Error("Failed to verify user profile creation");
        }

        if (existingUser) {
          userId = existingUser.id;
          console.log('Found existing user profile:', userId);
        } else {
          console.log('Creating user profile manually...');
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              auth_id: authData.user.id,
              name: values.name,
              email: values.email,
              role: 'sports_professional'
            })
            .select('id')
            .single();

          if (userError) {
            console.error('Error creating user profile:', userError);
            throw new Error("Failed to create user profile");
          }

          userId = newUser.id;
          console.log('Created user profile:', userId);
        }
      } else {
        // For regular users, use their current user ID
        userId = currentUser.id;
        console.log('Using current user ID:', userId);
      }

      console.log('Checking for existing professional profile...');
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('sports_professionals')
        .select('id, user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking for existing profile:', profileCheckError);
        throw new Error("Failed to check existing profile");
      }

      const hasExistingProfile = !!existingProfile;
      console.log('Has existing profile:', hasExistingProfile, existingProfile);

      if (!isSuperAdmin && !isUpdate && hasExistingProfile) {
        throw new Error("You already have a professional profile. Use the update option instead.");
      }

      // For super admins creating profiles for other users, they should never be in update mode
      // unless explicitly passed existing profile data
      if (isUpdate && isSuperAdmin && !hasExistingProfile) {
        console.log("Super admin in update mode but no existing profile found, treating as new creation");
        isUpdate = false;
      }

      if (isUpdate && !hasExistingProfile) {
        throw new Error("No existing profile found to update. Please create a new profile instead.");
      }

      // Convert game names to game IDs
      let gameIds: string[] = [];
      if (values.games_played && values.games_played.length > 0) {
        const { data: gameData } = await supabase
          .from('games')
          .select('id, name')
          .in('name', values.games_played);
        
        if (gameData) {
          gameIds = gameData.map(game => game.id);
        }
      }

      const professionalData = {
        user_id: userId,
        name: values.name,
        profession_type: values.profession_type,
        game_ids: gameIds,
        contact_number: values.contact_number,
        city: values.city,
        address: values.address,
        photo: values.photo || null,
        years_of_experience: values.years_of_experience ? Number(values.years_of_experience) : null,
        total_match_played: values.total_match_played ? Number(values.total_match_played) : null,
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
        // New enhanced fields
        academy_name: values.academy_name || null,
        is_certified: values.is_certified || false,
        whatsapp: values.whatsapp || null,
        whatsapp_same_as_phone: values.whatsapp_same_as_phone || false,
        youtube_link: values.youtube_link || null,
        district_level_tournaments: Number(values.district_level_tournaments) || 0,
        state_level_tournaments: Number(values.state_level_tournaments) || 0,
        national_level_tournaments: Number(values.national_level_tournaments) || 0,
        international_level_tournaments: Number(values.international_level_tournaments) || 0,
        specialties: values.specialties || [],
        education: values.education || [],
        training_locations_detailed: values.training_locations_detailed || [],
        one_on_one_price: Number(values.one_on_one_price) || 0,
        group_session_price: Number(values.group_session_price) || 0,
        online_price: Number(values.online_price) || 0,
        free_demo_call: values.free_demo_call || false,
        about_me: values.about_me || null,
        success_stories: values.success_stories || [],
        age: values.age || 0,
        sex: values.sex || null,
        number_of_clients_served: Number(values.number_of_clients_served) || 0
      };
      
      console.log('Professional data to save:', professionalData);
      
      if (isUpdate && hasExistingProfile) {
        console.log('Updating professional profile with ID:', existingProfile.id);
        
        const { data, error } = await supabase
          .from('sports_professionals')
          .update(professionalData)
          .eq('id', existingProfile.id)
          .select()
          .single();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Update successful:', data);
        return data;
      } else {
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

        // Only update current user's role and auth state if they are registering themselves
        // If admin is registering someone else, skip the login/auth update
        if (!isSuperAdmin && currentUser.id === userId) {
          const { error: userUpdateError } = await supabase
            .from('users')
            .update({ role: 'sports_professional' })
            .eq('id', userId);

          if (userUpdateError) {
            console.error("Failed to update user role:", userUpdateError);
          } else {
            console.log("Updated user role to sports_professional");
          }

          // Update localStorage for current user only when they register themselves
          const updatedUser = { ...currentUser, role: 'sports_professional' as const };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // Only dispatch auth state change for self-registration, not admin creating others
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { user: updatedUser, session: null } 
          }));
        }

        return data;
      }
    },
    onSuccess: () => {
      const successMessage = isSuperAdmin && !isUpdate
        ? "Successfully registered sports professional with user account"
        : isUpdate 
          ? "Successfully updated your professional profile" 
          : "Successfully registered as a sports professional";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["sports-professionals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sports-professionals"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
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
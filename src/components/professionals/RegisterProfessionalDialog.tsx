import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepperForm } from "./components/StepperForm";
import { FormNavigation } from "./components/FormNavigation";
import { StepContentRenderer } from "./components/StepContentRenderer";
import { useRegisterProfessionalForm } from "./hooks/useRegisterProfessionalForm";
import { getCurrentUser } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasRoleSync } from "@/utils/auth";

interface RegisterProfessionalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasExistingProfile?: boolean;
  isUpdate?: boolean;
}

const RegisterProfessionalDialog = ({
  open,
  onOpenChange,
  hasExistingProfile = false,
  isUpdate = false,
}: RegisterProfessionalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [existingProfileData, setExistingProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  
  const isSuperAdmin = hasRoleSync('super_admin');

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
      setCurrentUser(user);
      
      if (!user && open) {
        toast.error("Please log in to register as a sports professional");
        onOpenChange(false);
      }
    };
    
    if (open) {
      checkAuth();
    }
  }, [open, onOpenChange]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (currentUser && !isSuperAdmin) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('email')
            .eq('id', currentUser.id)
            .single();
          
          if (userData && !error) {
            setUserEmail(userData.email);
          }
        } catch (error) {
          console.error('Error fetching user email:', error);
        }
      }
    };

    fetchUserEmail();
  }, [currentUser, isSuperAdmin]);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (isUpdate && currentUser && open && !isSuperAdmin) {
        setIsLoadingProfile(true);
        try {
          console.log('Fetching existing profile for user:', currentUser);
          
          let userId = currentUser.id;
          
          if ('phone' in currentUser && currentUser.phone) {
            console.log('Phone user detected, looking up user record by phone:', currentUser.phone);
            const { data: existingUser, error: userError } = await supabase
              .from('users')
              .select('id')
              .eq('phone', currentUser.phone)
              .single();
            
            if (userError) {
              console.error('Error finding user by phone:', userError);
              if (userError.code !== 'PGRST116') {
                throw userError;
              }
            } else if (existingUser) {
              userId = existingUser.id;
              console.log('Found user record with ID:', userId);
            }
          }

          console.log('Searching for professional profile with user_id:', userId);
          let { data: profile, error } = await supabase
            .from('sports_professionals')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (error) {
            console.error('Error fetching existing profile by user_id:', error);
            throw error;
          }

          if (!profile) {
            console.log('No profile found by user_id, searching by contact info...');
            const contactQueries = [];
            
            if (userEmail) {
              contactQueries.push(
                supabase
                  .from('sports_professionals')
                  .select('*')
                  .eq('contact_number', userEmail)
                  .maybeSingle()
              );
            }
            
            if (currentUser.phone) {
              contactQueries.push(
                supabase
                  .from('sports_professionals')
                  .select('*')
                  .eq('contact_number', currentUser.phone)
                  .maybeSingle()
              );
            }

            for (const query of contactQueries) {
              const { data: contactProfile, error: contactError } = await query;
              if (contactError) {
                console.error('Error searching by contact:', contactError);
                continue;
              }
              if (contactProfile) {
                console.log('Found profile by contact info:', contactProfile);
                profile = contactProfile;
                
                const { error: linkError } = await supabase
                  .from('sports_professionals')
                  .update({ user_id: userId })
                  .eq('id', contactProfile.id);
                
                if (linkError) {
                  console.error('Error linking profile to user:', linkError);
                } else {
                  console.log('Successfully linked profile to user');
                  profile.user_id = userId;
                }
                break;
              }
            }
          }

          if (profile) {
            console.log('Found existing profile:', profile);
            setExistingProfileData(profile);
          } else {
            console.log('No existing profile found for user');
            setExistingProfileData(null);
            toast.info('No existing profile found. You can create a new one.');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load existing profile');
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchExistingProfile();
  }, [isUpdate, currentUser, open, userEmail, isSuperAdmin]);

  const {
    form,
    currentStep,
    totalSteps,
    stepTitles,
    registerMutation,
    handleNext,
    handlePrevious,
    resetForm,
    onSubmit,
  } = useRegisterProfessionalForm(() => {
    onOpenChange(false);
    resetForm();
  }, isUpdate);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit prevented, currentStep:', currentStep, 'totalSteps:', totalSteps);
    
    if (currentStep === totalSteps) {
      console.log('On final step, proceeding with form submission');
      const values = form.getValues();
      onSubmit(values);
    } else {
      console.log('Not on final step, ignoring submit event');
    }
  };

  const handleSubmitButtonClick = () => {
    console.log('Submit button clicked on step:', currentStep);
    if (currentStep === totalSteps) {
      const values = form.getValues();
      onSubmit(values);
    }
  };

  useEffect(() => {
    if (currentUser && open && !isLoadingProfile) {
      console.log('Pre-filling form data...');
      console.log('Is super admin:', isSuperAdmin);
      console.log('Is update:', isUpdate);
      console.log('Has existing profile:', hasExistingProfile);
      
      if (isSuperAdmin && !isUpdate) {
        console.log('Super admin creating new professional - using fresh form');
        form.reset({
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
          years_of_experience: undefined,
          total_match_played: undefined,
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
          level: undefined,
          coaching_availability: [],
        });
      } else if (isUpdate && existingProfileData) {
        console.log('Pre-filling with existing data:', existingProfileData);
        
        // Set each field individually to ensure proper type conversion
        const fieldsToSet = [
          ['name', existingProfileData.name || ''],
          ['profession_type', existingProfileData.profession_type || 'Athlete'],
          ['game_id', existingProfileData.game_id || ''],
          ['contact_number', existingProfileData.contact_number || ''],
          ['email', userEmail],
          ['fee', existingProfileData.fee || 0],
          ['fee_type', existingProfileData.fee_type || 'Per Hour'],
          ['city', existingProfileData.city || ''],
          ['address', existingProfileData.address || ''],
          ['comments', existingProfileData.comments || ''],
          ['photo', existingProfileData.photo || ''],
          ['years_of_experience', existingProfileData.years_of_experience || undefined],
          ['total_match_played', existingProfileData.total_match_played || undefined],
          ['awards', existingProfileData.awards || []],
          ['accomplishments', existingProfileData.accomplishments || []],
          ['certifications', existingProfileData.certifications || []],
          ['training_locations', existingProfileData.training_locations || []],
          ['videos', existingProfileData.videos || []],
          ['images', existingProfileData.images || []],
          ['punch_line', existingProfileData.punch_line || ''],
          ['instagram_link', existingProfileData.instagram_link || ''],
          ['facebook_link', existingProfileData.facebook_link || ''],
          ['linkedin_link', existingProfileData.linkedin_link || ''],
          ['website', existingProfileData.website || ''],
          ['level', existingProfileData.level || undefined],
          ['coaching_availability', existingProfileData.coaching_availability || []],
        ];

        fieldsToSet.forEach(([field, value]) => {
          form.setValue(field as any, value);
        });
        
        console.log('Form values after pre-fill:', form.getValues());
      } else if (!hasExistingProfile && !isSuperAdmin) {
        console.log('Regular user creating new profile');
        form.setValue('name', currentUser.name || '');
        form.setValue('email', userEmail);
        
        if (currentUser.phone) {
          form.setValue('contact_number', currentUser.phone);
        }
      }
    }
  }, [currentUser, open, hasExistingProfile, form, isUpdate, existingProfileData, isLoadingProfile, userEmail, isSuperAdmin]);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
      setExistingProfileData(null);
    }
    onOpenChange(open);
  };

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const dialogTitle = isSuperAdmin && !isUpdate 
    ? "Register New Sports Professional" 
    : isUpdate 
      ? "Update Your Profile" 
      : "Register as Sports Professional";

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center pb-4 pt-4">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        {isLoadingProfile ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(90vh-120px)] px-1">
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <StepperForm
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  stepTitles={stepTitles}
                />
                <StepContentRenderer 
                  currentStep={currentStep} 
                  form={form} 
                  userEmail={userEmail}
                  isUpdate={isUpdate}
                />
                <div className="bottom-end">
                  <FormNavigation
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSubmit={handleSubmitButtonClick}
                    isSubmitting={registerMutation.isPending}
                    isUpdate={isUpdate}
                  />
                </div>
              </form>
            </Form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterProfessionalDialog;

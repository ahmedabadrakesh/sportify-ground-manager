
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

  // Fetch existing profile data if in update mode
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (isUpdate && currentUser && open) {
        setIsLoadingProfile(true);
        try {
          console.log('Fetching existing profile for user:', currentUser);
          
          let userId = currentUser.id;
          
          // Handle phone users
          if ('phone' in currentUser && currentUser.phone) {
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('phone', currentUser.phone)
              .single();
            
            if (existingUser) {
              userId = existingUser.id;
            }
          }

          const { data: profile, error } = await supabase
            .from('sports_professionals')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching existing profile:', error);
            toast.error('Failed to load existing profile');
            return;
          }

          if (profile) {
            console.log('Fetched existing profile:', profile);
            setExistingProfileData(profile);
          } else {
            console.log('No existing profile found');
            setExistingProfileData(null);
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
  }, [isUpdate, currentUser, open]);

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

  // Pre-fill form data when data is available
  useEffect(() => {
    if (currentUser && open && !isLoadingProfile) {
      console.log('Pre-filling form data...');
      
      if (isUpdate && existingProfileData) {
        // Pre-fill with existing professional data
        console.log('Pre-filling with existing data:', existingProfileData);
        
        // Set each field individually to ensure proper type conversion
        form.setValue('name', existingProfileData.name || '');
        form.setValue('profession_type', existingProfileData.profession_type || 'Athlete');
        form.setValue('game_id', existingProfileData.game_id || '');
        form.setValue('contact_number', existingProfileData.contact_number || '');
        form.setValue('fee', existingProfileData.fee || 0);
        form.setValue('fee_type', existingProfileData.fee_type || 'Per Hour');
        form.setValue('city', existingProfileData.city || '');
        form.setValue('address', existingProfileData.address || '');
        form.setValue('comments', existingProfileData.comments || '');
        form.setValue('photo', existingProfileData.photo || '');
        form.setValue('awards', existingProfileData.awards || []);
        form.setValue('accomplishments', existingProfileData.accomplishments || []);
        form.setValue('certifications', existingProfileData.certifications || []);
        form.setValue('training_locations', existingProfileData.training_locations || []);
        form.setValue('videos', existingProfileData.videos || []);
        form.setValue('images', existingProfileData.images || []);
        form.setValue('punch_line', existingProfileData.punch_line || '');
        form.setValue('instagram_link', existingProfileData.instagram_link || '');
        form.setValue('facebook_link', existingProfileData.facebook_link || '');
        form.setValue('linkedin_link', existingProfileData.linkedin_link || '');
        form.setValue('website', existingProfileData.website || '');
        form.setValue('level', existingProfileData.level || undefined);
        form.setValue('coaching_availability', existingProfileData.coaching_availability || []);
        
        console.log('Form values after pre-fill:', form.getValues());
      } else if (!hasExistingProfile) {
        // Pre-fill with basic user information for new registrations
        form.setValue('name', currentUser.name || '');
        if (currentUser.email) {
          form.setValue('contact_number', currentUser.email);
        } else if (currentUser.phone) {
          form.setValue('contact_number', currentUser.phone);
        }
      }
    }
  }, [currentUser, open, hasExistingProfile, form, isUpdate, existingProfileData, isLoadingProfile]);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
      setExistingProfileData(null);
    }
    onOpenChange(open);
  };

  // Don't render the dialog if authentication status is still loading
  if (isAuthenticated === null) {
    return null;
  }

  // Don't render the dialog if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const dialogTitle = isUpdate ? "Update Your Profile" : "Register as Sports Professional";

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <StepperForm
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  stepTitles={stepTitles}
                />
                <StepContentRenderer currentStep={currentStep} form={form} />
                <div className="bottom-end">
                  <FormNavigation
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
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

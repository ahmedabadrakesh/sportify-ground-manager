
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
        try {
          const { data: profile, error } = await supabase
            .from('sports_professionals')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching existing profile:', error);
            return;
          }

          if (profile) {
            setExistingProfileData(profile);
            console.log('Fetched existing profile:', profile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
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

  // Pre-fill form data when user is available and dialog opens
  useEffect(() => {
    if (currentUser && open) {
      if (isUpdate && existingProfileData) {
        // Pre-fill with existing professional data
        console.log('Pre-filling form with existing data:', existingProfileData);
        Object.keys(existingProfileData).forEach((key) => {
          if (key in form.getValues()) {
            form.setValue(key as any, existingProfileData[key]);
          }
        });
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
  }, [currentUser, open, hasExistingProfile, form, isUpdate, existingProfileData]);

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
      </DialogContent>
    </Dialog>
  );
};

export default RegisterProfessionalDialog;

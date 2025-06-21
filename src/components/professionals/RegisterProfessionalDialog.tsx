
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
  });

  // Pre-fill form data when user is available and dialog opens
  useEffect(() => {
    if (currentUser && open && !hasExistingProfile) {
      // Pre-fill name and contact information
      form.setValue('name', currentUser.name || '');
      if (currentUser.email) {
        form.setValue('contact_number', currentUser.email);
      } else if (currentUser.phone) {
        form.setValue('contact_number', currentUser.phone);
      }
    }
  }, [currentUser, open, hasExistingProfile, form]);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
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

import React from "react";
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

interface RegisterProfessionalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterProfessionalDialog = ({
  open,
  onOpenChange,
}: RegisterProfessionalProps) => {
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

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center pb-4 pt-4">
            Register as Sports Professional
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

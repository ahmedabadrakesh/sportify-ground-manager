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
          <DialogTitle className="text-center">
            Register as Sports Professional
            <div className="pb-2 pt-2">
              <hr className="w-49 h-0.5 mx-auto my-2 bg-orange-300 border-0 rounded-sm md:my-4" />
            </div>
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

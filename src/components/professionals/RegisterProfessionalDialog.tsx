
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PhotoUpload } from "./components/PhotoUpload";
import { ProfessionalFormFields } from "./components/ProfessionalFormFields";
import { professionalFormSchema, type ProfessionalFormValues } from "./schemas/professionalFormSchema";
import { Database } from "@/integrations/supabase/types";

type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];
type FeeType = Database["public"]["Enums"]["fee_type"];

interface RegisterProfessionalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterProfessionalDialog = ({ open, onOpenChange }: RegisterProfessionalProps) => {
  const queryClient = useQueryClient();
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: "",
      profession_type: "Athlete" as ProfessionType, // Default to a valid enum value
      game_id: "",
      contact_number: "",
      fee: "0", // Will be transformed to number by the schema
      fee_type: "Per Hour" as FeeType, // Default to a valid enum value
      city: "",
      address: "",
      comments: "",
      photo: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      // Fee is already transformed to a number by zod schema
      const { error } = await supabase
        .from('sports_professionals')
        .insert(values);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Successfully registered as a sports professional");
      queryClient.invalidateQueries({ queryKey: ["sports-professionals"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    }
  });

  const onSubmit = (values: ProfessionalFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register as Sports Professional</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PhotoUpload form={form} />
            <ProfessionalFormFields form={form} />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterProfessionalDialog;


import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PhotoUpload } from "../../professionals/components/PhotoUpload";
import { ProfessionalFormFields } from "../../professionals/components/ProfessionalFormFields";
import { professionalFormSchema, type ProfessionalFormValues } from "../../professionals/schemas/professionalFormSchema";

interface EditProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: any;
}

const EditProfessionalDialog = ({ open, onOpenChange, professional }: EditProfessionalDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: professional.name,
      profession_type: professional.profession_type,
      game_id: professional.game_id,
      contact_number: professional.contact_number,
      fee: professional.fee,
      fee_type: professional.fee_type,
      city: professional.city,
      address: professional.address,
      comments: professional.comments || "",
      photo: professional.photo || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      const { error } = await supabase
        .from('sports_professionals')
        .update({
          name: values.name,
          profession_type: values.profession_type,
          game_id: values.game_id,
          contact_number: values.contact_number,
          fee: values.fee,
          fee_type: values.fee_type,
          city: values.city,
          address: values.address,
          comments: values.comments || null,
          photo: values.photo || null
        })
        .eq('id', professional.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Professional details updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-sports-professionals"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update professional details");
      console.error("Update error:", error);
    }
  });

  const onSubmit = (values: ProfessionalFormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Professional Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PhotoUpload form={form} />
              <ProfessionalFormFields form={form} />
              <Button type="submit" className="w-full">
                Update Professional
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfessionalDialog;


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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      profession_type: "Athlete",
      game_id: "",
      contact_number: "",
      fee: 0,
      fee_type: "Per Hour",
      city: "",
      address: "",
      comments: "",
      photo: "",
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
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: ProfessionalFormValues) => {
      const professionalData = {
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Register as Sports Professional</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PhotoUpload form={form} />
              <ProfessionalFormFields form={form} />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterProfessionalDialog;


import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ground } from "@/types/models";
import { groundSchema } from "./groundFormSchema";
import GroundBasicDetails from "./GroundBasicDetails";
import GroundFeatures from "./GroundFeatures";
import GroundOwnerSelect from "./GroundOwnerSelect";
import { useGroundsData } from "@/hooks/useGroundsData";

interface EditGroundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ground: Ground;
  owners: any[];
  isSuperAdmin: boolean;
}

const EditGroundDialog = ({ 
  open, 
  onOpenChange, 
  ground, 
  owners, 
  isSuperAdmin 
}: EditGroundDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(groundSchema),
    defaultValues: {
      name: ground.name,
      description: ground.description || "",
      address: ground.address,
      ownerId: ground.ownerId,
      games: ground.games || [],
      facilities: ground.facilities?.join(", ") || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      const facilitiesArray = values.facilities
        ? values.facilities.split(",").map((f: string) => f.trim())
        : [];

      const { error } = await supabase
        .from('grounds')
        .update({
          name: values.name,
          description: values.description,
          address: values.address,
          owner_id: isSuperAdmin ? values.ownerId : ground.ownerId,
          games: values.games,
          facilities: facilitiesArray,
        })
        .eq('id', ground.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ground updated successfully");
      queryClient.invalidateQueries({ queryKey: ["grounds"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update ground");
      console.error("Update error:", error);
    }
  });

  const onSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Ground</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <GroundBasicDetails form={form} />
              {isSuperAdmin && <GroundOwnerSelect form={form} owners={owners} />}
              <GroundFeatures form={form} />
              <Button type="submit" className="w-full">
                Update Ground
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroundDialog;

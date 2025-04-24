
import React, { useEffect, useState } from "react";
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
import { groundSchema, GroundFormValues } from "./groundFormSchema";
import GroundBasicDetails from "./GroundBasicDetails";
import GroundFeatures from "./GroundFeatures";
import GroundOwnerSelect from "./GroundOwnerSelect";
import GroundImageUpload from "./GroundImageUpload";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(ground.images || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const form = useForm<GroundFormValues>({
    resolver: zodResolver(groundSchema),
    defaultValues: {
      name: ground.name,
      description: ground.description || "",
      address: ground.address,
      ownerId: ground.ownerId,
      games: ground.games || [],
      facilities: ground.facilities || [],
    },
  });

  useEffect(() => {
    if (open) {
      setExistingImages(ground.images || []);
      setImageFiles([]);
      setRemovedImages([]);
    }
  }, [open, ground]);

  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleRemoveExistingImage = (imgUrl: string) => {
    setExistingImages(prev => prev.filter(url => url !== imgUrl));
    setRemovedImages(prev => [...prev, imgUrl]);
  };

  const handleReplaceExistingImage = (imgUrl: string, file: File) => {
    // Remove old image and add new file for upload
    setExistingImages(prev => prev.filter(url => url !== imgUrl));
    setRemovedImages(prev => [...prev, imgUrl]);
    setImageFiles(prev => [...prev, file]);
  };

  const updateMutation = useMutation({
    mutationFn: async (values: GroundFormValues) => {
      // Remove images from storage if flagged for deletion
      for (const url of removedImages) {
        const path = url.startsWith("public/") ? url.substring(7) : url;
        await supabase.storage.from("grounds").remove([path]);
      }

      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      for (const image of imageFiles) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("grounds")
          .upload(fileName, image);
        if (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("grounds")
          .getPublicUrl(fileName);
        uploadedImageUrls.push(publicUrl);
      }

      const finalImages = [...existingImages, ...uploadedImageUrls];

      const { error } = await supabase
        .from('grounds')
        .update({
          name: values.name,
          description: values.description,
          address: values.address,
          owner_id: isSuperAdmin ? values.ownerId : ground.ownerId,
          games: values.games,
          facilities: values.facilities,
          images: finalImages
        })
        .eq('id', ground.id);

      if (error) throw error;

      // Update ground-facility relationships
      // First delete existing relationships
      const { error: deleteError } = await supabase
        .from('ground_facilities')
        .delete()
        .eq('ground_id', ground.id);

      if (deleteError) throw deleteError;

      // Now insert new relationships
      if (values.facilities && values.facilities.length > 0) {
        const facilityRelations = values.facilities.map((facilityId: string) => ({
          ground_id: ground.id,
          facility_id: facilityId
        }));

        const { error: relationError } = await supabase
          .from('ground_facilities')
          .insert(facilityRelations);

        if (relationError) throw relationError;
      }
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

  const onSubmit = (values: GroundFormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader>
          <DialogTitle className="p-6 pb-2">Edit Ground</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] px-1">
          <div className="py-4 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <GroundBasicDetails form={form} />
                {isSuperAdmin && <GroundOwnerSelect form={form} owners={owners} />}
                <GroundFeatures form={form} />
                <div>
                  <label className="block font-medium mb-2 text-sm">Images</label>
                  <div className="flex flex-wrap gap-3 mb-2">
                    {existingImages.map((imgUrl, idx) => (
                      <div key={imgUrl} className="relative group">
                        <img
                          src={imgUrl.startsWith("public/") ? imgUrl.substring(7) : imgUrl}
                          alt={`Ground Image ${idx + 1}`}
                          className="w-28 h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveExistingImage(imgUrl)}
                          aria-label="Remove"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <GroundImageUpload onImagesChange={handleImagesChange} />
                </div>
                <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                  Update Ground
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroundDialog;

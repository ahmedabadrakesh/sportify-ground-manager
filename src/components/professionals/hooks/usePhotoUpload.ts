
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UseFormSetValue } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

export const usePhotoUpload = (setValue: UseFormSetValue<ProfessionalFormValues>) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('professionals')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('professionals')
        .getPublicUrl(filePath);

      setPhotoPreview(publicUrl);
      setValue('photo', publicUrl);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Error uploading photo');
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  return {
    photoPreview,
    setPhotoPreview,
    uploading,
    handleImageUpload
  };
};

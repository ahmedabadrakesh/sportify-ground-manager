
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventFormValues } from "./eventFormSchema";

interface EventImageUploadProps {
  form: UseFormReturn<EventFormValues>;
}

const EventImageUpload = ({ form }: EventImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(form.getValues("image") || null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `event-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // First, try to create the bucket if it doesn't exist
      try {
        await supabase.storage.createBucket('events', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        console.log("Bucket created or already exists");
      } catch (bucketError: any) {
        // If the bucket already exists, this will error but we can proceed
        if (!bucketError.message?.includes('duplicate key value')) {
          console.log("Bucket error but proceeding:", bucketError);
        }
      }

      // Small delay to ensure bucket is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try to upload the file
      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      setImagePreview(publicUrl);
      form.setValue('image', publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error('Error uploading image: ' + (error.message || 'Unknown error'));
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormField
      name="image"
      control={form.control}
      render={() => (
        <FormItem>
          <FormLabel>Event Image</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue('image', null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <label
                    htmlFor="event-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                    <input
                      id="event-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventImageUpload;

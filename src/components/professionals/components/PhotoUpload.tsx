import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

interface PhotoUploadProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const PhotoUpload = ({ form }: PhotoUploadProps) => {
  const { photoPreview, setPhotoPreview, uploading, handleImageUpload } =
    usePhotoUpload(form.setValue);

  return (
    <FormField
      name="photo"
      control={form.control}
      render={() => (
        <FormItem>
          <FormLabel>Photo</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center space-y-4 border-2 border-primary  border-dashed">
              {photoPreview ? (
                <div className="relative w-32 h-32">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setPhotoPreview(null);
                      form.setValue("photo", null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-32 h-32 rounded-lg cursor-pointer hover:border-primary"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-xs text-gray-500">Upload photo</p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
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

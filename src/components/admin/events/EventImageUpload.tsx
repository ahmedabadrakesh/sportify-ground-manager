
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { EventFormValues } from "./eventFormSchema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// AWS S3 configuration
const s3Client = new S3Client({
  region: "us-east-1", // Replace with your S3 bucket region
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = "zotest123456";

interface EventImageUploadProps {
  form: UseFormReturn<EventFormValues>;
}

const EventImageUpload = ({ form }: EventImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(form.getValues("image") || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);
      setUploadProgress(0);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `event-${Date.now()}.${fileExt}`;
      
      // Convert file to buffer
      const fileArrayBuffer = await file.arrayBuffer();
      
      // Create upload command
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileArrayBuffer,
        ContentType: file.type,
        ACL: "public-read", // Make the file publicly readable
      });
      
      // Upload to S3
      const uploadResult = await s3Client.send(uploadCommand);
      
      if (uploadResult.$metadata.httpStatusCode === 200) {
        // Construct the image URL based on bucket name and region
        const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        
        setImagePreview(publicUrl);
        form.setValue('image', publicUrl);
        toast.success('Image uploaded successfully');
        setUploadProgress(100);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image: ' + (error.message || 'Unknown error'));
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
                  {uploading && (
                    <div className="w-full mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-500">Uploading...</p>
                        <p className="text-sm text-gray-500">{uploadProgress}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
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

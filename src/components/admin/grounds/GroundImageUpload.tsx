
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface GroundImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

const GroundImageUpload: React.FC<GroundImageUploadProps> = ({ onImagesChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles(prev => {
      const updatedFiles = [...prev, ...newFiles];
      onImagesChange(updatedFiles);
      return updatedFiles;
    });

    // Generate previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      onImagesChange(updated);
      return updated;
    });

    setPreviews(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <FormItem>
      <FormLabel>Add Images</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
            <Input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>
        Upload images of your ground to attract more customers
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export default GroundImageUpload;

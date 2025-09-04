import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArrayFieldInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  label: string;
  type?: string;
}

export const ArrayFieldInput = ({
  value = [],
  onChange,
  placeholder,
  label,
  type = "non known",
}: ArrayFieldInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showImageAlert, setShowImageAlert] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/svg+xml",
        "image/webp",
        "image/bmp",
        "image/tiff",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (jpg, png, gif, svg, webp, bmp, tiff)"
        );
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("professionals")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("professionals").getPublicUrl(filePath);

      // Add the uploaded image URL to the array
      onChange([...value, publicUrl]);
      toast.success("Image uploaded successfully");

      // Reset file input
      event.target.value = "";
    } catch (error) {
      toast.error("Error uploading image");
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const addItem = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue || value.includes(trimmedValue)) {
      return;
    }

    // Validate image URLs when type is "image"
    if (type === "image") {
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".svg",
        ".webp",
        ".bmp",
        ".tiff",
      ];
      const hasValidExtension = imageExtensions.some((ext) =>
        trimmedValue.toLowerCase().endsWith(ext)
      );

      if (!hasValidExtension) {
        // alert(
        //   "Please enter a valid image URL ending with: " +
        //     imageExtensions.join(", ")
        // );
        setShowImageAlert(true);
        return;
      }
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      {showImageAlert && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Not an Image</span>Please enter URL of
          Image
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setShowImageAlert(false);
            setInputValue(e.target.value);
          }}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" variant="secondary" onClick={addItem} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {type === "image" && (
        <div className="flex gap-2 items-center">
          <div className="text-sm text-muted-foreground">Or upload image:</div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id={`file-upload-${label}`}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById(`file-upload-${label}`)?.click()
              }
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        {value.map((item, index) => (
          <div key={index} className="relative">
            {type === "image" ? (
              <>
                <img
                  src={item}
                  alt={`Image ${index + 1}`}
                  className="w-12 h-12 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                  onClick={() => removeItem(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                {item}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeItem(index)}
                />
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

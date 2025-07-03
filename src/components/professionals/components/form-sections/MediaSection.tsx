
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { ArrayFieldInput } from "../ArrayFieldInput";

interface MediaSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const MediaSection = ({ form }: MediaSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Media</h3>
      
      <FormField
        name="videos"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Links</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add video URL"
                label="Videos"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="images"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URLs</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add image URL"
                label="Images"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

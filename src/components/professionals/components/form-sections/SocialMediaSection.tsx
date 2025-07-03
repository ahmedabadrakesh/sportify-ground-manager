
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";

interface SocialMediaSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const SocialMediaSection = ({ form }: SocialMediaSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Social Media & Website</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://yourwebsite.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instagram_link"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://instagram.com/yourusername" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="facebook_link"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://facebook.com/yourpage" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="linkedin_link"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://linkedin.com/in/yourprofile" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

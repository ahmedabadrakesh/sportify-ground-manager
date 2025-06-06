
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { ArrayFieldInput } from "./ArrayFieldInput";

interface StepFourProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFour = ({ form }: StepFourProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Media & Additional Info</h2>
        <p className="text-muted-foreground">Share your portfolio and tell us more about yourself</p>
      </div>

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
                placeholder="Add video URL (YouTube, Vimeo, etc.)"
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

      <FormField
        name="comments"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>About Me</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Tell us more about yourself, your experience, and what makes you unique..." 
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Review Your Information</h3>
        <p className="text-sm text-muted-foreground">
          Please review all the information you've provided before submitting your registration. 
          You can go back to previous steps to make any changes.
        </p>
      </div>
    </div>
  );
};


import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { ArrayFieldInput } from "./ArrayFieldInput";
import { Video, Image, Upload, CheckCircle } from "lucide-react";

interface StepSixProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepSix = ({ form }: StepSixProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Video className="w-6 h-6" />
          Media & Portfolio
        </h2>
        <p className="text-muted-foreground">Showcase your work and tell us about yourself</p>
      </div>

      <FormField
        name="videos"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Links
            </FormLabel>
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
            <FormLabel className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Image URLs
            </FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add image URL or upload images"
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

      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Ready to Submit?
        </h3>
        <p className="text-sm text-muted-foreground">
          Please review all the information you've provided before submitting your registration. 
          You can go back to previous steps to make any changes if needed.
        </p>
      </div>
    </div>
  );
};

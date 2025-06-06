
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { Globe, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";

interface StepFourProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFour = ({ form }: StepFourProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Social Profile</h2>
        <p className="text-muted-foreground">Connect your social media accounts</p>
      </div>

      <div className="space-y-4">
        <FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </FormLabel>
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
              <FormLabel className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </FormLabel>
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
              <FormLabel className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </FormLabel>
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
              <FormLabel className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://linkedin.com/in/yourprofile" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Youtube className="w-4 h-4" />
            YouTube Channel
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            If you have a YouTube channel, you can add individual video links in the next step.
          </p>
        </div>
      </div>
    </div>
  );
};

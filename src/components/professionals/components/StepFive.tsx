import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { Globe, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";

interface StepFiveProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFive = ({ form }: StepFiveProps) => {
  return (
    <div className="space-y-6">
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
                <Input
                  {...field}
                  placeholder="https://instagram.com/yourusername"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="youtube_link"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://youtube.com/yourchannel"
                />
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
                <Input
                  {...field}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-green/10 to-green/5 rounded-lg border border-green/20">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Social Media Benefits
        </h3>
        <p className="text-sm text-muted-foreground">
          Connecting your social media accounts helps build trust and allows
          potential clients to learn more about your work and personality.
        </p>
      </div>
    </div>
  );
};

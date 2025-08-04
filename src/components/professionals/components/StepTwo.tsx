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
import { Switch } from "@/components/ui/switch";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";

interface StepTwoProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const StepTwo = ({ form, userEmail, isUpdate }: StepTwoProps) => {
  const watchWhatsAppSame = form.watch("whatsapp_same_as_phone");
  const watchContactNumber = form.watch("contact_number");

  React.useEffect(() => {
    if (watchWhatsAppSame && watchContactNumber) {
      form.setValue("whatsapp", watchContactNumber);
    }
  }, [watchWhatsAppSame, watchContactNumber, form]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Contact & Social Details</h3>
      
      {/* Contact Number & Email in Single Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FormField
          name="contact_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* WhatsApp Toggle */}
      <div className="space-y-4">
        <FormField
          name="whatsapp_same_as_phone"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  WhatsApp same as phone number
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Use the same number for WhatsApp contact
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!watchWhatsAppSame && (
          <FormField
            name="whatsapp"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="WhatsApp number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Social Media Links */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Social Media Links</h4>
        
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            name="instagram_link"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Instagram profile URL" />
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
                <FormLabel>YouTube</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="YouTube channel URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            name="linkedin_link"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="LinkedIn profile URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="website"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Personal website URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

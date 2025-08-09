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
    <div className="w-[98%] items-center">
      <h2 className="text-2xl font-bold mb-4">Contact & Social Details</h2>
      <hr className="pb-6" />

      {/* Address and City Row */}
      <div className="grid lg:grid-cols-2 gap-6 pb-4">
        {/* Left: Address */}
        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your complete address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Right: City */}
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your city" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

        <div className="hidden md:block">
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
      </div>
      {/* WhatsApp Toggle */}
      <div className="space-y-4">
        <FormField
          name="whatsapp_same_as_phone"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-row md:w-1/2 p-2 gap-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              Same for WhatsApp?
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

      <div className="md:hidden mt-6">
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

      {/* Social Media Links */}
      <div className="space-y-4 pt-4">
        <h4 className="text-md font-medium">Social Media Links</h4>
        <hr />
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

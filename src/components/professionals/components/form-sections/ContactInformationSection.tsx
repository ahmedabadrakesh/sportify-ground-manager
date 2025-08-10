
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { Mail } from "lucide-react";
import { hasRoleSync } from "@/utils/auth";

interface ContactInformationSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const ContactInformationSection = ({ form, userEmail, isUpdate = false }: ContactInformationSectionProps) => {
  const isSuperAdmin = hasRoleSync('super_admin');
  const isEmailDisabled = isUpdate || (!isSuperAdmin && !!userEmail);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      
      <FormField
        name="contact_number"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input {...field} />
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
            <FormLabel className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                disabled={isEmailDisabled}
                className={isEmailDisabled ? "bg-gray-100 cursor-not-allowed" : ""}
                placeholder={
                  isSuperAdmin && !isUpdate 
                    ? "Enter email address for new professional" 
                    : "Email address"
                }
              />
            </FormControl>
            {isEmailDisabled && (
              <p className="text-xs text-muted-foreground">
                {isUpdate ? "Email cannot be changed during profile updates." : "This is your registration email and cannot be changed."}
              </p>
            )}
            {isSuperAdmin && !isUpdate && (
              <p className="text-xs text-muted-foreground">
                Enter the email address for the new sports professional. A user account will be created with this email.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="city"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

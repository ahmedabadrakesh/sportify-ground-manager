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
import { Phone, Mail, MapPin, Building } from "lucide-react";

interface StepFourProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFour = ({ form }: StepFourProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          name="contact_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Number *
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter phone number" />
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
                Email
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your full address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="city"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              City *
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your city" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="p-4 bg-gradient-to-r from-blue/10 to-blue/5 rounded-lg border border-blue/20">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contact Tip
        </h3>
        <p className="text-sm text-muted-foreground">
          Make sure your contact information is accurate so potential clients
          can easily reach out to you.
        </p>
      </div>
    </div>
  );
};

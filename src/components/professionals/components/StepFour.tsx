
import React, { useEffect, useState } from "react";
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
import { getCurrentUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

interface StepFourProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFour = ({ form }: StepFourProps) => {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Fetch email from users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('email')
            .eq('id', currentUser.id)
            .single();
          
          if (userData && !error) {
            setUserEmail(userData.email);
            // Set the email in the form for display but don't make it editable
            form.setValue('email', userData.email);
          }
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, [form]);

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
                Email (Registration Email)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="Loading email..."
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                This is your registration email and cannot be changed.
              </p>
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
          can easily reach out to you. Your email address is from your registration and cannot be modified here.
        </p>
      </div>
    </div>
  );
};

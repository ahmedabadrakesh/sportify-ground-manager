import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";

interface FeeInformationSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const FeeInformationSection = ({ form }: FeeInformationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          name="one_on_one_price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-on-One (₹)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="group_session_price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Sessions (₹)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="online_price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Online (₹)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="free_demo_call"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Free 15-min Demo Call
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Offer a free introductory call to potential clients
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
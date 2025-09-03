
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { Database } from "@/integrations/supabase/types";

type FeeType = Database["public"]["Enums"]["fee_type"];

interface FeeInformationSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const FeeInformationSection = ({ form }: FeeInformationSectionProps) => {
  const feeTypes: FeeType[] = [
    "Per Hour", "Per Day", "Per Match"
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Fee Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="fee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="fee_type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {feeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

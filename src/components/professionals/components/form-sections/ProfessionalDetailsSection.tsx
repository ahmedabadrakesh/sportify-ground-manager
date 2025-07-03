
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { ArrayFieldInput } from "../ArrayFieldInput";
import { MultiSelectField } from "../MultiSelectField";

interface ProfessionalDetailsSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const ProfessionalDetailsSection = ({ form }: ProfessionalDetailsSectionProps) => {
  const coachingAvailabilityOptions = ["Personal", "Group", "Home", "Out of City"];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Professional Details</h3>
      
      <FormField
        name="coaching_availability"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <MultiSelectField
              options={coachingAvailabilityOptions}
              value={field.value || []}
              onChange={field.onChange}
              label="Coaching Availability"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="training_locations"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Training Locations</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add training location"
                label="Training Locations"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="awards"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Awards</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add award"
                label="Awards"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="accomplishments"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accomplishments</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add accomplishment"
                label="Accomplishments"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="certifications"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certifications</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add certification"
                label="Certifications"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { ArrayFieldInput } from "./ArrayFieldInput";
import { Award, Star } from "lucide-react";

interface StepTwoProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepTwo = ({ form }: StepTwoProps) => {
  return (
    <div className="space-y-6">
      <FormField
        name="awards"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Awards
            </FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add award or recognition"
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
            <FormLabel className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Accomplishments
            </FormLabel>
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
            <FormLabel className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certifications
            </FormLabel>
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

      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Professional Tip
        </h3>
        <p className="text-sm text-muted-foreground">
          Adding your awards, accomplishments, and certifications helps build
          credibility and trust with potential clients.
        </p>
      </div>
    </div>
  );
};

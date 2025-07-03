
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";

interface CommentsSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const CommentsSection = ({ form }: CommentsSectionProps) => {
  return (
    <FormField
      name="comments"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Comments</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="Additional information about yourself..." />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

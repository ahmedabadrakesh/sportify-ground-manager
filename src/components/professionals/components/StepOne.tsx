
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { PhotoUpload } from "./PhotoUpload";
import { Database } from "@/integrations/supabase/types";
import { User, Award, Trophy } from "lucide-react";

type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];

interface StepOneProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepOne = ({ form }: StepOneProps) => {
  const professionTypes: ProfessionType[] = [
    "Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <User className="w-6 h-6" />
          Basic Information
        </h2>
        <p className="text-muted-foreground">Let's start with your basic details</p>
      </div>

      <PhotoUpload form={form} />

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="punch_line"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Punch Line</FormLabel>
              <FormControl>
                <Input {...field} placeholder="A catchy phrase about yourself" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="profession_type"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select profession type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {professionTypes.map((type) => (
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

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          name="years_of_experience"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Years of Experience
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  placeholder="Enter years of experience" 
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="total_match_played"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Total Matches Played
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  placeholder="Enter total matches played" 
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

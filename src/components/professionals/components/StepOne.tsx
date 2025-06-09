import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { PhotoUpload } from "./PhotoUpload";
import { Database } from "@/integrations/supabase/types";
import { User, Award, Trophy } from "lucide-react";
import TextSuggestionCarousel from "./TextSuggestionCarousel";

type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];

interface StepOneProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepOne = ({ form }: StepOneProps) => {
  const professionTypes: ProfessionType[] = [
    "Athlete",
    "Coach",
    "Trainer",
    "Sports Manager",
    "Support Staff",
    "Player",
    "Umpire",
  ];

  const [suggestedPunchLine, setSuggestedPunchLine] = useState();
  const punchLineData = [
    "I don’t build athletes—I build belief.",

    "Greatness starts with guidance.",

    "Coaching isn’t a job—it’s a mission.",

    "Behind every champion is a coach who believed first.",

    "We don’t train for trophies. We train for legacy.",

    "I coach minds as much as muscles.",

    "Fuel the fire. Focus the fight.",

    "Push harder, think smarter, finish stronger.",

    "I don’t promise wins—I promise work.",

    "Strong bodies are built in the gym. Strong champions are built in the mind.",

    "You don’t need easy. You need possible.",

    "Comfort zones don’t raise champions.",

    "Excuses don’t lift medals. Effort does.",

    "No shortcuts. Just sweat and standards.",

    "Discipline today. Glory tomorrow.",

    "Coach. Mentor. Gamechanger.",

    "Tough love. Real results.",

    "More than drills—it's direction.",

    "Where effort meets elevation.",

    "Respect the grind. Trust the coach.",
  ];

  return (
    <div className="space-y-6">
      <div className="lg:flex lg:flex-row gap-8">
        <div className="lg:w-1/2 md:-w-full md:pb-4">
          <PhotoUpload form={form} />
        </div>
        <div className="flex-none flex-row lg:w-1/2 md:-w-full gap-4 mr-6">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col mb-4">
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              name="punch_line"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Punch Line</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={suggestedPunchLine}
                      placeholder="A catchy phrase about yourself"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextSuggestionCarousel
              suggestions={punchLineData}
              className="max-w-md mx-auto"
              setSuggestedPunchLine={setSuggestedPunchLine}
            />
          </div>
        </div>
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

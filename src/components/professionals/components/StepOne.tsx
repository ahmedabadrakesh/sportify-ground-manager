
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
import { Award } from "lucide-react";
import TextSuggestionCarousel from "./TextSuggestionCarousel";
import { useGames } from "@/hooks/useGames";

type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];

interface StepOneProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
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

  const { games } = useGames();

  const [suggestedPunchLine, setSuggestedPunchLine] = useState(
    form.getValues("punch_line")
  );
  
  const punchLineData = [
    "I don't build athletes—I build belief.",
    "Greatness starts with guidance.",
    "Coaching isn't a job—it's a mission.",
    "Behind every champion is a coach who believed first.",
    "We don't train for trophies. We train for legacy.",
    "I coach minds as much as muscles.",
    "Fuel the fire. Focus the fight.",
    "Push harder, think smarter, finish stronger.",
    "I don't promise wins—I promise work.",
    "Strong bodies are built in the gym. Strong champions are built in the mind.",
    "You don't need easy. You need possible.",
    "Comfort zones don't raise champions.",
    "Excuses don't lift medals. Effort does.",
    "No shortcuts. Just sweat and standards.",
    "Discipline today. Glory tomorrow.",
    "Coach. Mentor. Gamechanger.",
    "Tough love. Real results.",
    "More than drills—it's direction.",
    "Where effort meets elevation.",
    "Respect the grind. Trust the coach.",
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      {/* Top Row: Photo Upload (Left) and Coach Details (Right) */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side: Photo Upload */}
        <div className="space-y-4">
          <PhotoUpload form={form} />
        </div>

        {/* Right Side: Coach Name, Professional Type, Punch Line */}
        <div className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coach Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="profession_type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Role (Professional Type) *</FormLabel>
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
                      onChange={(e) => {
                        setSuggestedPunchLine(e.target.value);
                        field.onChange(e.target.value);
                      }}
                      placeholder="A catchy phrase about yourself"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2">
              <TextSuggestionCarousel
                suggestions={punchLineData}
                className="max-w-full"
                setSuggestedPunchLine={(value) => {
                  form.setValue("punch_line", value);
                  setSuggestedPunchLine(value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Academy Name (Left), Game/Sport (Center), Years of Experience (Right) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Academy Name */}
        <FormField
          name="academy_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academy Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Academy or organization name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Center: Game/Sport */}
        <FormField
          name="game_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game/Sport *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game/sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {games?.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Right: Years of Experience */}
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
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : Number(value));
                  }}
                  placeholder="Enter years of experience"
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

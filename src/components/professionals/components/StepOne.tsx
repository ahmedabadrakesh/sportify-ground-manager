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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { PhotoUpload } from "./PhotoUpload";
import { Database } from "@/integrations/supabase/types";
import { Award } from "lucide-react";
import TextSuggestionCarousel from "./TextSuggestionCarousel";
import { useGames } from "@/hooks/useGames";
import { Switch } from "@/components/ui/switch";

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
    <div className="w-[98%] items-center">
      <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
      <h2 className="text-2xl font-bold mb-4"></h2>
      <hr className="pb-6" />
      {/* Top Row: Photo Upload (Left) and Coach Details (Right) */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side: Photo Upload */}
        <div className="space-y-4">
          <PhotoUpload form={form} />
        </div>

        {/* Right Side: Coach Name, Professional Type */}
        <div className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="age"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 41 }, (_, i) => i + 10).map(
                        (age) => (
                          <SelectItem key={age} value={age.toString()}>
                            {age}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="sex"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="male" />
                        <label htmlFor="male" className="text-sm font-medium">
                          Male
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="female" />
                        <label htmlFor="female" className="text-sm font-medium">
                          Female
                        </label>
                      </div>
                    </RadioGroup>
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
        </div>
      </div>

      {/* Punch Line - Full Width Row */}
      <div className="pt-4 pb-4">
        <FormField
          name="punch_line"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-between rounded-lg border p-4">
              <div className="flex flex-row justify-between items-center rounded-lg border p-4">
                <FormLabel className="items-left min-w-20 ">
                  Punch Line
                </FormLabel>
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
              </div>
              <FormMessage />
              <TextSuggestionCarousel
                suggestions={punchLineData}
                className="w-full"
                setSuggestedPunchLine={(value) => {
                  form.setValue("punch_line", value);
                  setSuggestedPunchLine(value);
                }}
              />
            </FormItem>
          )}
        />
      </div>

      {/* Bottom Row: Academy Name (Left), Years of Experience (Right) */}
      <div className="grid lg:grid-cols-2 gap-6 pt-2">
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
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
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

      {/* Certification Toggle - Full Width Row */}
      <div className="pt-4">
        <FormField
          name="is_certified"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Are you a certified Professional?
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

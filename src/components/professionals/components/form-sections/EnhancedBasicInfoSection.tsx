import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { Database } from "@/integrations/supabase/types";
import { useGames } from "@/hooks/useGames";

type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];

interface EnhancedBasicInfoSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const EnhancedBasicInfoSection = ({
  form,
}: EnhancedBasicInfoSectionProps) => {
  const professionTypes: ProfessionType[] = [
    "Athlete",
    "Coach",
    "Trainer",
    "Sports Manager",
    "Support Staff",
    "Player",
    "Umpire",
  ];

  const levelOptions: string[] = ["Beginner", "Intermediate", "Professional"];
  const { games } = useGames();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input {...field} />
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
            <MultiSelect
              options={professionTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              onValueChange={field.onChange}
              defaultValue={field.value || []}
              placeholder="Select profession types"
              variant="default"
              animation={0.3}
              maxCount={3}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="photo"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Profile photo URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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

      <FormField
        name="games_played"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Games/Sport *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange([value])}
              value={field.value?.[0] || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a game/sport" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {games?.map((game) => (
                  <SelectItem key={game.id} value={game.name}>
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="years_of_experience"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                value={field.value || 0}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

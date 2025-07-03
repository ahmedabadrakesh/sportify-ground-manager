
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { useGames } from "@/hooks/useGames";
import { Database } from "@/integrations/supabase/types";
import { Award, Trophy } from "lucide-react";

type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];

interface BasicInformationSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const BasicInformationSection = ({ form }: BasicInformationSectionProps) => {
  const { games } = useGames();
  
  const professionTypes: ProfessionType[] = [
    "Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"
  ];

  const levelOptions = ["Beginner", "Intermediate", "Professional"];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
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

      <FormField
        name="profession_type"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profession Type</FormLabel>
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

      <FormField
        name="game_id"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Game/Sport</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {games.map((game) => (
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

      <FormField
        name="level"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {levelOptions.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Experience Fields */}
      <div className="grid grid-cols-2 gap-4">
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
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : Number(value));
                  }}
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

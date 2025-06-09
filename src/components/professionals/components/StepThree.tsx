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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGames } from "@/hooks/useGames";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { ArrayFieldInput } from "./ArrayFieldInput";
import { MultiSelectField } from "./MultiSelectField";
import { Database } from "@/integrations/supabase/types";
import { Gamepad2, Target, Users, MapPin, DollarSign } from "lucide-react";

type FeeType = Database["public"]["Enums"]["fee_type"];

interface StepThreeProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepThree = ({ form }: StepThreeProps) => {
  const { games } = useGames();
  const feeTypes: FeeType[] = ["Per Hour", "Per Day", "Per Match"];
  const levelOptions = ["Beginner", "Intermediate", "Professional"];
  const coachingAvailabilityOptions = [
    "Personal",
    "Group",
    "Home",
    "Out of City",
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          name="game_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Game/Sport *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary sport" />
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
                    <SelectValue placeholder="Select your level" />
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
      </div>

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
              icon={<Users className="w-4 h-4" />}
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
            <FormLabel className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Training Locations
            </FormLabel>
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Fee Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            name="fee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="Enter your fee"
                  />
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
                  <SelectContent>
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
    </div>
  );
};

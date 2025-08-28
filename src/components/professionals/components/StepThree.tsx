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
import { useGames } from "@/hooks/useGames";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { ArrayFieldInput } from "./ArrayFieldInput";
import { MultiSelect } from "@/components/ui/multi-select";
import { Gamepad2, Trophy, Target, Award, GraduationCap } from "lucide-react";

interface StepThreeProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepThree = ({ form }: StepThreeProps) => {
  const { games } = useGames();
  const gameOptions =
    games?.map((game) => ({
      label: game.name,
      value: game.name,
      icon: Gamepad2,
    })) || [];

  return (
    <div className="w-[98%] items-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">Professional Details</h2>
        <hr className="pb-6" />

        {/* Games/Sport Multi Select */}
        <FormField
          name="games_played"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Games/Sport *
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={gameOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value || []}
                  placeholder="Select Games/Sports, Select one or more"
                  maxCount={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tournament Participation Numbers */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Tournament Participation – Numbers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              name="district_level_tournaments"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District Level</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="state_level_tournaments"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Level</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="national_level_tournaments"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Level</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="international_level_tournaments"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>International</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder=""
                      maxLength={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Specialties and Achievements */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <FormField
            name="specialties"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Specialties
                </FormLabel>
                <FormControl>
                  <ArrayFieldInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add specialty"
                    label="Specialties"
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
                  <Award className="w-4 h-4" />
                  Achievements
                </FormLabel>
                <FormControl>
                  <ArrayFieldInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add achievement"
                    label="Achievements"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Certifications & Education */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <FormField
            name="certifications"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
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

          <FormField
            name="education"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Education
                </FormLabel>
                <FormControl>
                  <ArrayFieldInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add education"
                    label="Education"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

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
import { MultiSelectField } from "./MultiSelectField";
import { Gamepad2, Trophy, Target, Award, GraduationCap } from "lucide-react";

interface StepThreeProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepThree = ({ form }: StepThreeProps) => {
  const { games } = useGames();
  const gameOptions = games?.map(game => game.name) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Professional Details</h2>
        
        {/* Games/Sport Multi Select */}
        <FormField
          name="games_played"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
              <MultiSelectField
                options={gameOptions}
                value={field.value || []}
                onChange={field.onChange}
                label="Games/Sport *"
                icon={<Gamepad2 className="w-4 h-4" />}
              />
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
                    <Input
                      type="number"
                      {...field}
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      placeholder="0"
                    />
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
                      type="number"
                      {...field}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Specialties */}
        <FormField
          name="specialties"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
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

        {/* Achievements */}
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
    </div>
  );
};

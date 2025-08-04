import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { ArrayFieldInput } from "../ArrayFieldInput";

interface TournamentParticipationSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const TournamentParticipationSection = ({ form }: TournamentParticipationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Professional Details</h3>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Tournament Participation</h4>
        <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                    placeholder="Number of tournaments"
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
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                    placeholder="Number of tournaments"
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
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                    placeholder="Number of tournaments"
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
                <FormLabel>International Level</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                    placeholder="Number of tournaments"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        name="specialties"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialties</FormLabel>
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
        name="certifications"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certifications & Licenses</FormLabel>
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
            <FormLabel>Education</FormLabel>
            <FormControl>
              <ArrayFieldInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add education qualification"
                label="Education"
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
            <FormLabel>Achievements</FormLabel>
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
  );
};
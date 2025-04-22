
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { useGames } from "@/hooks/useGames";
import { Database } from "@/integrations/supabase/types";

// Get the enum types from the database types
type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];
type FeeType = Database["public"]["Enums"]["fee_type"];

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const ProfessionalFormFields = ({ form }: ProfessionalFormFieldsProps) => {
  const { games } = useGames();
  
  // Use the actual enum values from the database
  const professionTypes: ProfessionType[] = [
    "Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"
  ];
  
  const feeTypes: FeeType[] = [
    "Per Hour", "Per Day", "Per Match"
  ];

  return (
    <>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="fee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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

      <FormField
        name="contact_number"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="city"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="comments"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comments</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

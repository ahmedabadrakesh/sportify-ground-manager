
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGames } from "@/hooks/useGames";
import { EventFormValues } from "./eventFormSchema";

interface EventSportSelectorProps {
  form: UseFormReturn<EventFormValues>;
}

const EventSportSelector = ({ form }: EventSportSelectorProps) => {
  const { games } = useGames();
  
  return (
    <FormField
      control={form.control}
      name="sportId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sport</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
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
  );
};

export default EventSportSelector;

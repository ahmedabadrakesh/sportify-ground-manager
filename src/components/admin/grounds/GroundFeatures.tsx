
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GroundFormValues } from "./groundFormSchema";
import { useGames } from "@/hooks/useGames";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

interface GroundFeaturesProps {
  form: UseFormReturn<GroundFormValues>;
}

const GroundFeatures: React.FC<GroundFeaturesProps> = ({ form }) => {
  const { games, loading } = useGames();

  // Handle multi-select for games
  const selectedGames: string[] = form.watch("games") || [];

  const handleMultiSelect = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      form.setValue("games", selectedGames.filter(id => id !== gameId));
    } else {
      form.setValue("games", [...selectedGames, gameId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="games"
        render={() => (
          <FormItem>
            <FormLabel>Games</FormLabel>
            <div className="flex flex-col gap-2">
              {loading && <div className="text-xs text-gray-500">Loading games...</div>}
              {!loading && games.length === 0 && <div className="text-xs text-red-500">No games found</div>}
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto border rounded p-2 bg-gray-50">
                {games.map((game) => (
                  <label key={game.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game.id)}
                      onChange={() => handleMultiSelect(game.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{game.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facilities</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g. Changing Room, Parking, Floodlights (comma separated)" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GroundFeatures;

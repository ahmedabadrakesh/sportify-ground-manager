
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { GroundFormValues } from "./groundFormSchema";
import { useGames } from "@/hooks/useGames";
import { useFacilities } from "@/hooks/useFacilities";

interface GroundFeaturesProps {
  form: UseFormReturn<GroundFormValues>;
}

const GroundFeatures: React.FC<GroundFeaturesProps> = ({ form }) => {
  const { games, loading: gamesLoading } = useGames();
  const { data: facilities = [], isLoading: facilitiesLoading } = useFacilities();

  const selectedGames = form.watch("games") || [];
  const selectedFacilities = form.watch("facilities") || [];

  const handleMultiSelect = (field: "games" | "facilities", id: string) => {
    const currentValues = form.getValues(field) || [];
    if (currentValues.includes(id)) {
      form.setValue(field, currentValues.filter(v => v !== id));
    } else {
      form.setValue(field, [...currentValues, id]);
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
              {gamesLoading && <div className="text-xs text-gray-500">Loading games...</div>}
              {!gamesLoading && games.length === 0 && <div className="text-xs text-red-500">No games found</div>}
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto border rounded p-2 bg-gray-50">
                {games.map((game) => (
                  <label key={game.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedGames.includes(game.id)}
                      onCheckedChange={() => handleMultiSelect("games", game.id)}
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
        render={() => (
          <FormItem>
            <FormLabel>Facilities</FormLabel>
            <div className="flex flex-col gap-2">
              {facilitiesLoading && <div className="text-xs text-gray-500">Loading facilities...</div>}
              {!facilitiesLoading && facilities.length === 0 && <div className="text-xs text-red-500">No facilities found</div>}
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto border rounded p-2 bg-gray-50">
                {facilities.map((facility) => (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedFacilities.includes(facility.id)}
                      onCheckedChange={() => handleMultiSelect("facilities", facility.id)}
                    />
                    <span className="text-sm">{facility.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GroundFeatures;

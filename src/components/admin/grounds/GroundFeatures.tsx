
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GroundFormValues } from "./groundFormSchema";

interface GroundFeaturesProps {
  form: UseFormReturn<GroundFormValues>;
}

const GroundFeatures: React.FC<GroundFeaturesProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="games"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Games</FormLabel>
            <FormControl>
              <Input 
                placeholder="Cricket, Football, etc. (comma separated)" 
                {...field} 
              />
            </FormControl>
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
                placeholder="Parking, Canteen, etc. (comma separated)" 
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

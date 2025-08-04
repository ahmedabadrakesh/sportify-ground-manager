import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { Plus, X, MapPin } from "lucide-react";

interface TrainingLocationsSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const TrainingLocationsSection = ({ form }: TrainingLocationsSectionProps) => {
  const trainingLocations = form.watch("training_locations_detailed") || [];

  const addTrainingLocation = () => {
    const current = form.getValues("training_locations_detailed") || [];
    form.setValue("training_locations_detailed", [...current, { location: "", address: "", timings: "" }]);
  };

  const removeTrainingLocation = (index: number) => {
    const current = form.getValues("training_locations_detailed") || [];
    form.setValue("training_locations_detailed", current.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <h4 className="text-md font-medium">Training Locations</h4>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addTrainingLocation}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {trainingLocations.map((_, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Location {index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTrainingLocation(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              name={`training_locations_detailed.${index}.location`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Central Sports Complex" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={`training_locations_detailed.${index}.address`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full address with city and pincode" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={`training_locations_detailed.${index}.timings`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timings</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Mon-Fri: 6:00 AM - 8:00 AM, Sat-Sun: 7:00 AM - 9:00 AM" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}

      {trainingLocations.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No training locations added yet.</p>
          <p className="text-sm">Click "Add Location" to add your training venues.</p>
        </div>
      )}
    </div>
  );
};
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { MultiSelect } from "@/components/ui/multi-select";
import { MapPin, DollarSign, Clock, Plus, Trash2 } from "lucide-react";

interface StepFourProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFour = ({ form }: StepFourProps) => {
  const coachingAvailabilityOptions = [
    { label: "Personal", value: "Personal" },
    { label: "Home", value: "Home" },
    { label: "Group", value: "Group" },
    { label: "Out of City", value: "Out of City" },
  ];

  const trainingLocations = form.watch("training_locations_detailed") || [];

  const addTrainingLocation = () => {
    const currentLocations =
      form.getValues("training_locations_detailed") || [];
    form.setValue("training_locations_detailed", [
      ...currentLocations,
      { location: "", address: "", timings: "" },
    ]);
  };

  const removeTrainingLocation = (index: number) => {
    const currentLocations =
      form.getValues("training_locations_detailed") || [];
    const newLocations = currentLocations.filter((_, i) => i !== index);
    form.setValue("training_locations_detailed", newLocations);
  };

  const updateTrainingLocation = (
    index: number,
    field: string,
    value: string
  ) => {
    const currentLocations =
      form.getValues("training_locations_detailed") || [];
    const newLocations = [...currentLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    form.setValue("training_locations_detailed", newLocations);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Training Information</h2>
        <hr className="pb-6" />

        {/* Coaching Availability */}
        <FormField
          name="coaching_availability"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Coaching Availability
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={coachingAvailabilityOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value || []}
                  placeholder="Select coaching availability"
                  maxCount={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing Section */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 p-4">
            <DollarSign className="w-5 h-5" />
            Fee / Pricing
          </h3>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                name="one_on_one_price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-on-One (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="group_session_price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Sessions (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="online_price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online (₹/session)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="free_demo_call"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-3/5 flex-row items-center align-left gap-4 p-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  Offerring a Free Demo to potential clients?
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Training Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Training Location(s)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingLocations.map((location, index) => (
              <div
                key={index}
                className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg relative"
              >
                <div>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="Location name"
                    value={location.location}
                    onChange={(e) =>
                      updateTrainingLocation(index, "location", e.target.value)
                    }
                  />
                </div>
                <div>
                  <FormLabel>Address</FormLabel>
                  <Input
                    placeholder="Full address"
                    value={location.address}
                    onChange={(e) =>
                      updateTrainingLocation(index, "address", e.target.value)
                    }
                  />
                </div>
                <div>
                  <FormLabel>Timings</FormLabel>
                  <Input
                    placeholder="e.g., 6:00 AM - 8:00 PM"
                    value={location.timings}
                    onChange={(e) =>
                      updateTrainingLocation(index, "timings", e.target.value)
                    }
                  />
                </div>
                {trainingLocations.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeTrainingLocation(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTrainingLocation}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Training Location
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

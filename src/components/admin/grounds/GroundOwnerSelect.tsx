
import React, { useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { GroundFormValues } from "./groundFormSchema";

interface GroundOwnerSelectProps {
  form: UseFormReturn<GroundFormValues>;
  owners: any[];
}

const GroundOwnerSelect: React.FC<GroundOwnerSelectProps> = ({ form, owners }) => {
  // Handle empty owners array
  const hasOwners = Array.isArray(owners) && owners.length > 0;
  
  useEffect(() => {
    // If we have owners and no owner is selected, select the first one
    if (hasOwners && !form.getValues().ownerId) {
      form.setValue('ownerId', owners[0].id);
    }
  }, [owners, form]);

  return (
    <FormField
      control={form.control}
      name="ownerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ground Owner</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={hasOwners ? "Select ground owner" : "Loading owners..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hasOwners ? (
                owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  No owners available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GroundOwnerSelect;


import React from "react";
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
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select ground owner" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.name}
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

export default GroundOwnerSelect;

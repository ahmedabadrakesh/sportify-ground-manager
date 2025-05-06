
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventFormValues } from "./eventFormSchema";

interface EventLinksProps {
  form: UseFormReturn<EventFormValues>;
}

const EventLinks = ({ form }: EventLinksProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="registrationUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/register" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="qrCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>QR Code URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/qrcode.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default EventLinks;


import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ownerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  whatsapp: z.string().optional(),
});

type OwnerFormValues = z.infer<typeof ownerFormSchema>;

interface EditOwnerFormProps {
  ownerId: string;
  ownerData: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  onSuccess: (updatedOwner: any) => void;
  onCancel: () => void;
}

const EditOwnerForm: React.FC<EditOwnerFormProps> = ({
  ownerId,
  ownerData,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (ownerData) {
      form.reset({
        name: ownerData.name,
        email: ownerData.email,
        phone: ownerData.phone || "",
        whatsapp: ownerData.whatsapp || "",
      });
    }
  }, [ownerData, form]);

  const onSubmit = async (data: OwnerFormValues) => {
    try {
      const { data: updatedOwner, error } = await supabase
        .from('users')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp || null,
        })
        .eq('id', ownerId)
        .select()
        .single();

      if (error) {
        console.error("Error updating ground owner:", error);
        toast.error("Failed to update ground owner");
        return;
      }

      toast.success("Ground owner updated successfully");
      onSuccess(updatedOwner);
    } catch (error) {
      console.error("Error updating ground owner:", error);
      toast.error("Failed to update ground owner");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter owner's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter WhatsApp number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Owner"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditOwnerForm;

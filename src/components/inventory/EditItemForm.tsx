
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { updateInventoryItem } from "@/utils/inventory";
import { toast } from "sonner";
import { InventoryItem } from "@/types/models";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Define the form schema
const inventoryItemSchema = z.object({
  name: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Name must be at least 2 characters"),
  category: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Category is required"),
  purchasePrice: z.coerce.number().min(0, { message: "Purchase price must be a positive number" }),
  sellPrice: z.coerce.number().min(0, { message: "Sell price must be a positive number" }),
  purchaseQuantity: z.coerce.number().min(0, { message: "Quantity must be a positive number" }),
  description: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  image: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
});

type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

interface EditItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: () => void;
  item: InventoryItem | null;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ 
  open, 
  onOpenChange,
  onItemUpdated,
  item
}) => {
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      purchasePrice: 0,
      sellPrice: 0,
      purchaseQuantity: 0,
      description: "",
      image: "",
    },
  });
  
  // Update form when item changes
  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        purchasePrice: item.purchasePrice || 0,
        sellPrice: item.price,
        purchaseQuantity: item.purchaseQuantity || 0,
        description: item.description || "",
        image: item.image || ""
      });
    }
  }, [item, form]);
  
  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data: InventoryItemFormValues) => {
    if (!item) return;
    
    try {
      // Create a properly typed object with required fields
      const itemData = {
        id: item.id,
        name: data.name,
        category: data.category,
        purchasePrice: data.purchasePrice,
        price: data.sellPrice,
        purchaseQuantity: data.purchaseQuantity,
        description: data.description || "",
        image: data.image || "",
        availableQuantity: 0  // This will be calculated in the service
      };
      
      const result = await updateInventoryItem(itemData);
      if (result) {
        toast.success(`Item "${data.name}" updated successfully`);
        onOpenChange(false);
        onItemUpdated();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sellPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sell Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="purchaseQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchased Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter item description with formatting..."
                      />
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
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        
        <DialogFooter className="flex-shrink-0 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {isSubmitting ? "Updating..." : "Update Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemForm;

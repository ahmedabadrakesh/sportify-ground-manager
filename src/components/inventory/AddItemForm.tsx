
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { addInventoryItem } from "@/utils/inventory";
import { toast } from "sonner";
import { useBrands } from "@/hooks/useBrands";
import { useGames } from "@/hooks/useGames";
import { X, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Define the form schema
const inventoryItemSchema = z.object({
  name: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Name must be at least 2 characters"),
  category: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Category is required"),
  purchasePrice: z.coerce.number().min(0, { message: "Purchase price must be a positive number" }),
  sellPrice: z.coerce.number().min(0, { message: "Sell price must be a positive number" }),
  initialQuantity: z.coerce.number().min(0, { message: "Quantity must be a positive number" }),
  description: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  images: z.array(z.string()).optional(),
  showOnShop: z.boolean().default(true),
  brandId: z.string().optional(),
  gameIds: z.array(z.string()).optional(),
  size: z.string().trim().optional(),
  color: z.string().trim().optional(),
  weight: z.coerce.number().min(0, { message: "Weight must be a positive number" }).optional(),
  material: z.string().trim().optional(),
  ageRange: z.string().trim().optional(),
});

type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

interface AddItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ 
  open, 
  onOpenChange,
  onItemAdded 
}) => {
  const { brands, loading: brandsLoading } = useBrands();
  const { games, loading: gamesLoading } = useGames();
  
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      purchasePrice: 0,
      sellPrice: 0,
      initialQuantity: 0,
      description: "",
      images: [],
      showOnShop: true,
      brandId: "",
      gameIds: [],
      size: "",
      color: "",
      weight: 0,
      material: "",
      ageRange: "",
    },
  });
  
  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data: InventoryItemFormValues) => {
    try {
      // Create a properly typed object with required fields
      const itemData = {
        name: data.name,
        category: data.category,
        purchasePrice: data.purchasePrice,
        price: data.sellPrice,
        initialQuantity: data.initialQuantity,
        description: data.description || "",
        images: data.images || [],
        showOnShop: data.showOnShop,
        brandId: data.brandId || null,
        gamesId: data.gameIds || [],
        size: data.size || "",
        color: data.color || "",
        weight: data.weight || 0,
        material: data.material || "",
        ageRange: data.ageRange || "",
      };
      
      const result = await addInventoryItem(itemData);
      if (result) {
        toast.success(`Item "${data.name}" added successfully`);
        form.reset();
        onOpenChange(false);
        onItemAdded();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Basic Information Row */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              {/* Pricing and Quantity Row */}
              <div className="grid grid-cols-3 gap-4">
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
                
                <FormField
                  control={form.control}
                  name="initialQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Purchased</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Brand and Games Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.brand_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gameIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Games (Optional)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={games.map((game) => ({
                            value: game.id,
                            label: game.name,
                          }))}
                          defaultValue={field.value || []}
                          onValueChange={field.onChange}
                          placeholder="Select games"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Size, Color, and Image Row */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter size (e.g., M, L, XL)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Product Images</FormLabel>
                      <div className="space-y-2">
                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {field.value.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={imageUrl} 
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const newImages = field.value?.filter((_, i) => i !== index) || [];
                                    field.onChange(newImages);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter image URL"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget;
                                if (input.value.trim()) {
                                  field.onChange([...(field.value || []), input.value.trim()]);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="Enter image URL"]');
                              if (input && input.value.trim()) {
                                field.onChange([...(field.value || []), input.value.trim()]);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <FormDescription>
                        Add image URLs one at a time. Press Enter or click + to add.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showOnShop"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Show on Website Shop
                        </FormLabel>
                        <FormDescription>
                          Check this to make the product visible on the public shop page
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Description - Full Width */}
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
                name="initialQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Purchased</FormLabel>
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
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.brand_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gameIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Games (Optional)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={games.map((game) => ({
                          value: game.id,
                          label: game.name,
                        }))}
                        defaultValue={field.value || []}
                        onValueChange={field.onChange}
                        placeholder="Select games"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter size (e.g., M, L, XL)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="0.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Material, Age Range, and Image */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter material" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Range (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5-12 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Product Images</FormLabel>
                      <div className="space-y-2">
                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {field.value.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={imageUrl} 
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const newImages = field.value?.filter((_, i) => i !== index) || [];
                                    field.onChange(newImages);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter image URL"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget;
                                if (input.value.trim()) {
                                  field.onChange([...(field.value || []), input.value.trim()]);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="Enter image URL"]');
                              if (input && input.value.trim()) {
                                field.onChange([...(field.value || []), input.value.trim()]);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <FormDescription>
                        Add image URLs one at a time. Press Enter or click + to add.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showOnShop"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Show on Website Shop
                        </FormLabel>
                        <FormDescription>
                          Check this to make the product visible on the public shop page
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
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
            {isSubmitting ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;

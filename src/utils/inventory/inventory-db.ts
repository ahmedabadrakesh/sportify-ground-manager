
import { InventoryItem, GroundInventory } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Update the type to include purchase_quantity
type InventoryItemDB = {
  id: string;
  name: string;
  category: string;
  price: number;
  purchase_price?: number;
  purchase_quantity?: number;
  quantity?: number;
  description?: string | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
};

// Modify getAllInventoryItems to include purchase_quantity
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*');

    if (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to load inventory items');
      return [];
    }

    return data.map((item: InventoryItemDB) => {
      // Calculate available quantity by subtracting allocated quantity from purchase quantity
      const calculateAvailableQuantity = async () => {
        const { data: allocatedData, error: allocatedError } = await supabase
          .from('ground_inventory')
          .select('SUM(quantity) as total_allocated')
          .eq('item_id', item.id);

        if (allocatedError) {
          console.error('Error calculating allocated quantity:', allocatedError);
          return item.purchase_quantity || 0;
        }

        const totalAllocated = allocatedData?.[0]?.total_allocated || 0;
        return Math.max((item.purchase_quantity || 0) - totalAllocated, 0);
      };

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        purchasePrice: item.purchase_price || 0,
        purchaseQuantity: item.purchase_quantity || 0,
        quantity: item.quantity || 0,
        description: item.description || '',
        image: item.image || '',
        availableQuantity: calculateAvailableQuantity()
      };
    });
  } catch (error) {
    console.error('Unexpected error in getAllInventoryItems:', error);
    toast.error('Failed to load inventory items');
    return [];
  }
};

// Update addInventoryItemToDB to include purchase_quantity
export const addInventoryItemToDB = async (item: Omit<InventoryItem, 'id'> & { initialQuantity?: number }): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        category: item.category,
        price: item.price,
        purchase_price: item.purchasePrice,
        purchase_quantity: item.initialQuantity || 0,
        quantity: item.initialQuantity || 0,
        description: item.description || null,
        image: item.image || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
      return null;
    }

    toast.success(`Added new inventory item: ${data.name}`);
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price,
      purchasePrice: data.purchase_price || 0,
      purchaseQuantity: data.purchase_quantity || 0,
      quantity: data.quantity || 0,
      description: data.description || '',
      image: data.image || ''
    };
  } catch (error) {
    console.error('Unexpected error in addInventoryItemToDB:', error);
    toast.error('Failed to add inventory item');
    return null;
  }
};

// Update updateInventoryItemInDB to include purchase_quantity
export const updateInventoryItemInDB = async (item: InventoryItem): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .update({
        name: item.name,
        category: item.category,
        price: item.price,
        purchase_price: item.purchasePrice,
        purchase_quantity: item.purchaseQuantity,
        quantity: item.quantity,
        description: item.description || null,
        image: item.image || null
      })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inventory item:', error);
      toast.error('Failed to update inventory item');
      return null;
    }

    toast.success(`Updated inventory item: ${data.name}`);
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price,
      purchasePrice: data.purchase_price || 0,
      purchaseQuantity: data.purchase_quantity || 0,
      quantity: data.quantity || 0,
      description: data.description || '',
      image: data.image || ''
    };
  } catch (error) {
    console.error('Unexpected error in updateInventoryItemInDB:', error);
    toast.error('Failed to update inventory item');
    return null;
  }
};

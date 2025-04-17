
import { GroundInventory, InventoryItem } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addInventoryItemToDB, updateInventoryItemInDB } from "./inventory-db";

// Generate unique ID
export const generateId = () => `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Add new inventory item - wrapper for the DB function
export const addInventoryItem = async (item: Omit<InventoryItem, 'id'> & { initialQuantity?: number }): Promise<InventoryItem | null> => {
  return addInventoryItemToDB(item);
};

// Update existing inventory item - wrapper for the DB function
export const updateInventoryItem = async (item: InventoryItem): Promise<InventoryItem | null> => {
  return updateInventoryItemInDB(item);
};

// Allocate inventory to a ground in database
export const allocateInventory = async (
  groundId: string,
  itemId: string,
  quantity: number
): Promise<boolean> => {
  try {
    // Check if item exists first
    const { data: itemData, error: itemError } = await supabase
      .from('inventory_items')
      .select('id, name')
      .eq('id', itemId)
      .single();

    if (itemError) {
      console.error(`Inventory item with ID ${itemId} not found`, itemError);
      toast.error('Item not found');
      return false;
    }

    // Check if ground already has this item
    const { data: existingData, error: existingError } = await supabase
      .from('ground_inventory')
      .select('quantity')
      .eq('ground_id', groundId)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing inventory:', existingError);
      toast.error('Failed to check existing inventory');
      return false;
    }

    if (existingData) {
      // Update existing quantity
      const { error: updateError } = await supabase
        .from('ground_inventory')
        .update({ quantity: existingData.quantity + quantity })
        .eq('ground_id', groundId)
        .eq('item_id', itemId);

      if (updateError) {
        console.error('Error updating inventory quantity:', updateError);
        toast.error('Failed to update inventory quantity');
        return false;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('ground_inventory')
        .insert({
          ground_id: groundId,
          item_id: itemId,
          quantity: quantity
        });

      if (insertError) {
        console.error('Error inserting inventory:', insertError);
        toast.error('Failed to allocate item to ground');
        return false;
      }
    }

    toast.success(`Allocated ${quantity} of ${itemData.name} to ground ${groundId}`);
    return true;
  } catch (error) {
    console.error('Unexpected error in allocateInventory:', error);
    toast.error('Failed to allocate inventory');
    return false;
  }
};

// Use inventory items with database update
export const useInventoryItems = async (
  groundId: string,
  itemId: string,
  quantity: number
): Promise<boolean> => {
  try {
    // Check if ground has enough of this item
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('ground_inventory')
      .select('quantity, inventory_items(name)')
      .eq('ground_id', groundId)
      .eq('item_id', itemId)
      .maybeSingle();

    if (inventoryError || !inventoryData) {
      console.error(`Item ${itemId} not found for ground ${groundId}`, inventoryError);
      toast.error('Item not found for this ground');
      return false;
    }

    if (inventoryData.quantity < quantity) {
      toast.error(`Insufficient quantity of ${inventoryData.inventory_items.name}`);
      return false;
    }

    // Update quantity
    const { error: updateError } = await supabase
      .from('ground_inventory')
      .update({ quantity: inventoryData.quantity - quantity })
      .eq('ground_id', groundId)
      .eq('item_id', itemId);

    if (updateError) {
      console.error('Error updating inventory after use:', updateError);
      toast.error('Failed to update inventory');
      return false;
    }

    toast.success(`Used ${quantity} of ${inventoryData.inventory_items.name} from ground ${groundId}`);
    return true;
  } catch (error) {
    console.error('Unexpected error in useInventoryItems:', error);
    toast.error('Failed to use inventory items');
    return false;
  }
};

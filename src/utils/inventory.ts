
import { GroundInventory, InventoryItem } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate unique ID
const generateId = () => `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Get all inventory items from database
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

    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      image: item.image || ''
    }));
  } catch (error) {
    console.error('Unexpected error in getAllInventoryItems:', error);
    toast.error('Failed to load inventory items');
    return [];
  }
};

// Get inventory for a specific ground from database
export const getGroundInventory = async (groundId: string): Promise<GroundInventory[]> => {
  try {
    const { data, error } = await supabase
      .from('ground_inventory')
      .select(`
        ground_id,
        item_id,
        quantity,
        inventory_items(id, name, price)
      `)
      .eq('ground_id', groundId);

    if (error) {
      console.error('Error fetching ground inventory:', error);
      toast.error('Failed to load ground inventory');
      return [];
    }

    return data.map(item => ({
      groundId: item.ground_id,
      itemId: item.item_id,
      quantity: item.quantity,
      itemName: item.inventory_items.name,
      itemPrice: item.inventory_items.price
    }));
  } catch (error) {
    console.error('Unexpected error in getGroundInventory:', error);
    toast.error('Failed to load ground inventory');
    return [];
  }
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

// Add new inventory item to database
export const addInventoryItem = async (item: Omit<InventoryItem, 'id'> & { initialQuantity?: number }): Promise<InventoryItem | null> => {
  try {
    // Start a transaction by manually controlling the Supabase operations
    // First, insert the inventory item
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        category: item.category,
        price: item.price,
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

    // If initialQuantity is provided and greater than 0, add it to the central inventory
    // This would require a central_inventory table in a real application
    // For now we just log it
    if (item.initialQuantity && item.initialQuantity > 0) {
      console.log(`Added ${item.initialQuantity} of ${item.name} to central inventory`);
      // In a real app, here we would insert into central_inventory or similar
    }

    toast.success(`Added new inventory item: ${data.name}`);
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || '',
      image: data.image || ''
    };
  } catch (error) {
    console.error('Unexpected error in addInventoryItem:', error);
    toast.error('Failed to add inventory item');
    return null;
  }
};

// Get inventory usage history for a ground
export const getInventoryUsageHistory = async (groundId: string): Promise<any[]> => {
  // In a real app, this would fetch from a database table like inventory_usage
  // For now, we'll return mock data
  return [
    {
      id: `usage-${Date.now()}-1`,
      groundId,
      itemId: '',
      itemName: 'Football',
      quantity: 2,
      timestamp: new Date().toISOString(),
      userName: 'John Doe'
    },
    {
      id: `usage-${Date.now()}-2`,
      groundId,
      itemId: '',
      itemName: 'Water Bottles',
      quantity: 1,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userName: 'Jane Smith'
    }
  ];
};

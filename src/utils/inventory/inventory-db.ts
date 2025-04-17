
import { InventoryItem, GroundInventory } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define a type to match what the database actually returns
type InventoryItemDB = {
  id: string;
  name: string;
  category: string;
  price: number;
  purchase_price?: number;
  quantity?: number;
  description?: string | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
};

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

    return data.map((item: InventoryItemDB) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      purchasePrice: item.purchase_price || 0,
      quantity: item.quantity || 0,
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

// Add new inventory item to database
export const addInventoryItemToDB = async (item: Omit<InventoryItem, 'id'> & { initialQuantity?: number }): Promise<InventoryItem | null> => {
  try {
    // First, insert the inventory item
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        category: item.category,
        price: item.price,
        purchase_price: item.purchasePrice,
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
      purchasePrice: (data as unknown as InventoryItemDB).purchase_price || 0,
      quantity: (data as unknown as InventoryItemDB).quantity || 0,
      description: data.description || '',
      image: data.image || ''
    };
  } catch (error) {
    console.error('Unexpected error in addInventoryItemToDB:', error);
    toast.error('Failed to add inventory item');
    return null;
  }
};

// Update existing inventory item in database
export const updateInventoryItemInDB = async (item: InventoryItem): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .update({
        name: item.name,
        category: item.category,
        price: item.price,
        purchase_price: item.purchasePrice,
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
      purchasePrice: (data as unknown as InventoryItemDB).purchase_price || 0,
      quantity: (data as unknown as InventoryItemDB).quantity || 0,
      description: data.description || '',
      image: data.image || ''
    };
  } catch (error) {
    console.error('Unexpected error in updateInventoryItemInDB:', error);
    toast.error('Failed to update inventory item');
    return null;
  }
};

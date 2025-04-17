
import { GroundInventory } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get inventory for a specific ground
export const getGroundInventory = async (groundId: string): Promise<GroundInventory[]> => {
  try {
    const { data, error } = await supabase
      .from('ground_inventory')
      .select(`
        quantity,
        inventory_items (
          id,
          name,
          price,
          purchase_quantity
        ),
        ground_id
      `)
      .eq('ground_id', groundId);

    if (error) {
      console.error('Error fetching ground inventory:', error);
      toast.error('Failed to load ground inventory');
      return [];
    }

    return data.map(item => ({
      groundId: item.ground_id,
      itemId: item.inventory_items.id,
      itemName: item.inventory_items.name,
      itemPrice: item.inventory_items.price,
      quantity: item.quantity,
      purchasedQuantity: item.inventory_items.purchase_quantity || 0
    }));
  } catch (error) {
    console.error('Unexpected error in getGroundInventory:', error);
    toast.error('Failed to load ground inventory');
    return [];
  }
};

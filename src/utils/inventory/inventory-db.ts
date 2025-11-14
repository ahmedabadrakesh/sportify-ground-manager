
import { InventoryItem, GroundInventory } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Update the type to include all fields from database
type InventoryItemDB = {
  id: string;
  name: string;
  category: string;
  price: number;
  purchase_price?: number;
  purchase_quantity?: number;
  description?: string | null;
  image?: string | null;
  images?: string[] | null;
  show_on_shop?: boolean | null;
  brandId?: string | null;
  gamesId?: string[] | null;
  size?: string | null;
  color?: string | null;
  weight?: number | null;
  material?: string | null;
  ageRange?: string | null;
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

    // Process items and calculate available quantity
    const items: InventoryItem[] = [];
    
    for (const item of data as any[]) {
      const { data: allocatedData, error: allocatedError } = await supabase
        .from('ground_inventory')
        .select('quantity')
        .eq('item_id', item.id);

      let availableQuantity = item.purchase_quantity || 0;
      
      if (!allocatedError && allocatedData) {
        const totalAllocated = allocatedData.reduce((sum, record) => sum + (record.quantity || 0), 0);
        availableQuantity = Math.max((item.purchase_quantity || 0) - totalAllocated, 0);
      }

      items.push({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        purchasePrice: item.purchase_price || 0,
        purchaseQuantity: item.purchase_quantity || 0,
        description: item.description || '',
        image: item.image || '',
        images: item.images || (item.image ? [item.image] : []),
        showOnShop: item.show_on_shop ?? true,
        availableQuantity: availableQuantity,
        brandId: item.brandId || '',
        gamesId: item.gamesId || [],
        size: item.size || '',
        color: item.color || '',
        weight: item.weight ?? 0,
        material: item.material ?? '',
        ageRange: item.ageRange ?? '',
      });
    }

    console.log('Fetched inventory items:', items);
    return items;
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
        description: item.description || null,
        image: (item.images && item.images.length > 0) ? item.images[0] : (item.image || null),
        images: item.images || [],
        show_on_shop: item.showOnShop ?? true,
        brandId: item.brandId || null,
        gamesId: item.gamesId || [],
        size: item.size || "",
        color: item.color || "",
        weight: item.weight ?? 0,
        material: item.material ?? "",
        ageRange: item.ageRange ?? "",
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
      return null;
    }

    const responseData = data as any;
    toast.success(`Added new inventory item: ${responseData.name}`);
    return {
      id: responseData.id,
      name: responseData.name,
      category: responseData.category,
      price: responseData.price,
      purchasePrice: responseData.purchase_price || 0,
      purchaseQuantity: responseData.purchase_quantity || 0,
      description: responseData.description || '',
      image: responseData.image || '',
      images: responseData.images || (responseData.image ? [responseData.image] : []),
      showOnShop: responseData.show_on_shop ?? true,
      availableQuantity: responseData.purchase_quantity || 0,
      brandId: responseData.brandId || null,
      gamesId: responseData.gamesId || [],
      size: responseData.size || "",
      color: responseData.color || "",
      weight: responseData.weight ?? 0,
      material: responseData.material ?? "",
      ageRange: responseData.ageRange ?? "",
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
        description: item.description || null,
        image: (item.images && item.images.length > 0) ? item.images[0] : (item.image || null),
        images: item.images || [],
        show_on_shop: item.showOnShop ?? true,
        brandId: item.brandId || null,
        gamesId: item.gamesId || [],
        size: item.size || "",
        color: item.color || "",
        weight: item.weight ?? 0,
        material: item.material ?? "",
        ageRange: item.ageRange ?? "",
      })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inventory item:', error);
      toast.error('Failed to update inventory item');
      return null;
    }

    const responseData = data as any;
    toast.success(`Updated inventory item: ${responseData.name}`);
    
    // Calculate available quantity
    const { data: allocatedData } = await supabase
      .from('ground_inventory')
      .select('quantity')
      .eq('item_id', item.id);
      
    let availableQuantity = responseData.purchase_quantity || 0;
    
    if (allocatedData) {
      const totalAllocated = allocatedData.reduce((sum, record) => sum + (record.quantity || 0), 0);
      availableQuantity = Math.max((responseData.purchase_quantity || 0) - totalAllocated, 0);
    }

    return {
      id: responseData.id,
      name: responseData.name,
      category: responseData.category,
      price: responseData.price,
      purchasePrice: responseData.purchase_price || 0,
      purchaseQuantity: responseData.purchase_quantity || 0,
      description: responseData.description || '',
      image: responseData.image || '',
      images: responseData.images || (responseData.image ? [responseData.image] : []),
      showOnShop: responseData.show_on_shop ?? true,
      availableQuantity: availableQuantity,
      brandId: responseData.brandId || null,
      gamesId: responseData.gamesId || [],
      size: responseData.size || "",
      color: responseData.color || "",
      weight: responseData.weight ?? 0,
      material: responseData.material ?? "",
      ageRange: responseData.ageRange ?? "",
    };
  } catch (error) {
    console.error('Unexpected error in updateInventoryItemInDB:', error);
    toast.error('Failed to update inventory item');
    return null;
  }
};

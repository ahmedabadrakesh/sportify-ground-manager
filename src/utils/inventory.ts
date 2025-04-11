
import { GroundInventory, InventoryItem } from "@/types/models";
import { groundInventory, inventoryItems } from "@/data/mockData";

// Get all inventory items
export const getAllInventoryItems = (): InventoryItem[] => {
  return [...inventoryItems];
};

// Get inventory for a specific ground
export const getGroundInventory = (groundId: string): GroundInventory[] => {
  return groundInventory.filter(item => item.groundId === groundId);
};

// Allocate inventory to a ground
export const allocateInventory = (
  groundId: string,
  itemId: string,
  quantity: number
): boolean => {
  const item = inventoryItems.find(item => item.id === itemId);
  if (!item) return false;
  
  // Check if ground already has this item
  const existingIndex = groundInventory.findIndex(
    inv => inv.groundId === groundId && inv.itemId === itemId
  );
  
  if (existingIndex !== -1) {
    // Update existing quantity
    groundInventory[existingIndex] = {
      ...groundInventory[existingIndex],
      quantity: groundInventory[existingIndex].quantity + quantity,
    };
  } else {
    // Add new inventory item
    groundInventory.push({
      groundId,
      itemId,
      quantity,
      itemName: item.name,
      itemPrice: item.price,
    });
  }
  
  console.log(`Allocated ${quantity} of ${item.name} to ground ${groundId}`);
  return true;
};

// Use inventory items
export const useInventoryItems = (
  groundId: string,
  itemId: string,
  quantity: number
): boolean => {
  const existingIndex = groundInventory.findIndex(
    inv => inv.groundId === groundId && inv.itemId === itemId
  );
  
  if (existingIndex === -1) {
    console.log(`Failed to use inventory: Item ${itemId} not found for ground ${groundId}`);
    return false;
  }
  
  if (groundInventory[existingIndex].quantity < quantity) {
    console.log(`Failed to use inventory: Insufficient quantity of ${groundInventory[existingIndex].itemName}`);
    return false;
  }
  
  // Update quantity
  groundInventory[existingIndex] = {
    ...groundInventory[existingIndex],
    quantity: groundInventory[existingIndex].quantity - quantity,
  };
  
  console.log(`Used ${quantity} of ${groundInventory[existingIndex].itemName} from ground ${groundId}`);
  return true;
};

// Add new inventory item
export const addInventoryItem = (item: Omit<InventoryItem, 'id'>): InventoryItem => {
  const newItem: InventoryItem = {
    id: `item-${Date.now()}`,
    ...item,
  };
  
  inventoryItems.push(newItem);
  console.log(`Added new inventory item: ${newItem.name}`);
  return newItem;
};

// Get inventory usage for a ground
export const getInventoryUsageHistory = (groundId: string): any[] => {
  // In a real app, this would fetch from a database
  // For now, return a mock history
  return [
    {
      id: `usage-${Date.now()}-1`,
      groundId,
      itemId: groundInventory[0]?.itemId || '',
      itemName: groundInventory[0]?.itemName || 'Unknown Item',
      quantity: 2,
      timestamp: new Date().toISOString(),
      userName: 'John Doe'
    },
    {
      id: `usage-${Date.now()}-2`,
      groundId,
      itemId: groundInventory[1]?.itemId || '',
      itemName: groundInventory[1]?.itemName || 'Unknown Item',
      quantity: 1,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userName: 'Jane Smith'
    }
  ];
};


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
  
  if (existingIndex === -1) return false;
  if (groundInventory[existingIndex].quantity < quantity) return false;
  
  // Update quantity
  groundInventory[existingIndex] = {
    ...groundInventory[existingIndex],
    quantity: groundInventory[existingIndex].quantity - quantity,
  };
  
  return true;
};

// Add new inventory item
export const addInventoryItem = (item: Omit<InventoryItem, 'id'>): InventoryItem => {
  const newItem: InventoryItem = {
    id: `item-${Date.now()}`,
    ...item,
  };
  
  inventoryItems.push(newItem);
  return newItem;
};

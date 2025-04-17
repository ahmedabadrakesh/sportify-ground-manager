
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  purchasePrice?: number;
  purchaseQuantity?: number;
  availableQuantity?: number;
  quantity?: number;
  description?: string;
  image?: string;
}

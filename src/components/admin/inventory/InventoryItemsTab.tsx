
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "@/components/inventory/InventoryTable";
import { InventoryItem } from "@/types/models";

interface InventoryItemsTabProps {
  inventoryItems: InventoryItem[];
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const InventoryItemsTab: React.FC<InventoryItemsTabProps> = ({
  inventoryItems,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Items</CardTitle>
        <CardDescription>
          Manage the items available across all grounds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InventoryTable 
          inventory={inventoryItems.map(item => ({
            groundId: '',
            itemId: item.id,
            itemName: item.name,
            itemPrice: item.price,
            quantity: item.availableQuantity || 0,
            purchasedQuantity: item.purchaseQuantity || 0
          }))} 
          readonly={true}
          allowEdit={true}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          showPurchasedQuantity={true}
        />
      </CardContent>
    </Card>
  );
};

export default InventoryItemsTab;

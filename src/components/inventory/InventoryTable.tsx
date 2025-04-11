
import React from "react";
import { GroundInventory } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface InventoryTableProps {
  inventory: GroundInventory[];
  onUseItem?: (itemId: string, quantity: number) => void;
  readonly?: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  onUseItem,
  readonly = false,
}) => {
  const [useQuantities, setUseQuantities] = React.useState<Record<string, number>>(
    inventory.reduce((acc, item) => {
      acc[item.itemId] = 1;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleQuantityChange = (itemId: string, value: number) => {
    setUseQuantities((prev) => ({
      ...prev,
      [itemId]: Math.min(
        Math.max(1, value),
        inventory.find((item) => item.itemId === itemId)?.quantity || 1
      ),
    }));
  };

  return (
    <div className="bg-white rounded-md shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead className="text-right">Price (₹)</TableHead>
            <TableHead className="text-right">Available Qty</TableHead>
            {!readonly && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={readonly ? 3 : 4} className="text-center py-6 text-gray-500">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell className="text-right">{item.itemPrice}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                {!readonly && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleQuantityChange(item.itemId, useQuantities[item.itemId] - 1)}
                          disabled={useQuantities[item.itemId] <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={useQuantities[item.itemId]}
                          onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-none focus:ring-0"
                          min="1"
                          max={item.quantity}
                        />
                        <button
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleQuantityChange(item.itemId, useQuantities[item.itemId] + 1)}
                          disabled={useQuantities[item.itemId] >= item.quantity}
                        >
                          +
                        </button>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onUseItem?.(item.itemId, useQuantities[item.itemId])}
                        disabled={item.quantity <= 0}
                      >
                        Use
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;

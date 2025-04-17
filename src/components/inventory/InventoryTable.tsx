
import React, { useState } from "react";
import { GroundInventory } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

interface InventoryTableProps {
  inventory: GroundInventory[];
  onUseItem?: (itemId: string, quantity: number) => void;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  readonly?: boolean;
  allowEdit?: boolean;
  showPurchasedQuantity?: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  onUseItem,
  onEditItem,
  onDeleteItem,
  readonly = false,
  allowEdit = false,
  showPurchasedQuantity = false,
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
            {showPurchasedQuantity && <TableHead className="text-right">Purchased Qty</TableHead>}
            <TableHead className="text-right">Available Qty</TableHead>
            {(!readonly || allowEdit) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showPurchasedQuantity ? (readonly && !allowEdit ? 4 : 5) : (readonly && !allowEdit ? 3 : 4)} className="text-center py-6 text-gray-500">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell className="text-right">{item.itemPrice}</TableCell>
                {showPurchasedQuantity && (
                  <TableCell className="text-right">{item.purchasedQuantity || 0}</TableCell>
                )}
                <TableCell className="text-right">{item.quantity}</TableCell>
                {(!readonly || allowEdit) && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {!readonly && (
                        <>
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
                        </>
                      )}
                      
                      {allowEdit && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEditItem?.(item.itemId)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDeleteItem?.(item.itemId)}
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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


import React from "react";
import { InventoryItem } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AvailableInventoryTableProps {
  inventoryItems: InventoryItem[];
}

const AvailableInventoryTable: React.FC<AvailableInventoryTableProps> = ({
  inventoryItems
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Purchased Qty</TableHead>
            <TableHead className="text-right">Available Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">₹{item.price}</TableCell>
              <TableCell className="text-right">{item.purchaseQuantity || 0}</TableCell>
              <TableCell className="text-right">{item.availableQuantity || 0}</TableCell>
            </TableRow>
          ))}
          
          {inventoryItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No inventory items available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AvailableInventoryTable;

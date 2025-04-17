
import React from "react";
import { Package } from "lucide-react";
import { GroundInventory } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CurrentGroundInventoryProps {
  selectedGround: string;
  groundInventory: GroundInventory[];
}

const CurrentGroundInventory: React.FC<CurrentGroundInventoryProps> = ({
  selectedGround,
  groundInventory
}) => {
  if (!selectedGround) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-md">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">
          Select a ground to view its inventory
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groundInventory.map((item) => (
            <TableRow key={item.itemId}>
              <TableCell className="font-medium">{item.itemName}</TableCell>
              <TableCell className="text-right">₹{item.itemPrice}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
            </TableRow>
          ))}
          
          {groundInventory.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                No inventory assigned to this ground yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CurrentGroundInventory;

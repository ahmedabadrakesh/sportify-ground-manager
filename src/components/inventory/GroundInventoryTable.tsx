
import React from "react";
import { GroundInventory, Ground } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GroundInventoryTableProps {
  groundInventory: GroundInventory[];
  grounds: Ground[];
  isSuperAdmin: boolean;
}

const GroundInventoryTable: React.FC<GroundInventoryTableProps> = ({
  groundInventory,
  grounds,
  isSuperAdmin,
}) => {
  const navigate = useNavigate();

  // Group inventory by ground
  const inventoryByGround = groundInventory.reduce<Record<string, GroundInventory[]>>((acc, item) => {
    if (!acc[item.groundId]) {
      acc[item.groundId] = [];
    }
    acc[item.groundId].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.keys(inventoryByGround).length > 0 ? (
        Object.entries(inventoryByGround).map(([groundId, items]) => {
          const ground = grounds.find(g => g.id === groundId);
          return (
            <div key={groundId} className="bg-white rounded-md border">
              <div className="px-4 py-3 border-b bg-muted/40">
                <h3 className="font-medium">{ground?.name || "Unknown Ground"}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">Available Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-right">{item.itemPrice}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-gray-500">
            No inventory allocations found for any grounds.
          </p>
          {isSuperAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate("/admin/inventory/allocate")}
            >
              Allocate Inventory
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default GroundInventoryTable;

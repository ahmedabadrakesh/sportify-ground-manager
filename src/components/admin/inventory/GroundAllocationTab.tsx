
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GroundInventoryTable from "@/components/inventory/GroundInventoryTable";
import { GroundInventory, Ground } from "@/types/models";

interface GroundAllocationTabProps {
  groundInventory: GroundInventory[];
  grounds: Ground[];
  isSuperAdmin: boolean;
  onInventoryUpdated?: () => void;
}

const GroundAllocationTab: React.FC<GroundAllocationTabProps> = ({
  groundInventory,
  grounds,
  isSuperAdmin,
  onInventoryUpdated,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ground Inventory Allocation</CardTitle>
        <CardDescription>
          Allocate specific items to individual grounds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GroundInventoryTable 
          groundInventory={groundInventory} 
          grounds={grounds}
          isSuperAdmin={isSuperAdmin}
          onInventoryUpdated={onInventoryUpdated}
        />
      </CardContent>
    </Card>
  );
};

export default GroundAllocationTab;

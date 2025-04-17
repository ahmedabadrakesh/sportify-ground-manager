
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  onAddItem: () => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onAddItem }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">
          Manage your platform's inventory items and ground-specific allocations.
        </p>
      </div>
      
      <Button className="flex items-center" onClick={onAddItem}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New Item
      </Button>
    </div>
  );
};

export default InventoryHeader;

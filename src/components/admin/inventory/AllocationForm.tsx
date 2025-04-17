
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryItem } from "@/types/models";
import { allocateInventory } from "@/utils/inventory";
import { toast } from "sonner";

interface AllocationFormProps {
  selectedGround: string;
  inventoryItems: InventoryItem[];
  onAllocationComplete: () => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({
  selectedGround,
  inventoryItems,
  onAllocationComplete
}) => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleAllocate = async () => {
    if (!selectedGround || !selectedItem || quantity <= 0) {
      toast.error("Please select a ground, an item, and a valid quantity");
      return;
    }
    
    try {
      const allocated = await allocateInventory(selectedGround, selectedItem, quantity);
      
      if (allocated) {
        toast.success("Inventory allocated successfully");
        setSelectedItem("");
        setQuantity(1);
        onAllocationComplete();
      } else {
        toast.error("Failed to allocate inventory");
      }
    } catch (error) {
      console.error("Error allocating inventory:", error);
      toast.error("Failed to allocate inventory");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item">Select Item</Label>
        <Select
          value={selectedItem}
          onValueChange={setSelectedItem}
          disabled={!selectedGround}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {inventoryItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} (₹{item.price})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          disabled={!selectedGround || !selectedItem}
        />
      </div>
      
      <Button
        className="w-full mt-4"
        onClick={handleAllocate}
        disabled={!selectedGround || !selectedItem || quantity <= 0}
      >
        <Check className="h-4 w-4 mr-2" />
        Allocate to Ground
      </Button>
    </div>
  );
};

export default AllocationForm;

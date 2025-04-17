
import React, { useState, useEffect } from "react";
import { GroundInventory, Ground, InventoryItem } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil, PlusCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allocateInventory } from "@/utils/inventory/inventory-operations";
import { toast } from "sonner";
import { getAllInventoryItems } from "@/utils/inventory";

interface GroundInventoryTableProps {
  groundInventory: GroundInventory[];
  grounds: Ground[];
  isSuperAdmin: boolean;
  onInventoryUpdated?: () => void;
}

const GroundInventoryTable: React.FC<GroundInventoryTableProps> = ({
  groundInventory,
  grounds,
  isSuperAdmin,
  onInventoryUpdated
}) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGround, setSelectedGround] = useState<string>("");
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<GroundInventory | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  // Load all inventory items for the dropdown
  useEffect(() => {
    const fetchInventoryItems = async () => {
      const items = await getAllInventoryItems();
      setInventoryItems(items);
    };
    
    if (isDialogOpen && !selectedInventoryItem) {
      fetchInventoryItems();
    }
  }, [isDialogOpen, selectedInventoryItem]);

  // Group inventory by ground
  const inventoryByGround = groundInventory.reduce<Record<string, GroundInventory[]>>((acc, item) => {
    if (!acc[item.groundId]) {
      acc[item.groundId] = [];
    }
    acc[item.groundId].push(item);
    return acc;
  }, {});

  const handleEditItem = (item: GroundInventory) => {
    setSelectedInventoryItem(item);
    setSelectedGround(item.groundId);
    setQuantity(item.quantity);
    setIsDialogOpen(true);
  };

  const handleAddAllocation = (groundId: string) => {
    setSelectedGround(groundId);
    setSelectedInventoryItem(null);
    setSelectedItemId("");
    setQuantity(1);
    setIsDialogOpen(true);
  };

  const handleSaveAllocation = async () => {
    if (!selectedGround) {
      toast.error("Please select a ground");
      return;
    }
    
    // If we're editing an existing item
    if (selectedInventoryItem) {
      try {
        const success = await allocateInventory(
          selectedGround, 
          selectedInventoryItem.itemId, 
          quantity
        );
        
        if (success) {
          setIsDialogOpen(false);
          onInventoryUpdated?.();
          toast.success("Inventory allocation updated successfully");
        }
      } catch (error) {
        console.error("Error allocating inventory:", error);
        toast.error("Failed to allocate inventory");
      }
      return;
    }
    
    // If we're adding a new item
    if (!selectedItemId) {
      toast.error("Please select an inventory item");
      return;
    }
    
    try {
      const success = await allocateInventory(
        selectedGround, 
        selectedItemId, 
        quantity
      );
      
      if (success) {
        setIsDialogOpen(false);
        onInventoryUpdated?.();
        toast.success("Inventory allocation added successfully");
      }
    } catch (error) {
      console.error("Error allocating inventory:", error);
      toast.error("Failed to allocate inventory");
    }
  };

  return (
    <div className="space-y-6">
      {Object.keys(inventoryByGround).length > 0 ? (
        Object.entries(inventoryByGround).map(([groundId, items]) => {
          const ground = grounds.find(g => g.id === groundId);
          return (
            <div key={groundId} className="bg-white rounded-md border">
              <div className="px-4 py-3 border-b bg-muted/40 flex justify-between items-center">
                <h3 className="font-medium">{ground?.name || "Unknown Ground"}</h3>
                {isSuperAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddAllocation(groundId)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">Available Qty</TableHead>
                    {isSuperAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-right">{item.itemPrice}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditItem(item)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedInventoryItem ? "Update Inventory Allocation" : "Add Inventory Allocation"}
            </DialogTitle>
            <DialogDescription>
              {selectedInventoryItem 
                ? "Update the quantity for this item at this ground." 
                : "Allocate an inventory item to this ground."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ground">Ground</Label>
              <Select
                value={selectedGround}
                onValueChange={setSelectedGround}
                disabled={!!selectedInventoryItem}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a ground" />
                </SelectTrigger>
                <SelectContent>
                  {grounds.map(ground => (
                    <SelectItem key={ground.id} value={ground.id}>
                      {ground.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {!selectedInventoryItem && (
              <div className="space-y-2">
                <Label htmlFor="item">Inventory Item</Label>
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} (₹{item.price}) - Available: {item.availableQuantity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAllocation}>
              {selectedInventoryItem ? "Update" : "Allocate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroundInventoryTable;

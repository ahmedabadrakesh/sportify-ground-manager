
import React, { useState } from "react";
import { PlusCircle, Package, ListPlus } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InventoryTable from "@/components/inventory/InventoryTable";
import { getCurrentUser, hasRole } from "@/utils/auth";
import { addInventoryItem, getAllInventoryItems, getGroundInventory, useInventoryItems } from "@/utils/inventory";
import { grounds } from "@/data/mockData";
import { toast } from "sonner";

const AdminInventory: React.FC = () => {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  
  const currentUser = getCurrentUser();
  const isSuperAdmin = hasRole('super_admin');
  
  // Get user's grounds
  const userGrounds = isSuperAdmin
    ? grounds
    : grounds.filter(ground => ground.ownerId === currentUser?.id);
  
  // Get ground inventory
  const inventory = userGrounds.flatMap(ground => 
    getGroundInventory(ground.id)
  );
  
  // Group inventory by ground
  const inventoryByGround = userGrounds.map(ground => ({
    ground,
    inventory: getGroundInventory(ground.id),
  }));
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newItemData.name || !newItemData.category || !newItemData.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new item (only super admin can do this)
    if (isSuperAdmin) {
      const newItem = addInventoryItem({
        name: newItemData.name,
        category: newItemData.category,
        price: parseFloat(newItemData.price),
        description: newItemData.description,
      });
      
      toast.success(`Item "${newItem.name}" added successfully`);
      setIsAddItemDialogOpen(false);
      setNewItemData({
        name: "",
        category: "",
        price: "",
        description: "",
      });
    } else {
      toast.error("Only super admins can add new inventory items");
    }
  };
  
  const handleUseItem = (groundId: string, itemId: string, quantity: number) => {
    const used = useInventoryItems(groundId, itemId, quantity);
    
    if (used) {
      toast.success(`Inventory updated successfully`);
    } else {
      toast.error("Failed to update inventory");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">
            {isSuperAdmin
              ? "Manage inventory items and allocate them to grounds"
              : "Manage your ground inventory"}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {isSuperAdmin && (
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Create a new inventory item that can be allocated to grounds.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddItem} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Tennis Ball (Soft)"
                      value={newItemData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="e.g., Tennis, Cricket, Football"
                      value={newItemData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="e.g., 150"
                      value={newItemData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Enter item description"
                      value={newItemData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddItemDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Item</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          
          {isSuperAdmin && (
            <Button
              className="flex items-center"
              onClick={() => window.location.href = "/admin/inventory/allocate"}
            >
              <ListPlus className="h-4 w-4 mr-2" />
              Allocate Inventory
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Overview */}
      {isSuperAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">All Inventory Items</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAllInventoryItems().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">₹{item.price}</TableCell>
                    <TableCell>{item.description || "-"}</TableCell>
                  </TableRow>
                ))}
                
                {getAllInventoryItems().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Ground Inventory */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {isSuperAdmin ? "Ground Inventory" : "Your Inventory"}
        </h2>
        
        {inventoryByGround.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">
              No grounds or inventory found.
            </p>
            {isSuperAdmin && (
              <Button onClick={() => setIsAddItemDialogOpen(true)}>
                Add Inventory Items
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {inventoryByGround.map(({ ground, inventory }) => (
              <div key={ground.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-gray-50 border-b px-4 py-3">
                  <h3 className="font-medium">{ground.name}</h3>
                </div>
                
                <InventoryTable
                  inventory={inventory}
                  onUseItem={(itemId, quantity) =>
                    handleUseItem(ground.id, itemId, quantity)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;

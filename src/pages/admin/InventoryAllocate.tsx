
import React, { useState } from "react";
import { Check, Package } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { hasRole } from "@/utils/auth";
import { allocateInventory, getAllInventoryItems, getGroundInventory } from "@/utils/inventory";
import { grounds } from "@/data/mockData";
import { toast } from "sonner";

const InventoryAllocate: React.FC = () => {
  const [selectedGround, setSelectedGround] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  
  // Check if the current user is a super admin
  if (!hasRole('super_admin')) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page.
          </p>
        </div>
      </AdminLayout>
    );
  }
  
  const inventoryItems = getAllInventoryItems();
  
  const handleAllocate = () => {
    if (!selectedGround || !selectedItem || quantity <= 0) {
      toast.error("Please select a ground, an item, and a valid quantity");
      return;
    }
    
    const allocated = allocateInventory(selectedGround, selectedItem, quantity);
    
    if (allocated) {
      toast.success("Inventory allocated successfully");
      setSelectedItem("");
      setQuantity(1);
    } else {
      toast.error("Failed to allocate inventory");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Allocate Inventory</h1>
        <p className="text-gray-600">
          Assign inventory items to specific grounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Ground Inventory</CardTitle>
              <CardDescription>
                Select a ground to view and allocate inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  value={selectedGround}
                  onValueChange={setSelectedGround}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ground" />
                  </SelectTrigger>
                  <SelectContent>
                    {grounds.map((ground) => (
                      <SelectItem key={ground.id} value={ground.id}>
                        {ground.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedGround ? (
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
                      {getGroundInventory(selectedGround).map((item) => (
                        <TableRow key={item.itemId}>
                          <TableCell className="font-medium">{item.itemName}</TableCell>
                          <TableCell className="text-right">₹{item.itemPrice}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                      
                      {getGroundInventory(selectedGround).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                            No inventory assigned to this ground yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Select a ground to view its inventory
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Inventory Items</CardTitle>
              <CardDescription>
                All inventory items that can be allocated to grounds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">₹{item.price}</TableCell>
                      </TableRow>
                    ))}
                    
                    {inventoryItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                          No inventory items available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Allocate Inventory</CardTitle>
              <CardDescription>
                Assign items to the selected ground.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InventoryAllocate;
